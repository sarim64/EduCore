import AuditService from '#services/audit_service'
import { selectSchoolValidator } from '#validators/school'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class SchoolsController {
  async select({ auth, inertia, session, response }: HttpContext) {
    const user = auth.use('web').user!

    const schools = await db
      .from('school_users as su')
      .innerJoin('schools as s', 's.id', 'su.school_id')
      .innerJoin('roles as r', 'r.id', 'su.role_id')
      .where('su.user_id', user.id)
      .select('s.id', 's.name', 's.code', 'r.name as role_name')
      .orderBy('s.name', 'asc')

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

    return inertia.render('schools/select_school', {
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

    const membership = await db
      .from('school_users')
      .where('school_id', schoolId)
      .where('user_id', user.id)
      .first()

    if (!membership) {
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

    return response.redirect().toPath('/')
  }
}
