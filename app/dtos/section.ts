import { BaseModelDto } from '@adocasts.com/dto/base'
import Section from '#models/section'

export default class SectionDto extends BaseModelDto {
  declare id: string
  declare classId: string
  declare name: string
  declare capacity: number
  declare roomNumber: string | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(section?: Section) {
    super()

    if (!section) return
    this.id = section.id
    this.classId = section.classId
    this.name = section.name
    this.capacity = section.capacity
    this.roomNumber = section.roomNumber
    this.createdAt = section.createdAt.toISO()!
    this.updatedAt = section.updatedAt?.toISO() ?? null
  }
}
