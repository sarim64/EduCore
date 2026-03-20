import LeaveType from '#models/leave_type'
import { createLeaveTypeValidator } from '#validators/leave_type'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createLeaveTypeValidator>
}

export default class StoreLeaveType {
  static async handle({ schoolId, data }: Params) {
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
