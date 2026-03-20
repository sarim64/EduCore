import factory from '@adonisjs/lucid/factories'
import School from '#models/school'
import { UserFactory } from './user_factory.js'
import Roles from '#enums/roles'

export const SchoolFactory = factory
  .define(School, async ({ faker }, { withAdmin = true } = {}) => {
    const school = new School()
    school.name = faker.company.name()
    await school.save()

    if (withAdmin) {
      const admin = await UserFactory.create()
      await school.related('users').attach({
        [admin.id]: { role_id: Roles.SCHOOL_ADMIN },
      })
    }

    return school
  })
  .build()
