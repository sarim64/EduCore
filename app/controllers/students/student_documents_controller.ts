import GetStudentDocument from '#actions/students/document/get_student_document'
import StoreStudentDocument from '#actions/students/document/store_student_document'
import DeleteStudentDocument from '#actions/students/document/delete_student_document'
import { createStudentDocumentValidator } from '#validators/student_document'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { createReadStream } from 'node:fs'

export default class StudentDocumentsController {
  async store({ request, response, session, params }: HttpContext) {
    const schoolId = session.get('schoolId')
    const { studentId } = params
    const data = await request.validateUsing(createStudentDocumentValidator)

    await StoreStudentDocument.handle({
      schoolId,
      studentId,
      name: data.name,
      type: data.type,
      file: data.file,
    })

    session.flash('success', 'Document uploaded successfully')
    return response.redirect().back()
  }

  async download({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    const document = await GetStudentDocument.handle({
      documentId: params.id,
      schoolId,
    })

    const filePath = app.makePath('storage', document.filePath)
    const stream = createReadStream(filePath)

    response.header('Content-Type', document.mimeType || 'application/octet-stream')
    response.header('Content-Disposition', `attachment; filename="${document.fileName}"`)

    return response.stream(stream)
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    // Verify document belongs to school
    await GetStudentDocument.handle({
      documentId: params.id,
      schoolId,
    })

    await DeleteStudentDocument.handle({ id: params.id })

    session.flash('success', 'Document deleted successfully')
    return response.redirect().back()
  }
}
