import StudentDocument from '#models/student_document'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import type { MultipartFile } from '@adonisjs/core/types/bodyparser'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  studentId: string
  name: string
  type: string
  file: MultipartFile
  ctx: HttpContext
  userId: string
}

export default class StoreStudentDocument {
  static async handle({ schoolId, studentId, name, type, file, ctx, userId }: Params) {
    // Generate unique filename
    const fileName = `${cuid()}.${file.extname}`
    const filePath = `uploads/students/${studentId}/documents/${fileName}`

    // Move file to storage
    await file.move(app.makePath('storage'), {
      name: fileName,
    })

    // Create document record
    const document = await StudentDocument.create({
      schoolId,
      studentId,
      name,
      type,
      filePath,
      fileName: file.clientName,
      mimeType: file.type,
      fileSize: file.size,
    })

    await AuditService.logCreate(
      'StudentDocument',
      document.id,
      { studentId, name, type, fileName: file.clientName },
      ctx,
      schoolId,
      userId
    )

    return document
  }
}
