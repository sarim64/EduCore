import StaffDocument from '#models/staff_document'

type Params = {
  documentId: string
  staffMemberId: string
}

export default class GetStaffDocument {
  static async handle({ documentId, staffMemberId }: Params) {
    return StaffDocument.query()
      .where('id', documentId)
      .where('staffMemberId', staffMemberId)
      .firstOrFail()
  }
}
