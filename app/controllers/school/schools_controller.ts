import AuditService from '#services/audit_service'
import { selectSchoolValidator } from '#validators/school'
import type { HttpContext } from '@adonisjs/core/http'
import ListUserSchools from '#actions/school/list_user_schools'
import VerifySchoolMembership from '#actions/school/verify_school_membership'

export default class SchoolsController {
  async select({ auth, inertia, session, response }: HttpContext) {
    const user = auth.use('web').user!

    const schools = await ListUserSchools.handle(user.id)

    if (schools.length === 0) {
      session.flash(
        'error',
        'Your account is not assigned to any school. Please contact your administrator.'
      )
      return response.redirect().toRoute('login.show')
    }

    if (schools.length === 1) {
      session.put('schoolId', schools[0].id)
    }

    return inertia.render('school/schools/select_school', {
      canSwitch: schools.length > 1,
      activeSchoolId: session.get('schoolId'),
      schools: schools.map((school) => ({
        id: school.id,
        name: school.name,
        code: school.code,
        roleName: school.role_name,
      })),
    })
  }

  async setActive(ctx: HttpContext) {
    const { request, auth, response, session } = ctx
    const user = auth.use('web').user!
    const { schoolId } = await request.validateUsing(selectSchoolValidator)

    const isMember = await VerifySchoolMembership.handle(user.id, schoolId)

    if (!isMember) {
      session.flash('error', 'You do not have access to the selected school')
      return response.redirect().toRoute('schools.select')
    }

    session.put('schoolId', schoolId)

    await AuditService.log(
      {
        schoolId,
        userId: user.id,
        action: 'school_switch',
        entityType: 'School',
        entityId: schoolId,
        description: 'User switched active school',
      },
      ctx
    )

    return response.redirect().toRoute('dashboard')
  }
}
