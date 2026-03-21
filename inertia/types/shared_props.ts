export type SharedProps = {
  user: {
    id: string
    firstName: string
    lastName: string | null
    email: string
    createdAt: string
    updatedAt: string
  } | null
  isSuperAdmin: boolean
  currentSchool: { id: string; name: string } | null
  enabledModules: string[]
  subscription: { plan: string; status: string; endDate: string | null } | null
  userRole: number | null
  errors: Record<string, string>
  flash: { success?: string; error?: string }
}
