import StudentDocument from '#models/student_document'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import type { MultipartFile } from '@adonisjs/core/types/bodyparser'

type Params = {
  schoolId: string
  studentId: string
  name: string
  type: string
  file: MultipartFile
}

export default class StoreStudentDocument {
  static async handle({ schoolId, studentId, name, type, file }: Params) {
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

    return document
  }
}
