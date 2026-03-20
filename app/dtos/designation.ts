import { BaseModelDto } from '@adocasts.com/dto/base'
import Designation from '#models/designation'
import DepartmentDto from '#dtos/department'

export default class DesignationDto extends BaseModelDto {
  declare id: string
  declare departmentId: string
  declare name: string
  declare description: string | null
  declare isActive: boolean
  declare createdAt: string
  declare updatedAt: string | null
  declare department: DepartmentDto | null

  constructor(designation?: Designation) {
    super()

    if (!designation) return
    this.id = designation.id
    this.departmentId = designation.departmentId
    this.name = designation.name
    this.description = designation.description
    this.isActive = designation.isActive
    this.createdAt = designation.createdAt.toISO()!
    this.updatedAt = designation.updatedAt?.toISO() ?? null
    this.department = designation.department ? new DepartmentDto(designation.department) : null
  }
}
