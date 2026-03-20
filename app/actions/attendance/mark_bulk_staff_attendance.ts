import StaffAttendance from '#models/staff_attendance'
import Staff from '#models/staff_member'
import { bulkStaffAttendanceValidator } from '#validators/staff_attendance'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof bulkStaffAttendanceValidator>
}

export default class MarkBulkStaffAttendance {
  static async handle({ schoolId, userId, data }: Params) {
    const attendanceDate = DateTime.fromJSDate(data.date)

    // Verify date is not in the future
    if (attendanceDate > DateTime.now().startOf('day')) {
      throw new Error('Cannot mark attendance for future dates')
    }

    // Get all staff IDs from the request
    const staffIds = data.attendances.map((a) => a.staffMemberId)

    // Verify all staff members belong to the school
    const staffMembers = await Staff.query()
      .whereIn('id', staffIds)
      .where('schoolId', schoolId)
      .select('id')

    const validStaffIds = new Set(staffMembers.map((s) => s.id))
    const invalidStaff = staffIds.filter((id) => !validStaffIds.has(id))

    if (invalidStaff.length > 0) {
      throw new Error('Some staff members do not belong to this school')
    }

    return db.transaction(async (trx) => {
      const results = []

      for (const attendance of data.attendances) {
        // Check if attendance already exists for this staff and date
        const existingAttendance = await StaffAttendance.query({ client: trx })
          .where('schoolId', schoolId)
          .where('staffMemberId', attendance.staffMemberId)
          .whereRaw('date = ?', [attendanceDate.toISODate()!])
          .first()

        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = attendance.status
          existingAttendance.checkInTime = attendance.checkInTime ?? null
          existingAttendance.checkOutTime = attendance.checkOutTime ?? null
          existingAttendance.remarks = attendance.remarks ?? null
          existingAttendance.markedById = userId
          await existingAttendance.save()
          results.push(existingAttendance)
        } else {
          // Create new attendance record
          const newAttendance = await StaffAttendance.create(
            {
              schoolId,
              staffMemberId: attendance.staffMemberId,
              date: attendanceDate,
              status: attendance.status,
              checkInTime: attendance.checkInTime ?? null,
              checkOutTime: attendance.checkOutTime ?? null,
              remarks: attendance.remarks ?? null,
              markedById: userId,
            },
            { client: trx }
          )
          results.push(newAttendance)
        }
      }

      return results
    })
  }
}
