import StaffDocument from '#models/staff_document'
import { createStaffDocumentValidator } from '#validators/staff_document'
import { Infer } from '@vinejs/vine/types'

type Params = {
  staffMemberId: string
  data: Infer<typeof createStaffDocumentValidator>
}

export default class StoreStaffDocument {
  static async handle({ staffMemberId, data }: Params) {
    return StaffDocument.create({
      staffMemberId,
      ...data,
    })
  }
}
