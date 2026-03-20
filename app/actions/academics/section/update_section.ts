import Section from '#models/section'
import { updateSectionValidator } from '#validators/section'
import { Infer } from '@vinejs/vine/types'

type Params = {
  sectionId: string
  schoolId: string
  data: Infer<typeof updateSectionValidator>
}

export default class UpdateSection {
  static async handle({ sectionId, schoolId, data }: Params) {
    const section = await Section.query()
      .where('id', sectionId)
      .where('schoolId', schoolId)
      .firstOrFail()

    section.merge(data)
    await section.save()

    return section
  }
}
