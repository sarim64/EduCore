import StoreSchool from '#actions/schools/store_school'
import { schoolValidator, selectSchoolValidator } from '#validators/school'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class SchoolsController {
  async index({}: HttpContext) {}

  async select({ auth, inertia, response, session }: HttpContext) {
    const user = auth.use('web').user!

    const schools = await db
      .from('school_users as su')
      .innerJoin('schools as s', 's.id', 'su.school_id')
      .innerJoin('roles as r', 'r.id', 'su.role_id')
      .where('su.user_id', user.id)
      .select('s.id', 's.name', 's.code', 'r.name as role_name')
      .orderBy('s.name', 'asc')

    if (schools.length === 0) {
      return response.redirect().toRoute('schools.create')
    }

    // Keep single-school users on this page as well, but preselect their only school.
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

  async create({ inertia }: HttpContext) {
    return inertia.render('schools/create_school')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(schoolValidator)

    let school
    try {
      school = await StoreSchool.handle({
        user: auth.use('web').user!,
        data,
      })
    } catch (error) {
      session.flash('error', error.message ?? 'Unable to create school')
      return response.redirect().back()
    }

    session.put('schoolId', school.id)
    return response.redirect().toPath('/')
  }

  async setActive({ request, auth, response, session }: HttpContext) {
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
    return response.redirect().toPath('/')
  }
}
