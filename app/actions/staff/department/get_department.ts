import Department from '#models/department'

type Params = {
  departmentId: string
  schoolId: string
}

export default class GetDepartment {
  static async handle({ departmentId, schoolId }: Params) {
    return Department.query().where('id', departmentId).where('schoolId', schoolId).firstOrFail()
  }
}
