import FeeCategory from '#models/fee_category'
import { createFeeCategoryValidator } from '#validators/fee_category'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createFeeCategoryValidator>
}

export default class StoreFeeCategory {
  static async handle({ schoolId, data }: Params) {
    return FeeCategory.create({
      ...data,
      schoolId,
    })
  }
}
