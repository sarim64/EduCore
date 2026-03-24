import { type PropsWithChildren } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Toaster } from 'sonner'
import FlashMessages from '../shared/FlashMessage'
import { Badge } from '~/components/ui/badge'
import { LayoutDashboard, School, CreditCard, ScrollText, LogOut } from 'lucide-react'
import type { SharedProps } from '~/types/shared_props'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Schools', href: '/admin/schools', icon: School },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
]

function getInitials(firstName: string, lastName: string | null): string {
  return `${firstName[0]}${lastName?.[0] ?? ''}`.toUpperCase()
}

export default function SuperAdminLayout({ children }: PropsWithChildren) {
  const { props, url } = usePage<{ props: SharedProps }>()
  const user = (props as unknown as SharedProps).user

  function isActive(href: string): boolean {
    if (href === '/admin') return url === '/admin'
    return url.startsWith(href)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Toaster richColors position="top-right" />
      <FlashMessages />

      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-900 flex flex-col">
        {/* Logo + badge */}
        <div className="px-5 pt-6 pb-4 border-b border-gray-700">
          <p className="text-white font-bold text-lg leading-tight">EduCore</p>
          <Badge className="mt-1.5 bg-violet-600 hover:bg-violet-600 text-white text-xs px-2 py-0.5">
            SUPER ADMIN
          </Badge>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              ].join(' ')}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {user && (
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.firstName} {user.lastName ?? ''}
                </p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {user && (
            <Link
              href="/auth/logout"
              method="post"
              as="button"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 text-sm px-3 py-1 rounded-sm transition-colors"
            >
              <LogOut size={15} />
              Logout
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
