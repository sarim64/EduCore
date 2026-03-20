import LeaveApplication from '#models/leave_application'
import LeaveType from '#models/leave_type'
import Staff from '#models/staff_member'
import { applyLeaveValidator } from '#validators/leave_application'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  staffMemberId: string
  data: Infer<typeof applyLeaveValidator>
}

export default class ApplyLeave {
  static async handle({ schoolId, staffMemberId, data }: Params) {
    // Verify staff belongs to school
    const staff = await Staff.query().where('id', staffMemberId).where('schoolId', schoolId).first()

    if (!staff) {
      throw new Error('Staff Member not found or does not belong to this school')
    }

    // Verify leave type belongs to school
    const leaveType = await LeaveType.query()
      .where('id', data.leaveTypeId)
      .where('schoolId', schoolId)
      .where('isActive', true)
      .first()

    if (!leaveType) {
      throw new Error('Leave type not found or inactive')
    }

    const startDate = DateTime.fromJSDate(data.startDate)
    const endDate = DateTime.fromJSDate(data.endDate)

    // Validate dates
    if (endDate < startDate) {
      throw new Error('End date must be after start date')
    }

    // Calculate total days
    const totalDays = Math.ceil(endDate.diff(startDate, 'days').days) + 1

    // Check for overlapping leave applications
    const overlapping = await LeaveApplication.query()
      .where('schoolId', schoolId)
      .where('staffMemberId', staffMemberId)
      .whereIn('status', ['pending', 'approved'])
      .where((query) => {
        query
          .whereBetween('startDate', [startDate.toISODate()!, endDate.toISODate()!])
          .orWhereBetween('endDate', [startDate.toISODate()!, endDate.toISODate()!])
          .orWhere((q) => {
            q.where('startDate', '<=', startDate.toISODate()!).where(
              'endDate',
              '>=',
              endDate.toISODate()!
            )
          })
      })
      .first()

    if (overlapping) {
      throw new Error('You already have a leave application for these dates')
    }

    return LeaveApplication.create({
      schoolId,
      staffMemberId,
      leaveTypeId: data.leaveTypeId,
      startDate,
      endDate,
      totalDays,
      reason: data.reason,
      status: 'pending',
      appliedOn: DateTime.now(),
    })
  }
}
