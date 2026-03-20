import { PropsWithChildren, ReactNode } from 'react'
import { Toaster } from 'sonner'
import FlashMessages from '../shared/FlashMessage'
import { AppSidebar } from '~/components/AppSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '~/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { usePage } from '@inertiajs/react'
import { BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

interface PageProps {
  school?: {
    id: string
    name: string
    code: string | null
  }
  breadcrumbs?: Array<{ label: string; href?: string }>
  lastUpdated?: string
  [key: string]: unknown
}

interface AnalyticsLayoutProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  actions?: ReactNode
  showRefreshButton?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function AnalyticsLayout({
  children,
  title,
  subtitle,
  actions,
  showRefreshButton = false,
  onRefresh,
  isRefreshing = false,
}: AnalyticsLayoutProps) {
  const { props } = usePage<PageProps>()
  const { school, breadcrumbs = [], lastUpdated } = props

  return (
    <>
      <Toaster richColors position="top-right" />
      <FlashMessages />

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="lg:hidden" />
            {breadcrumbs.length > 0 ? (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={index}>
                      {index < breadcrumbs.length - 1 ? (
                        <>
                          <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              school && <span className="text-sm text-muted-foreground">{school.name}</span>
            )}
          </header>

          {/* Analytics Header Bar */}
          {(title || actions) && (
            <div className="border-b bg-gradient-to-r from-primary/5 to-transparent px-6 py-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-primary" />
                      {title}
                    </h1>
                  )}
                  {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
                  {lastUpdated && (
                    <Badge variant="outline" className="mt-2">
                      Last updated: {lastUpdated}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {showRefreshButton && onRefresh && (
                    <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  )}
                  {actions}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-6 bg-muted/10">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
