import StaffAttendance from '#models/staff_attendance'
import Staff from '#models/staff_member'
import { markStaffAttendanceValidator } from '#validators/staff_attendance'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof markStaffAttendanceValidator>
}

export default class MarkStaffAttendance {
  static async handle({ schoolId, userId, data }: Params) {
    // Verify staff belongs to school
    const staff = await Staff.query()
      .where('id', data.staffMemberId)
      .where('schoolId', schoolId)
      .first()

    if (!staff) {
      throw new Error('Staff not found or does not belong to this school')
    }

    // Verify date is not in the future
    const attendanceDate = DateTime.fromJSDate(data.date)
    if (attendanceDate > DateTime.now().startOf('day')) {
      throw new Error('Cannot mark attendance for future dates')
    }

    // Check if attendance already exists for this staff and date
    const existingAttendance = await StaffAttendance.query()
      .where('schoolId', schoolId)
      .where('staffMemberId', data.staffMemberId)
      .whereRaw('date = ?', [attendanceDate.toISODate()!])
      .first()

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = data.status
      existingAttendance.checkInTime = data.checkInTime ?? null
      existingAttendance.checkOutTime = data.checkOutTime ?? null
      existingAttendance.remarks = data.remarks ?? null
      existingAttendance.markedById = userId
      await existingAttendance.save()
      return existingAttendance
    }

    // Create new attendance record
    return StaffAttendance.create({
      schoolId,
      staffMemberId: data.staffMemberId,
      date: attendanceDate,
      status: data.status,
      checkInTime: data.checkInTime ?? null,
      checkOutTime: data.checkOutTime ?? null,
      remarks: data.remarks ?? null,
      markedById: userId,
    })
  }
}
