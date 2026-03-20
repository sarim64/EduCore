import SchoolClass from '#models/school_class'
import { updateClassValidator } from '#validators/school_class'
import { Infer } from '@vinejs/vine/types'

type Params = {
  classId: string
  schoolId: string
  data: Infer<typeof updateClassValidator>
}

export default class UpdateClass {
  static async handle({ classId, schoolId, data }: Params) {
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('schoolId', schoolId)
      .firstOrFail()

    schoolClass.merge(data)
    await schoolClass.save()

    return schoolClass
  }
}
