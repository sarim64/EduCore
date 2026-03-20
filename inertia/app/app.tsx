/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import DashboardLayout from '~/layouts/DashboardLayout'
import { ComponentType, ReactElement } from 'react'

// const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title}`,

  resolve: async (name) => {
    const page = (await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )) as {
      default: ComponentType & { layout?: (page: ReactElement) => ReactElement }
    }

    // Keep the original page layout if it has any otherwise wrap it in MainLayout
    page.default.layout =
      page.default.layout || ((page) => <DashboardLayout>{page}</DashboardLayout>)

    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
