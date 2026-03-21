import {
  Home,
  GraduationCap,
  Users,
  UserCog,
  CalendarCheck,
  Receipt,
  BarChart3,
  LogOut,
  ChevronDown,
  ArrowLeftFromLine,
  Building2,
  ClipboardList,
  CreditCard,
  Mail,
} from 'lucide-react'
import { Link, usePage, router } from '@inertiajs/react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '~/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'

type SubMenuItem = {
  title: string
  url: string
}

type MenuItem = {
  title: string
  url: string
  icon: typeof Home
  items?: SubMenuItem[]
  module?: string
}

// Main menu items for regular users (school context)
const schoolMainMenuItems: MenuItem[] = [{ title: 'Dashboard', url: '/', icon: Home }]

// Main menu items for super admins (no school context)
const adminMainMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/admin', icon: Home },
  { title: 'Schools', url: '/admin/schools', icon: Building2 },
  { title: 'Plans', url: '/admin/plans', icon: CreditCard },
  { title: 'Audit Logs', url: '/admin/audit-logs', icon: ClipboardList },
]

const academicsItems: MenuItem[] = [
  {
    title: 'Academics',
    url: '/academics',
    icon: GraduationCap,
    items: [
      { title: 'Academic Years', url: '/academics/years' },
      { title: 'Classes', url: '/academics/classes' },
      { title: 'Subjects', url: '/academics/subjects' },
    ],
  },
]

const studentsItems: MenuItem[] = [
  {
    title: 'Students',
    url: '/students',
    icon: Users,
    items: [
      { title: 'All Students', url: '/students' },
      { title: 'Guardians', url: '/guardians' },
    ],
  },
]

const staffItems: MenuItem[] = [
  {
    title: 'Staff',
    url: '/staff',
    icon: UserCog,
    items: [
      { title: 'Staff Members', url: '/staff/members' },
      { title: 'Departments', url: '/staff/departments' },
      { title: 'Designations', url: '/staff/designations' },
      { title: 'Teacher Assignments', url: '/staff/teacher-assignments' },
    ],
  },
]

const attendanceItems: MenuItem[] = [
  {
    title: 'Attendance',
    url: '/attendance',
    icon: CalendarCheck,
    items: [
      { title: 'Student Attendance', url: '/attendance/students' },
      { title: 'Staff Attendance', url: '/attendance/staff' },
      { title: 'Leave Applications', url: '/attendance/leaves' },
      { title: 'Leave Types', url: '/attendance/leave-types' },
      { title: 'Reports', url: '/attendance/reports' },
    ],
  },
]

const feesItems: MenuItem[] = [
  {
    title: 'Fee Management',
    url: '/fees',
    icon: Receipt,
    items: [
      { title: 'Fee Categories', url: '/fees/categories' },
      { title: 'Fee Structures', url: '/fees/structures' },
      { title: 'Fee Challans', url: '/fees/challans' },
      { title: 'Payments', url: '/fees/payments' },
      { title: 'Discounts', url: '/fees/discounts' },
    ],
  },
]

const reportsItems: MenuItem[] = [
  {
    title: 'Reports',
    url: '/reports',
    icon: BarChart3,
    items: [
      { title: 'Overview', url: '/reports' },
      { title: 'Enrollment Report', url: '/reports/enrollment' },
      { title: 'Staff Directory', url: '/reports/staff-directory' },
    ],
  },
]

function NavItem({ item }: { item: MenuItem }) {
  const { url: currentUrl } = usePage()
  const isDashboard = item.url === '/' || item.url === '/admin'

  const isActive = isDashboard
    ? currentUrl === item.url
    : currentUrl === item.url || currentUrl.startsWith(item.url + '/')

  if (item.items && item.items.length > 0) {
    return (
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.url}>
                  <SidebarMenuSubButton asChild isActive={currentUrl === subItem.url}>
                    <Link href={subItem.url}>{subItem.title}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <Link href={item.url}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SCHOOL_ADMIN_ROLE = 2

export function AppSidebar() {
  const { isSuperAdmin, currentSchool, userRole } = usePage<{
    isSuperAdmin: boolean
    currentSchool: { id: string; name: string } | null
    userRole: number | null
  }>().props

  const isSchoolAdmin = userRole === SCHOOL_ADMIN_ROLE || isSuperAdmin

  const handleExitSchool = () => {
    router.post('/admin/schools/exit')
  }


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <a
          href="/"
          className="py-2 px-4 text-xl font-semibold flex flex-row items-center gap-2 cursor-pointer hover:opacity-80 transition"
        >
          <img
            src="/images/educore_icon.png"
            alt="EduCore Logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-primary">EduCore</span>
        </a>
      </SidebarHeader>

      <SidebarContent>
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Super admin without school context sees admin menu */}
              {isSuperAdmin && !currentSchool
                ? adminMainMenuItems.map((item) => <NavItem key={item.url} item={item} />)
                : schoolMainMenuItems.map((item) => <NavItem key={item.url} item={item} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* School-specific sections - only shown when in school context */}
        {currentSchool && (
          <>
            {/* Academic */}
            <SidebarGroup>
              <SidebarGroupLabel>Academic</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {academicsItems.map((item) => (
                    <NavItem key={item.url} item={item} />
                  ))}
                  {studentsItems.map((item) => (
                    <NavItem key={item.url} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Management */}
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {staffItems.map((item) => (
                    <NavItem key={item.url} item={item} />
                  ))}
                  {attendanceItems.map((item) => (
                    <NavItem key={item.url} item={item} />
                  ))}
                  {isSchoolAdmin && (
                    <NavItem
                      item={{ title: 'Invitations', url: '/invites', icon: Mail }}
                    />
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Financial */}
            <SidebarGroup>
              <SidebarGroupLabel>Financial</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {feesItems.map((item) => (
                    <NavItem key={item.url} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Analytics */}
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {reportsItems.map((item) => (
                    <NavItem key={item.url} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          {isSuperAdmin && currentSchool && (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Exit School" onClick={handleExitSchool}>
                <ArrowLeftFromLine className="h-4 w-4" />
                <span>Exit School</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {currentSchool && !isSuperAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Switch School">
                <Link href="/schools/select">
                  <Building2 className="h-4 w-4" />
                  <span>Switch School</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/auth/logout" method="post">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
