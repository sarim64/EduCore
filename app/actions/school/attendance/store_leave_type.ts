import LeaveType from '#models/leave_type'
import { createLeaveTypeValidator } from '#validators/leave_type'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createLeaveTypeValidator>
}

export default class StoreLeaveType {
  static async handle({ schoolId, data }: Params) {
    const existing = await LeaveType.query()
      .where('schoolId', schoolId)
      .where('code', data.code)
      .first()

    if (existing) {
      const e = new Error('Leave type code already exists') as any
      e.code = 'E_DUPLICATE_LEAVE_TYPE_CODE'
      throw e
    }

    return LeaveType.create({
      schoolId,
      name: data.name,
      code: data.code,
      description: data.description ?? null,
      allowedDays: data.allowedDays ?? 0,
      isPaid: data.isPaid ?? false,
      isActive: data.isActive ?? true,
      appliesTo: data.appliesTo ?? 'all',
    })
  }
}
