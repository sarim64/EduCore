import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { AccessControlSettingFactory } from '../../factories/access_control_setting_factory.js'
import AccessControlSetting from '#models/access_control_setting'
import Roles from '#enums/roles'

test.group('school/access_control', () => {
  test('non-admin (principal) cannot access access control page', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.PRINCIPAL } })

    const response = await client
      .get('/access-control')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(403)
  })

  test('school admin sees the access control page with all 16 permission keys', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const response = await client
      .get('/access-control')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/access_control')
    const { props } = response.body()
    assert.equal(Object.keys(props.settings).length, 16)
  })

  test('default fallback is applied when no DB rows exist', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const response = await client
      .get('/access-control')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    const { props } = response.body()
    // Accountant should see fee_today by default
    assert.isTrue(props.settings['dashboard.cards.fee_today'][Roles.ACCOUNTANT])
    // Principal should NOT see fee_today by default
    assert.isFalse(props.settings['dashboard.cards.fee_today'][Roles.PRINCIPAL])
  })

  test('DB override replaces the default fallback', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    // Override: disable fee_today for accountant
    await AccessControlSettingFactory.merge({
      schoolId: school.id,
      roleId: Roles.ACCOUNTANT,
      permission: 'dashboard.cards.fee_today',
      enabled: false,
    }).create()

    const response = await client
      .get('/access-control')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    const { props } = response.body()
    assert.isFalse(props.settings['dashboard.cards.fee_today'][Roles.ACCOUNTANT])
  })

  test('save persists settings to DB', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    await client
      .post('/access-control')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .json({
        settings: {
          'dashboard.cards.fee_today': { [Roles.PRINCIPAL]: true },
        },
      })

    const row = await AccessControlSetting.query()
      .where('schoolId', school.id)
      .where('roleId', Roles.PRINCIPAL)
      .where('permission', 'dashboard.cards.fee_today')
      .first()

    assert.isTrue(row?.enabled)
  })

  test('dashboard reflects DB-driven canSee for accountant', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.ACCOUNTANT } })

    // Disable fee_today for accountant via DB
    await AccessControlSettingFactory.merge({
      schoolId: school.id,
      roleId: Roles.ACCOUNTANT,
      permission: 'dashboard.cards.fee_today',
      enabled: false,
    }).create()

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    const { props } = response.body()
    assert.isFalse(props.canSee['dashboard.cards.fee_today'])
  })

  test('superadmin in school always gets full canSee regardless of DB settings', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    // Even with a row that disables fee_today, superadmin sees everything
    await AccessControlSettingFactory.merge({
      schoolId: school.id,
      roleId: Roles.ACCOUNTANT,
      permission: 'dashboard.cards.fee_today',
      enabled: false,
    }).create()

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    const { props } = response.body()
    assert.isTrue(props.canSee['dashboard.cards.fee_today'])
    assert.isTrue(props.canSee['dashboard.cards.subscription'])
  })

  test('payload sanitization: invalid permission keys and SCHOOL_ADMIN role are ignored', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    await client
      .post('/access-control')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .json({
        settings: {
          'hacked.permission': { [Roles.PRINCIPAL]: true },
          'dashboard.cards.fee_today': { [Roles.SCHOOL_ADMIN]: true },
        },
      })

    const hackedRow = await AccessControlSetting.query()
      .where('schoolId', school.id)
      .where('permission', 'hacked.permission')
      .first()

    const adminRow = await AccessControlSetting.query()
      .where('schoolId', school.id)
      .where('roleId', Roles.SCHOOL_ADMIN)
      .where('permission', 'dashboard.cards.fee_today')
      .first()

    assert.isNull(hackedRow)
    assert.isNull(adminRow)
  })
})
