import StaffDocument from '#models/staff_document'
import { updateStaffDocumentValidator } from '#validators/staff_document'
import { Infer } from '@vinejs/vine/types'

type Params = {
  documentId: string
  staffMemberId: string
  data: Infer<typeof updateStaffDocumentValidator>
}

export default class UpdateStaffDocument {
  static async handle({ documentId, staffMemberId, data }: Params) {
    const document = await StaffDocument.query()
      .where('id', documentId)
      .where('staffMemberId', staffMemberId)
      .firstOrFail()

    document.merge(data)
    await document.save()

    return document
  }
}
