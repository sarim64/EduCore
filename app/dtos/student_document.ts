import StudentDocument from '#models/student_document'

export default class StudentDocumentDto {
  declare id: string
  declare schoolId: string
  declare studentId: string
  declare name: string
  declare type: string
  declare filePath: string
  declare fileName: string
  declare mimeType: string | null
  declare fileSize: number | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(document?: StudentDocument) {
    if (!document) return

    this.id = document.id
    this.schoolId = document.schoolId
    this.studentId = document.studentId
    this.name = document.name
    this.type = document.type
    this.filePath = document.filePath
    this.fileName = document.fileName
    this.mimeType = document.mimeType
    this.fileSize = document.fileSize
    this.createdAt = document.createdAt.toISO()!
    this.updatedAt = document.updatedAt?.toISO() ?? null
  }
}
