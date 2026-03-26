import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubscriptionPlanFactory } from '../../factories/subscription_plan_factory.js'
import { SchoolSubscriptionFactory } from '../../factories/school_subscription_factory.js'
import { FeePaymentFactory } from '../../factories/fee_payment_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import { FeeChallanFactory } from '../../factories/fee_challan_factory.js'
import { StaffFactory } from '../../factories/staff_factory.js'
import { AcademicYearFactory } from '../../factories/academic_year_factory.js'
import Roles from '#enums/roles'
import { DateTime } from 'luxon'

test.group('school/dashboard', () => {
  test('unauthenticated user is redirected to login', async ({ client }) => {
    const response = await client.get('/').withInertia()
    response.assertRedirectsTo('/auth/login')
  })

  test('super admin without school context is redirected to admin', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const response = await client.get('/').loginAs(user).withInertia()
    response.assertRedirectsTo('/admin')
  })

  test('school admin sees unified dashboard with fees and subscription in stats', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })
    const plan = await SubscriptionPlanFactory.create()
    await SchoolSubscriptionFactory.merge({ schoolId: school.id, planId: plan.id }).create()

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/dashboards/admin')
    const { props } = response.body()
    assert.exists(props.stats.fees)
    assert.exists(props.stats.subscription)
    assert.isNumber(props.stats.fees.todayAmount)
    assert.isNumber(props.stats.staff.teachersCount)
    assert.isNumber(props.stats.attendance.todayStaffAbsent)
  })

  test('teacher still sees teacher dashboard', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.TEACHER } })
    await StaffFactory.merge({ userId: user.id, schoolId: school.id }).create()

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertInertiaComponent('school/dashboards/teacher')
  })

  test('principal sees the unified admin dashboard', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.PRINCIPAL } })

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertInertiaComponent('school/dashboards/admin')
  })

  test('accountant sees the unified admin dashboard', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.ACCOUNTANT } })

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertInertiaComponent('school/dashboards/admin')
  })

  test('todayPaymentCount excludes cancelled payments', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const academicYear = await AcademicYearFactory.merge({ schoolId: school.id }).create()
    const student = await StudentFactory.merge({ schoolId: school.id }).create()
    const challan = await FeeChallanFactory.merge({
      schoolId: school.id,
      studentId: student.id,
      academicYearId: academicYear.id,
    }).create()

    // 2 valid payments today
    await FeePaymentFactory.merge({
      schoolId: school.id,
      feeChallanId: challan.id,
      studentId: student.id,
      paymentDate: DateTime.now(),
      isCancelled: false,
    }).createMany(2)

    // 1 cancelled payment today
    await FeePaymentFactory.merge({
      schoolId: school.id,
      feeChallanId: challan.id,
      studentId: student.id,
      paymentDate: DateTime.now(),
      isCancelled: true,
    }).create()

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    const { props } = response.body()
    assert.equal(props.stats.fees.todayPaymentCount, 2)
  })

  test('super admin in school context sees full dashboard with all canSee flags true', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const plan = await SubscriptionPlanFactory.create()
    await SchoolSubscriptionFactory.merge({ schoolId: school.id, planId: plan.id }).create()

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/dashboards/admin')
    const { props } = response.body()
    assert.isTrue(props.canSee.fees)
    assert.isTrue(props.canSee.subscription)
    assert.isTrue(props.canSee.attendance)
    assert.isTrue(props.canSee.staff)
    assert.exists(props.stats.fees)
    assert.exists(props.stats.subscription)
  })

  test('dashboard renders without crash when no active subscription exists', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })
    // No subscription created

    const response = await client
      .get('/')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/dashboards/admin')
    const { props } = response.body()
    assert.isNull(props.stats.subscription)
  })
})
