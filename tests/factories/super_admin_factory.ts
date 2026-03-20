import factory from '@adonisjs/lucid/factories'
import SuperAdmin from '#models/super_admin'
import { DateTime } from 'luxon'
import { UserFactory } from './user_factory.js'

export const SuperAdminFactory = factory
  .define(SuperAdmin, async () => {
    return {
      grantedAt: DateTime.now(),
      notes: null,
    }
  })
  .relation('user', () => UserFactory)
  .state('revoked', (superAdmin) => {
    superAdmin.revokedAt = DateTime.now()
  })
  .build()
