import Department from '#models/department'

type Params = {
  schoolId: string
}

export default class ListDepartments {
  static async handle({ schoolId }: Params) {
    return Department.query().where('schoolId', schoolId).orderBy('name', 'asc')
  }
}
