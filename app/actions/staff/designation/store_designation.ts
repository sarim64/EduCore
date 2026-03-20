import Designation from '#models/designation'
import { createDesignationValidator } from '#validators/designation'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createDesignationValidator>
}

export default class StoreDesignation {
  static async handle({ schoolId, data }: Params) {
    return Designation.create({
      schoolId,
      departmentId: data.departmentId,
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    })
  }
}
