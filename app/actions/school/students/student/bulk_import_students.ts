import Student from '#models/student'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import SubscriptionLimitService from '#services/subscription_limit_service'

interface StudentRow {
  firstName: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  religion?: string
  nationality?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  admissionDate?: string
  previousSchool?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  medicalConditions?: string
  allergies?: string
}

interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; error: string; data: StudentRow }>
  students: Student[]
}

type Params = {
  schoolId: string
  rows: StudentRow[]
}

export default class BulkImportStudents {
  static async handle({ schoolId, rows }: Params): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      students: [],
    }

    // Use transaction to ensure data integrity
    await db.transaction(async (trx) => {
      for (const [index, row] of rows.entries()) {
        try {
          await SubscriptionLimitService.assertCanAddStudents(schoolId, 1, trx)

          // Validate required fields
          if (!row.firstName?.trim()) {
            throw new Error('First name is required')
          }

          // Generate student ID
          const studentId = await this.#generateStudentId(schoolId, trx)

          // Create student
          const student = await Student.create(
            {
              schoolId,
              studentId,
              firstName: row.firstName.trim(),
              lastName: row.lastName?.trim() || null,
              dateOfBirth: row.dateOfBirth ? DateTime.fromISO(row.dateOfBirth) : undefined,
              gender: row.gender || null,
              bloodGroup: row.bloodGroup || null,
              religion: row.religion || null,
              nationality: row.nationality || null,
              email: row.email || null,
              phone: row.phone || null,
              address: row.address || null,
              city: row.city || null,
              state: row.state || null,
              postalCode: row.postalCode || null,
              country: row.country || null,
              admissionDate: row.admissionDate
                ? DateTime.fromISO(row.admissionDate)
                : DateTime.now(),
              previousSchool: row.previousSchool || null,
              emergencyContactName: row.emergencyContactName || null,
              emergencyContactPhone: row.emergencyContactPhone || null,
              medicalConditions: row.medicalConditions || null,
              allergies: row.allergies || null,
              status: 'active',
            },
            { client: trx }
          )

          result.students.push(student)
          result.success++
        } catch (error) {
          result.failed++
          result.errors.push({
            row: index + 1, // 1-based row number
            error: error.message,
            data: row,
          })
        }
      }
    })

    return result
  }

  static async #generateStudentId(schoolId: string, trx?: any): Promise<string> {
    const currentYear = DateTime.now().year

    const query = Student.query()
      .where('schoolId', schoolId)
      .where('studentId', 'like', `STU-${currentYear}-%`)
      .orderBy('studentId', 'desc')

    if (trx) {
      query.useTransaction(trx)
    }

    const lastStudent = await query.first()

    const sequence = lastStudent ? Number.parseInt(lastStudent.studentId.split('-')[2]) + 1 : 1

    return `STU-${currentYear}-${sequence.toString().padStart(4, '0')}`
  }
}
