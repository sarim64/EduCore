import StudentDocument from '#models/student_document'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  ctx: HttpContext
  userId: string
}

export default class DeleteStudentDocument {
  static async handle({ id, ctx, userId }: Params) {
    const document = await StudentDocument.findOrFail(id)
    const schoolId = document.schoolId
    const oldValues = { studentId: document.studentId, name: document.name, type: document.type, fileName: document.fileName }

    // Delete file from storage
    try {
      const fullPath = app.makePath('storage', document.filePath)
      await unlink(fullPath)
    } catch (error) {
      // File might not exist, continue with database deletion
      console.error('Error deleting file:', error)
    }

    // Delete document record
    await document.delete()

    await AuditService.logDelete('StudentDocument', id, oldValues, ctx, schoolId ?? undefined, userId)
  }
}
