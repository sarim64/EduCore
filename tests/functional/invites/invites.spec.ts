import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import SchoolInvite from '#models/school_invite'
import Roles from '#enums/roles'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

test.group('invites', () => {
  // Verifies that a school admin can view the invitations list
  test('school admin can view invitations list', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const response = await client
      .get('/invites')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('invites/index')
  })

  // Verifies that a school admin can send an invitation and an email is sent
  test('school admin can send an invitation', async ({ client, assert, cleanup }) => {
    const { messages } = mail.fake()
    cleanup(() => mail.restore())

    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const response = await client
      .post('/invites')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .form({ email: 'invitee@example.com', roleId: Roles.TEACHER })

    response.assertRedirectsTo('/invites')

    const invite = await SchoolInvite.findBy('email', 'invitee@example.com')
    assert.exists(invite)
    assert.isTrue(invite!.isPending)

    const sent = messages.sent()
    assert.lengthOf(sent, 1)
    assert.equal(sent[0].nodeMailerMessage.to, 'invitee@example.com')
  })

  // Verifies that a school admin cannot send a duplicate pending invite to the same email
  test('cannot send duplicate pending invite to same email', async ({ client, assert, cleanup }) => {
    mail.fake()
    cleanup(() => mail.restore())

    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    // Send first invite
    await client
      .post('/invites')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .form({ email: 'duplicate@example.com', roleId: Roles.TEACHER })

    // Attempt to send second invite to same email
    const response = await client
      .post('/invites')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .withInertia()
      .form({ email: 'duplicate@example.com', roleId: Roles.ACCOUNTANT })

    response.assertInertiaPropsContains({
      flash: { error: 'An invitation is already pending for this email address.' },
    })

    const invites = await SchoolInvite.query().where('email', 'duplicate@example.com')
    assert.lengthOf(invites, 1)
  })

  // Verifies that a school admin cannot invite someone who is already a member
  test('cannot invite someone already a member of the school', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const existingMember = await UserFactory.create()
    await school.related('users').attach({ [existingMember.id]: { role_id: Roles.TEACHER } })

    const response = await client
      .post('/invites')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .withInertia()
      .form({ email: existingMember.email, roleId: Roles.TEACHER })

    response.assertInertiaPropsContains({
      flash: { error: 'This person is already a member of the school.' },
    })
  })

  // Verifies that a school admin can cancel a pending invitation
  test('school admin can cancel a pending invitation', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const invite = await SchoolInvite.create({
      schoolId: school.id,
      email: 'cancel-me@example.com',
      roleId: Roles.TEACHER,
      invitedByUserId: user.id,
      token: 'somerawtoken',
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    const response = await client
      .delete(`/invites/${invite.id}`)
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withCsrfToken()

    response.assertRedirectsTo('/invites')

    await invite.refresh()
    assert.isNotNull(invite.cancelledAt)
    assert.isNull(invite.token)
  })

  // Verifies that non-admin users cannot access invite management
  test('non-admin cannot access invite management', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.TEACHER } })

    const response = await client
      .get('/invites')
      .loginAs(user)
      .withSession({ schoolId: school.id })

    response.assertStatus(403)
  })
})
