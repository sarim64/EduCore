import StaffDocument from '#models/staff_document'

type Params = {
  documentId: string
  staffMemberId: string
}

export default class DeleteStaffDocument {
  static async handle({ documentId, staffMemberId }: Params) {
    const document = await StaffDocument.query()
      .where('id', documentId)
      .where('staffMemberId', staffMemberId)
      .firstOrFail()

    await document.delete()
  }
}
