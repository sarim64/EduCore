import { PropsWithChildren } from 'react'
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

interface PageProps {
  school?: {
    id: string
    name: string
    code: string | null
  }
  currentSchool?: {
    id: string
    name: string
  }
  breadcrumbs?: Array<{ label: string; href?: string }>
  [key: string]: unknown
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { props } = usePage<PageProps>()
  const { currentSchool, breadcrumbs = [] } = props

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
              currentSchool && (
                <span className="text-sm text-muted-foreground">{currentSchool.name}</span>
              )
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
