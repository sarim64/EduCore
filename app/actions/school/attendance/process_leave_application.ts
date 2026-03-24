import LeaveApplication from '#models/leave_application'
import StaffAttendance from '#models/staff_attendance'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

type ProcessParams = {
  schoolId: string
  applicationId: string
  userId: string
  action: 'approve' | 'reject'
  remarks?: string
}

type CancelParams = {
  schoolId: string
  applicationId: string
  staffMemberId: string
}

export default class ProcessLeaveApplication {
  static async process({ schoolId, applicationId, userId, action, remarks }: ProcessParams) {
    return db.transaction(async (trx) => {
      const application = await LeaveApplication.query({ client: trx })
        .where('id', applicationId)
        .where('schoolId', schoolId)
        .where('status', 'pending')
        .firstOrFail()

      application.status = action === 'approve' ? 'approved' : 'rejected'
      application.reviewedById = userId
      application.reviewedAt = DateTime.now()
      application.reviewerRemarks = remarks ?? null

      await application.save()

      // If approved, create staff attendance records as 'on_leave'
      if (action === 'approve') {
        await this.#createLeaveAttendanceRecords(
          application.schoolId,
          application.staffMemberId,
          application.startDate,
          application.endDate,
          userId,
          trx
        )
      }

      return application
    })
  }

  static async cancel({ schoolId, applicationId, staffMemberId }: CancelParams) {
    const application = await LeaveApplication.query()
      .where('id', applicationId)
      .where('schoolId', schoolId)
      .where('staffMemberId', staffMemberId)
      .where('status', 'pending')
      .firstOrFail()

    application.status = 'cancelled'
    await application.save()

    return application
  }

  static async #createLeaveAttendanceRecords(
    schoolId: string,
    staffMemberId: string,
    startDate: DateTime,
    endDate: DateTime,
    markedById: string,
    trx: any
  ) {
    let currentDate = startDate

    while (currentDate <= endDate) {
      // Check if attendance already exists for this date
      const existing = await StaffAttendance.query({ client: trx })
        .where('schoolId', schoolId)
        .where('staffMemberId', staffMemberId)
        .whereRaw('date = ?', [currentDate.toISODate()!])
        .first()

      if (existing) {
        // Update existing record to on_leave
        existing.status = 'on_leave'
        existing.markedById = markedById
        existing.remarks = 'Approved leave'
        await existing.save()
      } else {
        // Create new on_leave record
        await StaffAttendance.create(
          {
            schoolId,
            staffMemberId,
            date: currentDate,
            status: 'on_leave',
            markedById,
            remarks: 'Approved leave',
          },
          { client: trx }
        )
      }

      currentDate = currentDate.plus({ days: 1 })
    }
  }
}
