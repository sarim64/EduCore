import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DateTime } from 'luxon'
import encryption from '@adonisjs/core/services/encryption'
import mail from '@adonisjs/mail/services/main'
import User from '#models/user'

test.group('auth/forgot-password & logout', () => {
  // Ensures an authenticated user can log out and is redirected to the login page.
  test('user can log out successfully', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const response = await client
      .post('/auth/logout')
      .withSession({ schoolId: school.id })
      .withCsrfToken()
      .loginAs(user)

    response.assertRedirectsTo('/auth/login')
  })

  // Verifies that a user can submit the forgot password form and is redirected as expected.
  test('forgot password form can be submitted', async ({ client }) => {
    const response = await client
      .post('/auth/forgot-password')
      .form({ email: 'existornot@example.com' })
      .withSession({})
      .withCsrfToken()

    // The controller should still redirect back to the same page
    response.assertRedirectsTo('/auth/forgot-password')

    // Optionally, you can assert there's no validation error
    response.assertSessionMissing('errors')
  })

  // Confirms that an expired password reset token is rejected.
  test('cannot reset password with expired token', async ({ client }) => {
    const user = await UserFactory.create()

    const token = await user.related('passwordResetTokens').create({
      value: 'expiredtoken',
      expiresAt: DateTime.now().minus({ hour: 1 }),
    })

    const encryptedValue = encryption.encrypt(token.value)

    const response = await client
      .post('/auth/forgot-password/reset')
      .form({ value: encryptedValue, password: 'newpassword123' })
      .withSession({})
      .withCsrfToken()

    response.assertStatus(403)
  })

  // Verifies that the password reset token sent via email can be extracted and used to reset the password.
  test('can extract password reset token from email and use it to reset password', async ({
    client,
    assert,
    cleanup,
  }) => {
    const { messages } = mail.fake()

    const user = await UserFactory.merge({ password: 'oldpassword123' }).create()

    const response = await client
      .post('/auth/forgot-password')
      .form({ email: user.email })
      .withSession({})
      .withCsrfToken()

    response.assertRedirectsTo('/auth/forgot-password')

    const sentMessages = messages.sent()

    assert.lengthOf(sentMessages, 1, 'Exactly one email should be sent')

    const emailMessage = sentMessages[0]

    // Extract HTML content from the email message
    // The HTML content is in the nodeMailerMessage.html property
    const htmlContent = emailMessage.nodeMailerMessage.html

    assert.exists(htmlContent, 'HTML content should exist')

    // Convert to string if needed
    const htmlString = typeof htmlContent === 'string' ? htmlContent : String(htmlContent)

    assert.isNotEmpty(htmlString, 'HTML content should not be empty')

    // Extract the reset link from the HTML using regex
    // The link format is: /auth/forgot-password/reset/{encryptedValue}
    const resetLinkMatch = htmlString.match(/href="([^"]*\/auth\/forgot-password\/reset\/([^"]+))"/)

    assert.isNotNull(resetLinkMatch, 'Reset link should be found in email')

    const encryptedToken = resetLinkMatch![2]

    assert.isString(encryptedToken)
    assert.isNotEmpty(encryptedToken)

    // Use the extracted token to reset the password
    const resetResponse = await client
      .post('/auth/forgot-password/reset')
      .form({ value: encryptedToken, password: 'newpassword456' })
      .withSession({})
      .withCsrfToken()

    resetResponse.assertRedirectsTo('/auth/login')

    // Verify the user can authenticate with the new password
    const verifiedUser = await User.verifyCredentials(user.email, 'newpassword456')
    assert.equal(verifiedUser.id, user.id, 'User should be able to authenticate with new password')

    cleanup(() => {
      mail.restore()
    })
  })

  // Verifies that using an activation link sets mustSetPassword to false.
  test('activation link sets mustSetPassword to false after password is set', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.merge({ mustSetPassword: true }).create()

    const token = await user.related('passwordResetTokens').create({
      value: 'activationtoken123',
      expiresAt: DateTime.now().plus({ hours: 48 }),
    })

    const encryptedValue = encryption.encrypt(token.value)

    const response = await client
      .post('/auth/forgot-password/reset')
      .form({ value: encryptedValue, password: 'newpassword123' })
      .withSession({})
      .withCsrfToken()

    response.assertRedirectsTo('/auth/login')

    await user.refresh()
    assert.isFalse(user.mustSetPassword, 'mustSetPassword should be false after activation')
  })

  test('behaves identically for valid and non-existent emails (security)', async ({
    client,
    assert,
    cleanup,
  }) => {
    const { messages } = mail.fake()

    const user = await UserFactory.create()

    // Test with VALID email
    const validResponse = await client
      .post('/auth/forgot-password')
      .form({ email: user.email })
      .withSession({})
      .withCsrfToken()

    validResponse.assertRedirectsTo('/auth/forgot-password')

    // Test with INVALID email
    const invalidResponse = await client
      .post('/auth/forgot-password')
      .form({ email: 'nonexistent@example.com' })
      .withSession({})
      .withCsrfToken()

    invalidResponse.assertRedirectsTo('/auth/forgot-password')

    const sentMessages = messages.sent()
    assert.lengthOf(sentMessages, 1, 'Exactly one email should be sent (only for valid user)')

    cleanup(() => {
      mail.restore()
    })
  })
})
