import SchoolSubscription from '#models/school_subscription'

export default class GetSchoolSubscription {
  static async handle({ schoolId }: { schoolId: string }) {
    return SchoolSubscription.query().where('schoolId', schoolId).preload('plan').first()
  }
}
