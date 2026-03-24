import Department from '#models/department'
import { createDepartmentValidator } from '#validators/department'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createDepartmentValidator>
}

export default class StoreDepartment {
  static async handle({ schoolId, data }: Params) {
    return Department.create({
      schoolId,
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    })
  }
}
