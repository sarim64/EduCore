import { BaseModelDto } from '@adocasts.com/dto/base'
import Department from '#models/department'

export default class DepartmentDto extends BaseModelDto {
  declare id: string
  declare name: string
  declare description: string | null
  declare isActive: boolean
  declare headId: string | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(department?: Department) {
    super()

    if (!department) return
    this.id = department.id
    this.name = department.name
    this.description = department.description
    this.isActive = department.isActive
    this.headId = department.headId
    this.createdAt = department.createdAt.toISO()!
    this.updatedAt = department.updatedAt?.toISO() ?? null
  }
}
