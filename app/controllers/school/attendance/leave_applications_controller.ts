import ListLeaveApplications from '#actions/school/attendance/list_leave_applications'
import GetLeaveApplication from '#actions/school/attendance/get_leave_application'
import ApplyLeave from '#actions/school/attendance/apply_leave'
import ProcessLeaveApplication from '#actions/school/attendance/process_leave_application'
import ListLeaveTypes from '#actions/school/attendance/list_leave_types'
import LeaveApplicationDto from '#dtos/leave_application'
import LeaveTypeDto from '#dtos/leave_type'
import { applyLeaveValidator, processLeaveValidator } from '#validators/leave_application'
import type { HttpContext } from '@adonisjs/core/http'

export default class LeaveApplicationsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const applications = await ListLeaveApplications.handle({ schoolId })

    return inertia.render('school/attendance/leaves/index', {
      applications: LeaveApplicationDto.fromArray(applications),
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const leaveTypes = await ListLeaveTypes.handle({ schoolId })

    return inertia.render('school/attendance/leaves/apply', {
      leaveTypes: LeaveTypeDto.fromArray(leaveTypes.filter((lt) => lt.isActive)),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const user = auth.user!

    try {
      const data = await request.validateUsing(applyLeaveValidator)

      // Find staff associated with this user
      const { default: Staff } = await import('#models/staff_member')
      const staff = await Staff.query().where('schoolId', schoolId).where('userId', user.id).first()

      if (!staff) {
        session.flash('errors', { general: 'You are not registered as staff in this school' })
        return response.redirect().back()
      }

      await ApplyLeave.handle({ schoolId, staffMemberId: staff.id, data })

      session.flash('success', 'Leave application submitted successfully')
      return response.redirect().toPath('/attendance/leaves')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }

  async show({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const application = await GetLeaveApplication.handle({
      leaveApplicationId: params.id,
      schoolId,
    })

    return inertia.render('school/attendance/leaves/show', {
      application: new LeaveApplicationDto(application),
    })
  }

  async pending({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const applications = await ListLeaveApplications.handle({
      schoolId,
      status: 'pending',
    })

    return inertia.render('school/attendance/leaves/pending', {
      applications: LeaveApplicationDto.fromArray(applications),
    })
  }

  async approve({ params, request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id

    try {
      const data = await request.validateUsing(processLeaveValidator)

      await ProcessLeaveApplication.process({
        schoolId,
        applicationId: params.id,
        userId,
        action: 'approve',
        remarks: data.reviewerRemarks,
      })

      session.flash('success', 'Leave application approved')
      return response.redirect().toPath('/attendance/leaves/pending')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }

  async reject({ params, request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id

    try {
      const data = await request.validateUsing(processLeaveValidator)

      await ProcessLeaveApplication.process({
        schoolId,
        applicationId: params.id,
        userId,
        action: 'reject',
        remarks: data.reviewerRemarks,
      })

      session.flash('success', 'Leave application rejected')
      return response.redirect().toPath('/attendance/leaves/pending')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }

  async cancel({ params, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const user = auth.user!

    try {
      // Find staff associated with this user
      const { default: Staff } = await import('#models/staff_member')
      const staff = await Staff.query().where('schoolId', schoolId).where('userId', user.id).first()

      if (!staff) {
        session.flash('errors', { general: 'You are not registered as staff in this school' })
        return response.redirect().back()
      }

      await ProcessLeaveApplication.cancel({
        schoolId,
        applicationId: params.id,
        staffMemberId: staff.id,
      })

      session.flash('success', 'Leave application cancelled')
      return response.redirect().toPath('/attendance/leaves')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }
}
