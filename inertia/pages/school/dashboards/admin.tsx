import { Head } from '@inertiajs/react'
import { type ReactElement, Fragment } from 'react'
import { usePage } from '@inertiajs/react'
import { DateTime } from 'luxon'
import DashboardLayout from '~/layouts/DashboardLayout'
import { CARD_REGISTRY, LIST_REGISTRY, CHART_REGISTRY } from '~/components/dashboard/widget-registry'
import { SubscriptionUsageCard, PlanInfoCard } from '~/components/dashboard/SubscriptionCards'
import ListWidget from '~/components/dashboard/ListWidget'
import type { SchoolAdminDashboardStats, CanSee } from '~/types/dashboard'
import type { SharedProps } from '~/types'

function getGreeting(): string {
  const hour = DateTime.now().hour
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function AdminDashboard({
  stats,
  canSee,
}: {
  stats: SchoolAdminDashboardStats
  canSee: CanSee
}) {
  const { user, currentSchool } = usePage<SharedProps>().props

  const visibleCards = CARD_REGISTRY.filter((def) => canSee[def.permissionKey])
  const visibleLists = LIST_REGISTRY.filter((def) => canSee[def.permissionKey])
  const visibleCharts = CHART_REGISTRY.filter((def) =>
    def.permissionKeys.some((key) => canSee[key])
  )

  return (
    <>
      <Head title="Dashboard" />

      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.firstName}!
        </h1>
        {currentSchool && <p className="text-sm text-gray-500 mt-0.5">{currentSchool.name}</p>}
      </div>

      {/* ── Cards ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {visibleCards.length > 0 || canSee['dashboard.cards.subscription'] ? (
          <>
            {visibleCards.map((def) => (
              <Fragment key={def.permissionKey}>{def.render(stats)}</Fragment>
            ))}
            {canSee['dashboard.cards.subscription'] && stats.subscription && (
              <SubscriptionUsageCard
                subscription={stats.subscription}
                students={stats.students}
                staff={stats.staff}
              />
            )}
            {canSee['dashboard.cards.subscription'] && (
              <PlanInfoCard subscription={stats.subscription} />
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm col-span-4">No card items to show</p>
        )}
      </section>

      {/* ── Lists ── */}
      <section className="grid grid-cols-4 gap-4 mb-6">
        {visibleLists.length > 0 ? (
          visibleLists.map((def) => (
            <ListWidget
              key={def.permissionKey}
              title={def.title}
              items={[def.render(stats)] as React.ReactNode[]}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm col-span-4">No list items to show</p>
        )}
      </section>

      {/* ── Charts ── */}
      {visibleCharts.map((def) => (
        <Fragment key={def.permissionKeys.join(',')}>{def.render(stats)}</Fragment>
      ))}
    </>
  )
}

AdminDashboard.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>
