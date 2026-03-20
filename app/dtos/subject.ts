import { BaseModelDto } from '@adocasts.com/dto/base'
import Subject from '#models/subject'

export default class SubjectDto extends BaseModelDto {
  declare id: string
  declare name: string
  declare code: string | null
  declare description: string | null
  declare isElective: boolean
  declare createdAt: string
  declare updatedAt: string | null

  constructor(subject?: Subject) {
    super()

    if (!subject) return
    this.id = subject.id
    this.name = subject.name
    this.code = subject.code
    this.description = subject.description
    this.isElective = subject.isElective
    this.createdAt = subject.createdAt.toISO()!
    this.updatedAt = subject.updatedAt?.toISO() ?? null
  }
}
