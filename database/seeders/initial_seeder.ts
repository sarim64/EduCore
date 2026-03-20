import Role from '#models/role'
import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Roles from '#enums/roles'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Seed roles
    const roleData = [
      { id: Roles.SUPER_ADMIN, name: 'Super Admin' },
      { id: Roles.SCHOOL_ADMIN, name: 'School Admin' },
      { id: Roles.PRINCIPAL, name: 'Principal' },
      { id: Roles.TEACHER, name: 'Teacher' },
      { id: Roles.ACCOUNTANT, name: 'Accountant' },
      { id: Roles.SUPPORT_STAFF, name: 'Support Staff' },
    ]

    const existingRoles = await Role.query().whereIn(
      'id',
      roleData.map((r) => r.id)
    )
    const existingRoleIds = existingRoles.map((role) => role.id)

    const rolesToCreate = roleData.filter((r) => !existingRoleIds.includes(r.id))

    if (rolesToCreate.length > 0) {
      await Role.createMany(rolesToCreate)
    }

    // Seed default super admin user
    const superAdminEmail = 'superadmin@educore.com'
    const existingUser = await User.findBy('email', superAdminEmail)

    if (!existingUser) {
      const user = await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: superAdminEmail,
        password: 'password123',
      })

      await SuperAdmin.create({
        userId: user.id,
        grantedAt: DateTime.now(),
        notes: 'Default super admin created by seeder',
      })
    }
  }
}
