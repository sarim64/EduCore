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
import { FileText, Printer } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface PageProps {
  school?: {
    id: string
    name: string
    code: string | null
  }
  breadcrumbs?: Array<{ label: string; href?: string }>
  [key: string]: unknown
}

interface ReportLayoutProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  actions?: ReactNode
  showPrintButton?: boolean
}

export default function ReportLayout({
  children,
  title,
  subtitle,
  actions,
  showPrintButton = true,
}: ReportLayoutProps) {
  const { props } = usePage<PageProps>()
  const { school, breadcrumbs = [] } = props

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <FlashMessages />

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 print:hidden">
            <SidebarTrigger className="lg:hidden" />
            {breadcrumbs.length > 0 ? (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/reports">
                      <FileText className="h-4 w-4 mr-1 inline" />
                      Reports
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
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

          {/* Report Header Bar */}
          {(title || actions) && (
            <div className="border-b bg-muted/30 px-6 py-4 print:bg-white print:border-none">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <FileText className="h-6 w-6 text-muted-foreground print:hidden" />
                      {title}
                    </h1>
                  )}
                  {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  {showPrintButton && (
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  )}
                  {actions}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-6 print:p-0">{children}</main>

          {/* Print Footer */}
          <footer className="hidden print:block text-center text-sm text-muted-foreground py-4 border-t">
            <p>
              Generated on {new Date().toLocaleDateString()} | {school?.name}
            </p>
          </footer>
        </SidebarInset>
      </SidebarProvider>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
