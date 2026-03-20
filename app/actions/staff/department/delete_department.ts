import Department from '#models/department'

type Params = {
  departmentId: string
  schoolId: string
}

export default class DeleteDepartment {
  static async handle({ departmentId, schoolId }: Params) {
    const department = await Department.query()
      .where('id', departmentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await department.delete()

    return department
  }
}
