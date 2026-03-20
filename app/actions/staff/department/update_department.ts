import Department from '#models/department'
import { updateDepartmentValidator } from '#validators/department'
import { Infer } from '@vinejs/vine/types'

type Params = {
  departmentId: string
  schoolId: string
  data: Infer<typeof updateDepartmentValidator>
}

export default class UpdateDepartment {
  static async handle({ departmentId, schoolId, data }: Params) {
    const department = await Department.query()
      .where('id', departmentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    department.merge(data)
    await department.save()

    return department
  }
}
