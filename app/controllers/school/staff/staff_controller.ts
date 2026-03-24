import User from '#models/user'
import StaffDto from '#dtos/staff_member'
import DepartmentDto from '#dtos/department'
import DesignationDto from '#dtos/designation'
import ListStaff from '#actions/school/staff/staff/list_staff'
import GetStaff from '#actions/school/staff/staff/get_staff'
import StoreStaff from '#actions/school/staff/staff/store_staff'
import UpdateStaff from '#actions/school/staff/staff/update_staff'
import LinkStaffUser from '#actions/school/staff/staff/link_staff_user'
import UnlinkStaffUser from '#actions/school/staff/staff/unlink_staff_user'
import ListDepartments from '#actions/school/staff/department/list_departments'
import ListDesignations from '#actions/school/staff/designation/list_designations'
import { createStaffValidator, updateStaffValidator } from '#validators/staff'
import { linkUserValidator } from '#validators/staff_user'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class StaffController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await ListStaff.handle({ schoolId })

    return inertia.render('school/staff/members/index', {
      staff: StaffDto.fromArray(staff),
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const departments = await ListDepartments.handle({ schoolId })
    const designations = await ListDesignations.handle({ schoolId })

    return inertia.render('school/staff/members/create', {
      departments: DepartmentDto.fromArray(departments.filter((d) => d.isActive)),
      designations: DesignationDto.fromArray(designations.filter((d) => d.isActive)),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createStaffValidator, {
      meta: { schoolId },
    })

    try {
      await StoreStaff.handle({ schoolId, data })
    } catch (error) {
      if (error?.code === 'E_SUBSCRIPTION_STAFF_LIMIT_REACHED') {
        session.flash('error', error.message)
        return response.redirect().back()
      }
      if (error?.code === 'E_USER_ALREADY_LINKED_TO_STAFF') {
        session.flash(
          'error',
          'This email is already linked to another staff member in this school'
        )
        return response.redirect().back()
      }
      throw error
    }

    session.flash('success', 'Staff member created successfully')
    return response.redirect().toRoute('staff.members.index')
  }

  async show({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await GetStaff.handle({
      staffMemberId: params.id,
      schoolId,
    })

    return inertia.render('school/staff/members/show', {
      staff: new StaffDto(staff),
    })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await GetStaff.handle({
      staffMemberId: params.id,
      schoolId,
    })
    const departments = await ListDepartments.handle({ schoolId })
    const designations = await ListDesignations.handle({ schoolId })

    return inertia.render('school/staff/members/edit', {
      staff: new StaffDto(staff),
      departments: DepartmentDto.fromArray(departments.filter((d) => d.isActive)),
      designations: DesignationDto.fromArray(designations.filter((d) => d.isActive)),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateStaffValidator, {
      meta: { schoolId, staffId: params.id },
    })

    await UpdateStaff.handle({
      staffMemberId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Staff member updated successfully')
    return response.redirect().toRoute('staff.members.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await GetStaff.handle({
      staffMemberId: params.id,
      schoolId,
    })

    await staff.delete()

    session.flash('success', 'Staff member deleted successfully')
    return response.redirect().toRoute('staff.members.index')
  }

  async linkUser({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await GetStaff.handle({
      staffMemberId: params.id,
      schoolId,
    })

    const data = await request.validateUsing(linkUserValidator)

    try {
      await LinkStaffUser.handle({ staff, schoolId, data })
    } catch (error) {
      if (error?.code === 'E_EMAIL_ALREADY_TAKEN') {
        session.flash('errors', { email: [error.message] })
        return response.redirect().back()
      }
      if (error?.code === 'E_USER_ALREADY_LINKED_TO_STAFF') {
        session.flash('error', 'This user is already linked to another staff member in this school')
        return response.redirect().back()
      }
      if (error?.code === 'E_SUPER_ADMIN_NOT_LINKABLE') {
        session.flash('error', 'Super admin accounts cannot be linked to staff members')
        return response.redirect().back()
      }
      if (error?.code === 'E_STAFF_EMAIL_REQUIRED') {
        return response.abort('Staff email is required to create or auto-link account by email', 400)
      }
      if (error?.code === 'E_PASSWORD_REQUIRED') {
        session.flash(
          'error',
          'A password with at least 8 characters is required when creating a new user account'
        )
        return response.redirect().back()
      }
      if (error?.code === 'E_ROLE_REQUIRED') {
        session.flash('error', 'Please select a role for this school')
        return response.redirect().back()
      }
      throw error
    }

    session.flash('success', 'User account linked successfully')
    return response.redirect().toRoute('staff.members.show', { id: staff.id })
  }

  async unlinkUser({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await GetStaff.handle({
      staffMemberId: params.id,
      schoolId,
    })

    await UnlinkStaffUser.handle({ staff, schoolId })

    session.flash('success', 'User account unlinked successfully')
    return response.redirect().toRoute('staff.members.show', { id: staff.id })
  }

  async linkUserPage({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await GetStaff.handle({
      staffMemberId: params.id,
      schoolId,
    })

    // Get users from this school who are not already linked to staff in this school
    const { default: Staff } = await import('#models/staff_member')
    const linkedUserIdsQuery = Staff.query()
      .where('schoolId', schoolId)
      .whereNotNull('userId')
      .select('userId')
    const schoolUserIdsQuery = db.from('school_users').where('school_id', schoolId).select('user_id')

    const users = await User.query()
      .whereIn('id', schoolUserIdsQuery)
      .whereNotIn('id', linkedUserIdsQuery)
      .whereNotIn('id', db.from('super_admins').whereNull('revoked_at').select('user_id'))
      .orderBy('firstName', 'asc')

    let matchedEmailUser: null | {
      id: string
      firstName: string
      lastName: string | null
      email: string
      fullName: string
      isInCurrentSchool: boolean
    } = null

    if (staff.email) {
      const existingByEmail = await User.query()
        .where('email', staff.email)
        .whereNotIn('id', db.from('super_admins').whereNull('revoked_at').select('user_id'))
        .first()

      if (existingByEmail) {
        const inSchool = await db
          .from('school_users')
          .where('school_id', schoolId)
          .where('user_id', existingByEmail.id)
          .first()

        matchedEmailUser = {
          id: existingByEmail.id,
          firstName: existingByEmail.firstName,
          lastName: existingByEmail.lastName,
          email: existingByEmail.email,
          fullName: `${existingByEmail.firstName} ${existingByEmail.lastName ?? ''}`.trim(),
          isInCurrentSchool: !!inSchool,
        }
      }
    }

    return inertia.render('school/staff/members/link-user', {
      staff: new StaffDto(staff),
      matchedEmailUser,
      users: users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        fullName: `${u.firstName} ${u.lastName ?? ''}`.trim(),
      })),
    })
  }
}
