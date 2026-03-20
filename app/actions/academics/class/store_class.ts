import SchoolClass from '#models/school_class'
import { createClassValidator } from '#validators/school_class'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createClassValidator>
}

export default class StoreClass {
  static async handle({ schoolId, data }: Params) {
    return SchoolClass.create({
      schoolId,
      name: data.name,
      code: data.code ?? null,
      displayOrder: data.displayOrder ?? 0,
      description: data.description ?? null,
    })
  }
}
