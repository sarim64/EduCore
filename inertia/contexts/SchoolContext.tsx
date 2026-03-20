import { createContext, useContext, PropsWithChildren } from 'react'
import { usePage } from '@inertiajs/react'

interface School {
  id: string
  name: string
  code: string | null
  address: string | null
  phone: string | null
  logoUrl: string | null
  settings: Record<string, unknown>
}

interface SchoolContextType {
  school: School | null
  isLoading: boolean
}

const SchoolContext = createContext<SchoolContextType>({
  school: null,
  isLoading: true,
})

interface PageProps {
  school?: School
  [key: string]: unknown
}

export function SchoolProvider({ children }: PropsWithChildren) {
  const { props } = usePage<PageProps>()

  const value: SchoolContextType = {
    school: props.school ?? null,
    isLoading: false,
  }

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
}

export function useSchool() {
  const context = useContext(SchoolContext)
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider')
  }
  return context
}

export function useSchoolId() {
  const { school } = useSchool()
  return school?.id ?? null
}

export default SchoolContext
