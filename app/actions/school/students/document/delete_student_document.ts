import StudentDocument from '#models/student_document'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'

type Params = {
  id: string
}

export default class DeleteStudentDocument {
  static async handle({ id }: Params) {
    const document = await StudentDocument.findOrFail(id)

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
  }
}
