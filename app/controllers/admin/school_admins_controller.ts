import type { HttpContext } from '@adonisjs/core/http'
import School from '#models/school'
import User from '#models/user'
import UserDto from '#dtos/user'
import SchoolDto from '#dtos/school'
import { inject } from '@adonisjs/core'
import AddSchoolAdmin from '#actions/admin/add_school_admin'
import RemoveSchoolAdmin from '#actions/admin/remove_school_admin'
import ListSchoolAdmins from '#actions/admin/list_school_admins'
import { addSchoolAdminValidator } from '#validators/admin'

export default class SchoolAdminsController {
  async index({ params, inertia }: HttpContext) {
    const { school, admins } = await ListSchoolAdmins.handle({ schoolId: params.schoolId })

    return inertia.render('admin/schools/admins/index', {
      school: new SchoolDto(school),
      admins: UserDto.fromArray(admins),
    })
  }

  async create({ params, inertia }: HttpContext) {
    const school = await School.findOrFail(params.schoolId)

    return inertia.render('admin/schools/admins/create', {
      school: new SchoolDto(school),
    })
  }

  @inject()
  async store(
    { params, request, response, session, superAdmin }: HttpContext,
    action: AddSchoolAdmin
  ) {
    const school = await School.findOrFail(params.schoolId)
    const data = await request.validateUsing(addSchoolAdminValidator)

    await action.handle({
      school,
      data,
      superAdmin: superAdmin!,
    })

    session.flash('success', 'School admin added successfully')
    return response.redirect().toRoute('admin.schools.admins.index', { schoolId: school.id })
  }

  @inject()
  async destroy({ params, response, session, superAdmin }: HttpContext, action: RemoveSchoolAdmin) {
    const school = await School.findOrFail(params.schoolId)
    const user = await User.findOrFail(params.id)

    try {
      await action.handle({
        school,
        user,
        superAdmin: superAdmin!,
      })

      session.flash('success', 'School admin removed successfully')
    } catch (error) {
      if (error?.code === 'E_LAST_SCHOOL_ADMIN') {
        session.flash('error', 'Cannot remove the last admin from a school')
      } else {
        session.flash('error', 'An unexpected error occurred')
      }
    }

    return response.redirect().toRoute('admin.schools.admins.index', { schoolId: school.id })
  }
}
