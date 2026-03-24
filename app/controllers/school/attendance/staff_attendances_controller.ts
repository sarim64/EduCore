import StaffAttendance from '#models/staff_attendance'
import Staff from '#models/staff_member'
import MarkStaffAttendance from '#actions/school/attendance/mark_staff_attendance'
import MarkBulkStaffAttendance from '#actions/school/attendance/mark_bulk_staff_attendance'
import StaffAttendanceDto from '#dtos/staff_attendance'
import StaffDto from '#dtos/staff_member'
import {
  markStaffAttendanceValidator,
  bulkStaffAttendanceValidator,
} from '#validators/staff_attendance'
import type { HttpContext } from '@adonisjs/core/http'

export default class StaffAttendancesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const staffMembers = await Staff.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .orderBy('firstName', 'asc')

    return inertia.render('school/attendance/staff/index', {
      staffMembers: StaffDto.fromArray(staffMembers),
    })
  }

  async markForm({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const staffMembers = await Staff.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .orderBy('firstName', 'asc')

    return inertia.render('school/attendance/staff/mark', {
      staffMembers: StaffDto.fromArray(staffMembers),
    })
  }

  async mark({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id

    try {
      const data = await request.validateUsing(markStaffAttendanceValidator)

      await MarkStaffAttendance.handle({ schoolId, userId, data })

      session.flash('success', 'Attendance marked successfully')
      return response.redirect().toPath('/attendance/staff')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }

  async bulkMarkForm({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const staffMembers = await Staff.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .orderBy('firstName', 'asc')

    return inertia.render('school/attendance/staff/bulk-mark', {
      staffMembers: StaffDto.fromArray(staffMembers),
    })
  }

  async bulkMark({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id

    try {
      const data = await request.validateUsing(bulkStaffAttendanceValidator)

      await MarkBulkStaffAttendance.handle({ schoolId, userId, data })

      session.flash('success', `Attendance marked for ${data.attendances.length} staff members`)
      return response.redirect().toPath('/attendance/staff')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }

  async staffHistory({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const attendances = await StaffAttendance.query()
      .where('schoolId', schoolId)
      .where('staffMemberId', params.staffId)
      .orderBy('date', 'desc')
      .limit(100)

    return inertia.render('school/attendance/staff/history', {
      staff: new StaffDto(staff),
      attendances: StaffAttendanceDto.fromArray(attendances),
    })
  }
}
