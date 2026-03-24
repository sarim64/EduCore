import Section from '#models/section'
import { createSectionValidator } from '#validators/section'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createSectionValidator>
}

export default class StoreSection {
  static async handle({ schoolId, data }: Params) {
    return Section.create({
      schoolId,
      classId: data.classId,
      name: data.name,
      capacity: data.capacity ?? 40,
      roomNumber: data.roomNumber ?? null,
    })
  }
}
