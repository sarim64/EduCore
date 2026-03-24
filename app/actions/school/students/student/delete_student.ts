import Student from '#models/student'

type Params = {
  id: string
}

export default class DeleteStudent {
  static async handle({ id }: Params) {
    const student = await Student.findOrFail(id)
    await student.delete()
  }
}
