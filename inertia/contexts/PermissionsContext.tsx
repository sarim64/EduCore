import { createContext, useContext, PropsWithChildren, useMemo } from 'react'
import { usePage } from '@inertiajs/react'

// Role IDs matching the backend enum
export const Roles = {
  SUPER_ADMIN: 1,
  SCHOOL_ADMIN: 2,
  PRINCIPAL: 3,
  TEACHER: 4,
  ACCOUNTANT: 5,
  SUPPORT_STAFF: 6,
} as const

type RoleId = (typeof Roles)[keyof typeof Roles]

interface PermissionsContextType {
  roleId: RoleId | null
  roleName: string | null
  enabledModules: string[]
  isSuperAdmin: boolean
  isSchoolAdmin: boolean
  isPrincipal: boolean
  isTeacher: boolean
  isAccountant: boolean
  isSupportStaff: boolean
  hasRole: (roleId: RoleId) => boolean
  hasAnyRole: (roleIds: RoleId[]) => boolean
  canAccessModule: (moduleKey: string) => boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

interface PageProps {
  userRole?: RoleId
  roleName?: string
  enabledModules?: string[]
  [key: string]: unknown
}

export function PermissionsProvider({ children }: PropsWithChildren) {
  const { props } = usePage<PageProps>()

  const value = useMemo<PermissionsContextType>(() => {
    const roleId = props.userRole ?? null
    const enabledModules = props.enabledModules ?? []

    return {
      roleId,
      roleName: props.roleName ?? null,
      enabledModules,
      isSuperAdmin: roleId === Roles.SUPER_ADMIN,
      isSchoolAdmin: roleId === Roles.SCHOOL_ADMIN,
      isPrincipal: roleId === Roles.PRINCIPAL,
      isTeacher: roleId === Roles.TEACHER,
      isAccountant: roleId === Roles.ACCOUNTANT,
      isSupportStaff: roleId === Roles.SUPPORT_STAFF,
      hasRole: (id: RoleId) => roleId === id,
      hasAnyRole: (ids: RoleId[]) => roleId !== null && ids.includes(roleId),
      canAccessModule: (moduleKey: string) => enabledModules.includes(moduleKey),
    }
  }, [props.userRole, props.roleName, props.enabledModules])

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}

export function useRole() {
  const { roleId, roleName } = usePermissions()
  return { roleId, roleName }
}

export function useCanAccessModule(moduleKey: string) {
  const { canAccessModule } = usePermissions()
  return canAccessModule(moduleKey)
}

export default PermissionsContext
