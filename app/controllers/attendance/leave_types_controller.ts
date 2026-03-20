import ListLeaveTypes from '#actions/attendance/list_leave_types'
import GetLeaveType from '#actions/attendance/get_leave_type'
import StoreLeaveType from '#actions/attendance/store_leave_type'
import UpdateLeaveType from '#actions/attendance/update_leave_type'
import DeleteLeaveType from '#actions/attendance/delete_leave_type'
import LeaveTypeDto from '#dtos/leave_type'
import { createLeaveTypeValidator, updateLeaveTypeValidator } from '#validators/leave_type'
import type { HttpContext } from '@adonisjs/core/http'

export default class LeaveTypesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const leaveTypes = await ListLeaveTypes.handle({ schoolId })

    return inertia.render('attendance/leave-types/index', {
      leaveTypes: LeaveTypeDto.fromArray(leaveTypes),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('attendance/leave-types/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createLeaveTypeValidator)

    // Check for duplicate code within school
    const { default: LeaveType } = await import('#models/leave_type')
    const existingLeaveType = await LeaveType.query()
      .where('schoolId', schoolId)
      .where('code', data.code)
      .first()

    if (existingLeaveType) {
      session.flash('errors', { code: 'Leave type code already exists' })
      return response.redirect().back()
    }

    await StoreLeaveType.handle({ schoolId, data })

    session.flash('success', 'Leave type created successfully')
    return response.redirect().toPath('/attendance/leave-types')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const leaveType = await GetLeaveType.handle({
      leaveTypeId: params.id,
      schoolId,
    })

    return inertia.render('attendance/leave-types/edit', {
      leaveType: new LeaveTypeDto(leaveType),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateLeaveTypeValidator)

    const leaveType = await GetLeaveType.handle({
      leaveTypeId: params.id,
      schoolId,
    })

    // Check for duplicate code if code is being changed
    if (data.code && data.code !== leaveType.code) {
      const { default: LeaveType } = await import('#models/leave_type')
      const existingLeaveType = await LeaveType.query()
        .where('schoolId', schoolId)
        .where('code', data.code)
        .whereNot('id', params.id)
        .first()

      if (existingLeaveType) {
        session.flash('errors', { code: 'Leave type code already exists' })
        return response.redirect().back()
      }
    }

    await UpdateLeaveType.handle({
      leaveTypeId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Leave type updated successfully')
    return response.redirect().toPath('/attendance/leave-types')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    await DeleteLeaveType.handle({
      leaveTypeId: params.id,
      schoolId,
    })

    session.flash('success', 'Leave type deleted successfully')
    return response.redirect().toPath('/attendance/leave-types')
  }
}
