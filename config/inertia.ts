import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import SuperAdmin from '#models/super_admin'
import School from '#models/school'
import SchoolSubscription from '#models/school_subscription'
import ModuleService from '#services/module_service'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: (ctx) => {
      const user = ctx.auth.use('web').user
      return user
    },
    isSuperAdmin: async (ctx) => {
      const user = ctx.auth.use('web').user
      if (!user) return false
      const superAdmin = await SuperAdmin.query()
        .where('userId', user.id)
        .whereNull('revokedAt')
        .first()
      return !!superAdmin
    },
    currentSchool: async (ctx) => {
      const schoolId = ctx.session?.get('schoolId')
      if (!schoolId) return null
      const school = await School.find(schoolId)
      return school ? { id: school.id, name: school.name } : null
    },
    enabledModules: async (ctx) => {
      const schoolId = ctx.session?.get('schoolId')
      if (!schoolId) return []
      return ModuleService.getEnabledModules(schoolId)
    },
    subscription: async (ctx) => {
      const schoolId = ctx.session?.get('schoolId')
      if (!schoolId) return null
      const sub = await SchoolSubscription.query()
        .where('schoolId', schoolId)
        .preload('plan')
        .first()
      if (!sub) return null
      return {
        plan: sub.plan?.name ?? 'Custom',
        status: sub.status,
        endDate: sub.endDate?.toISODate() ?? null,
      }
    },
    errors: (ctx) => ctx.session?.flashMessages.get('errors') ?? {},
    flash: (ctx) => ({
      success: ctx.session?.flashMessages.get('success'),
      error: ctx.session?.flashMessages.get('error'),
    }),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
