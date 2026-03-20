import { BaseModelDto } from '@adocasts.com/dto/base'
import StaffDocument from '#models/staff_document'

export default class StaffDocumentDto extends BaseModelDto {
  declare id: string
  declare staffMemberId: string
  declare name: string
  declare type: string
  declare fileUrl: string
  declare fileType: string | null
  declare fileSize: number | null
  declare notes: string | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(document?: StaffDocument) {
    super()

    if (!document) return
    this.id = document.id
    this.staffMemberId = document.staffMemberId
    this.name = document.name
    this.type = document.type
    this.fileUrl = document.fileUrl
    this.fileType = document.fileType
    this.fileSize = document.fileSize
    this.notes = document.notes
    this.createdAt = document.createdAt.toISO()!
    this.updatedAt = document.updatedAt?.toISO() ?? null
  }
}
