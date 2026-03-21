import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import SchoolInvite from '#models/school_invite'
import User from '#models/user'
import Roles from '#enums/roles'
import encryption from '@adonisjs/core/services/encryption'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

async function createPendingInvite(schoolId: string, invitedByUserId: string, email: string, roleId: number) {
  const token = 'test-raw-token-' + Math.random().toString(36).slice(2)
  const invite = await SchoolInvite.create({
    schoolId,
    email,
    roleId,
    invitedByUserId,
    token,
    expiresAt: DateTime.now().plus({ days: 7 }),
  })
  return { invite, encryptedToken: encryption.encrypt(token) }
}

test.group('auth/accept_invite', () => {
  // Verifies the accept invite page renders for a valid token
  test('renders accept invite page with valid token', async ({ client }) => {
    const admin = await UserFactory.create()
    const school = await SchoolFactory.create()
    const { encryptedToken } = await createPendingInvite(school.id, admin.id, 'newuser@example.com', Roles.TEACHER)

    const response = await client
      .get(`/auth/invites/accept/${encryptedToken}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('auth/accept_invite')
    response.assertInertiaPropsContains({ isValid: true, isNewUser: true })
  })

  // Verifies the page shows invalid state for an expired invite
  test('shows invalid state for an expired invite', async ({ client }) => {
    const admin = await UserFactory.create()
    const school = await SchoolFactory.create()
    const token = 'expired-token'
    await SchoolInvite.create({
      schoolId: school.id,
      email: 'expired@example.com',
      roleId: Roles.TEACHER,
      invitedByUserId: admin.id,
      token,
      expiresAt: DateTime.now().minus({ days: 1 }),
    })
    const encryptedToken = encryption.encrypt(token)

    const response = await client
      .get(`/auth/invites/accept/${encryptedToken}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaPropsContains({ isValid: false })
  })

  // Verifies a new user can accept an invite and have their account created
  test('new user can accept invite and account is created', async ({ client, assert }) => {
    const admin = await UserFactory.create()
    const school = await SchoolFactory.create()
    const { invite, encryptedToken } = await createPendingInvite(
      school.id,
      admin.id,
      'brand-new@example.com',
      Roles.TEACHER
    )

    const response = await client
      .post('/auth/invites/accept')
      .withCsrfToken()
      .form({
        token: encryptedToken,
        firstName: 'Brand',
        lastName: 'New',
        password: 'securepassword123',
      })

    response.assertRedirectsTo('/')

    const user = await User.findBy('email', 'brand-new@example.com')
    assert.exists(user)
    assert.equal(user!.firstName, 'Brand')
    assert.isFalse(user!.mustSetPassword)

    const membership = await db
      .from('school_users')
      .where('school_id', school.id)
      .where('user_id', user!.id)
      .first()
    assert.exists(membership)

    await invite.refresh()
    assert.isNotNull(invite.acceptedAt)
    assert.isNull(invite.token)
  })

  // Verifies an existing user can accept an invite and is attached to the school
  test('existing user can accept invite and is attached to school', async ({ client, assert }) => {
    const admin = await UserFactory.create()
    const school = await SchoolFactory.create()
    const existingUser = await UserFactory.create()

    const { invite, encryptedToken } = await createPendingInvite(
      school.id,
      admin.id,
      existingUser.email,
      Roles.ACCOUNTANT
    )

    const response = await client
      .post('/auth/invites/accept')
      .withCsrfToken()
      .form({ token: encryptedToken })

    response.assertRedirectsTo('/')

    const membership = await db
      .from('school_users')
      .where('school_id', school.id)
      .where('user_id', existingUser.id)
      .first()
    assert.exists(membership)

    await invite.refresh()
    assert.isNotNull(invite.acceptedAt)
  })

  // Verifies that an already-accepted invite cannot be accepted again
  test('cannot accept an already-accepted invite', async ({ client }) => {
    const admin = await UserFactory.create()
    const school = await SchoolFactory.create()
    const token = 'accepted-token'
    await SchoolInvite.create({
      schoolId: school.id,
      email: 'already@accepted.com',
      roleId: Roles.TEACHER,
      invitedByUserId: admin.id,
      token: null,
      expiresAt: DateTime.now().plus({ days: 7 }),
      acceptedAt: DateTime.now(),
    })
    const encryptedToken = encryption.encrypt(token)

    const response = await client
      .post('/auth/invites/accept')
      .withCsrfToken()
      .withInertia()
      .form({ token: encryptedToken })

    response.assertInertiaPropsContains({
      flash: { error: 'This invitation is invalid, expired, or has already been used.' },
    })
  })

  // Verifies that a cancelled invite cannot be accepted
  test('cannot accept a cancelled invite', async ({ client }) => {
    const admin = await UserFactory.create()
    const school = await SchoolFactory.create()
    const token = 'cancelled-token'
    await SchoolInvite.create({
      schoolId: school.id,
      email: 'cancelled@example.com',
      roleId: Roles.TEACHER,
      invitedByUserId: admin.id,
      token: null,
      expiresAt: DateTime.now().plus({ days: 7 }),
      cancelledAt: DateTime.now(),
      cancelledByUserId: admin.id,
    })
    const encryptedToken = encryption.encrypt(token)

    const response = await client
      .post('/auth/invites/accept')
      .withCsrfToken()
      .withInertia()
      .form({ token: encryptedToken })

    response.assertInertiaPropsContains({
      flash: { error: 'This invitation is invalid, expired, or has already been used.' },
    })
  })
})
