import StudentDocument from '#models/student_document'

type Params = {
  documentId: string
  schoolId: string
}

export default class GetStudentDocument {
  static async handle({ documentId, schoolId }: Params) {
    return StudentDocument.query().where('id', documentId).where('schoolId', schoolId).firstOrFail()
  }
}
