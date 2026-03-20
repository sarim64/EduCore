import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { apiClient } from '@japa/api-client'
import { inertiaApiClient } from '@adonisjs/inertia/plugins/api_client'
import { browserClient } from '@japa/browser-client'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'

/*
 Truncate all tables atomically with FK triggers disabled.
 Uses a transaction to ensure all queries run on the same connection,
 since session_replication_role is connection-scoped.
 */
async function truncateTables() {
  const { rows } = await db.rawQuery<{ rows: { tablename: string }[] }>(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT LIKE 'adonis_%'
  `)

  if (rows.length === 0) return

  const tables = rows.map((t) => `"${t.tablename}"`).join(', ')

  await db.transaction(async (trx) => {
    await trx.rawQuery('SET session_replication_role = replica')
    await trx.rawQuery(`TRUNCATE ${tables} RESTART IDENTITY`)
    await trx.rawQuery('SET session_replication_role = DEFAULT')
  })
}

export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  sessionApiClient(app),
  shieldApiClient(),
  authApiClient(app),
  apiClient(),
  inertiaApiClient(app),
  browserClient({
    runInSuites: ['browser'],
  }),
]

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [() => truncateTables(), () => testUtils.db().seed()],
  teardown: [],
}

export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
