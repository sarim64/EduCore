import ListLeaveTypes from '#actions/school/attendance/list_leave_types'
import GetLeaveType from '#actions/school/attendance/get_leave_type'
import StoreLeaveType from '#actions/school/attendance/store_leave_type'
import UpdateLeaveType from '#actions/school/attendance/update_leave_type'
import DeleteLeaveType from '#actions/school/attendance/delete_leave_type'
import LeaveTypeDto from '#dtos/leave_type'
import { createLeaveTypeValidator, updateLeaveTypeValidator } from '#validators/leave_type'
import type { HttpContext } from '@adonisjs/core/http'

export default class LeaveTypesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const leaveTypes = await ListLeaveTypes.handle({ schoolId })

    return inertia.render('school/attendance/leave-types/index', {
      leaveTypes: LeaveTypeDto.fromArray(leaveTypes),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('school/attendance/leave-types/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createLeaveTypeValidator)

    try {
      await StoreLeaveType.handle({ schoolId, data })
    } catch (error) {
      if (error?.code === 'E_DUPLICATE_LEAVE_TYPE_CODE') {
        session.flash('errors', { code: error.message })
        return response.redirect().back()
      }
      throw error
    }

    session.flash('success', 'Leave type created successfully')
    return response.redirect().toPath('/attendance/leave-types')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const leaveType = await GetLeaveType.handle({
      leaveTypeId: params.id,
      schoolId,
    })

    return inertia.render('school/attendance/leave-types/edit', {
      leaveType: new LeaveTypeDto(leaveType),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateLeaveTypeValidator)

    try {
      await UpdateLeaveType.handle({
        leaveTypeId: params.id,
        schoolId,
        data,
      })
    } catch (error) {
      if (error?.code === 'E_DUPLICATE_LEAVE_TYPE_CODE') {
        session.flash('errors', { code: error.message })
        return response.redirect().back()
      }
      throw error
    }

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
