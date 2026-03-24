import GetStudent from '#actions/school/students/student/get_student'
import StoreStudent from '#actions/school/students/student/store_student'
import UpdateStudent from '#actions/school/students/student/update_student'
import DeleteStudent from '#actions/school/students/student/delete_student'
import BulkImportStudents from '#actions/school/students/student/bulk_import_students'
import ListClasses from '#actions/school/academics/class/list_classes'
import ListAcademicYears from '#actions/school/academics/year/list_academic_years'
import ListGuardians from '#actions/school/students/guardian/list_guardians'
import StudentDto from '#dtos/student'
import GuardianDto from '#dtos/guardian'
import EnrollmentDto from '#dtos/enrollment'
import StudentDocumentDto from '#dtos/student_document'
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentsController {
  async index({ session, inertia, request }: HttpContext) {
    const schoolId = session.get('schoolId')
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const status = request.input('status', '')

    // Use action for base query, then apply pagination
    const { default: Student } = await import('#models/student')
    let query = Student.query()
      .where('schoolId', schoolId)
      .preload('enrollments', (q) => {
        q.preload('class')
        q.preload('section')
        q.preload('academicYear')
        q.orderBy('createdAt', 'desc')
        q.limit(1)
      })
      .orderBy('firstName', 'asc')

    if (search) {
      query = query.where((q) => {
        q.whereILike('firstName', `%${search}%`)
          .orWhereILike('lastName', `%${search}%`)
          .orWhereILike('studentId', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
      })
    }

    if (status) {
      query = query.where('status', status)
    }

    const students = await query.paginate(page, 20)

    return inertia.render('school/students/index', {
      students: {
        ...students.serialize(),
        data: students.all().map((s) => new StudentDto(s)),
      },
      filters: { search, status },
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const academicYears = await ListAcademicYears.handle({ schoolId })
    const currentYear = academicYears.find((y) => y.isCurrent)
    const classes = await ListClasses.handle({ schoolId })

    return inertia.render('school/students/create', {
      academicYears,
      currentYear,
      classes,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const after = request.input('after')
    const data = await request.validateUsing(createStudentValidator)
    let student

    try {
      student = await StoreStudent.handle({ schoolId, data })
    } catch (error) {
      if (error?.code === 'E_SUBSCRIPTION_STUDENT_LIMIT_REACHED') {
        session.flash('error', error.message)
        return response.redirect().back()
      }
      throw error
    }

    if (after === 'index') {
      session.flash('success', 'Student created successfully')
      return response.redirect().toRoute('students.index')
    }

    session.flash('success', 'Student created successfully. You can upload documents now.')
    return response.redirect().toRoute('students.show', { id: student.id })
  }

  async show({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const student = await GetStudent.handle({
      studentId: params.id,
      schoolId,
    })

    const classes = await ListClasses.handle({ schoolId })
    const academicYears = await ListAcademicYears.handle({ schoolId })
    const allGuardians = await ListGuardians.handle({ schoolId })
    const attachedGuardianIds = new Set((student.guardians ?? []).map((guardian) => guardian.id))
    const availableGuardians = allGuardians.filter((guardian) => !attachedGuardianIds.has(guardian.id))

    return inertia.render('school/students/show', {
      student: new StudentDto(student),
      guardians: student.guardians?.map((g) => new GuardianDto(g)) || [],
      availableGuardians: availableGuardians.map((guardian) => new GuardianDto(guardian)),
      enrollments: student.enrollments?.map((e) => new EnrollmentDto(e)) || [],
      documents: student.documents?.map((d) => new StudentDocumentDto(d)) || [],
      classes,
      academicYears,
    })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const student = await GetStudent.handle({
      studentId: params.id,
      schoolId,
    })

    return inertia.render('school/students/edit', { student: new StudentDto(student) })
  }

  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(updateStudentValidator)

    await UpdateStudent.handle({ id: params.id, data })

    session.flash('success', 'Student updated successfully')
    return response.redirect().toRoute('students.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    await DeleteStudent.handle({ id: params.id })

    session.flash('success', 'Student deleted successfully')
    return response.redirect().toRoute('students.index')
  }

  async import({ inertia }: HttpContext) {
    return inertia.render('school/students/import')
  }

  async processImport({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    // Get uploaded file
    const file = request.file('file', {
      size: '5mb',
      extnames: ['csv', 'xlsx', 'xls'],
    })

    if (!file) {
      session.flash('error', 'Please upload a CSV or Excel file')
      return response.redirect().back()
    }

    if (!file.isValid) {
      session.flash('error', file.errors[0].message)
      return response.redirect().back()
    }

    try {
      // Move file to temp location and read content
      await file.move('tmp')
      const fs = await import('node:fs/promises')
      const content = await fs.readFile(file.filePath!, 'utf-8')

      // Parse CSV content
      const rows = this.#parseCSV(content)

      // Perform bulk import
      const result = await BulkImportStudents.handle({ schoolId, rows })

      // Flash results
      if (result.success > 0) {
        session.flash(
          'success',
          `Successfully imported ${result.success} student(s). ${result.failed} failed.`
        )
      }

      if (result.errors.length > 0) {
        const limitError = result.errors.find((e) => e.error.includes('Student limit reached'))
        if (limitError) {
          session.flash(
            'error',
            'Student limit reached for your current plan. Upgrade your subscription to import more students.'
          )
        }
        session.flash('errors', result.errors)
      }

      return response.redirect().toRoute('students.index')
    } catch (error) {
      session.flash('error', `Import failed: ${error.message}`)
      return response.redirect().back()
    }
  }

  #parseCSV(content: string) {
    const lines = content.split('\n').filter((line) => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row')
    }

    const headers = lines[0].split(',').map((h) => h.trim())
    const rows: any[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim())
      const row: any = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })

      rows.push(row)
    }

    return rows
  }
}
