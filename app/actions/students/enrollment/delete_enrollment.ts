import Enrollment from '#models/enrollment'

type Params = {
  id: string
}

export default class DeleteEnrollment {
  static async handle({ id }: Params) {
    const enrollment = await Enrollment.findOrFail(id)
    await enrollment.delete()
  }
}
