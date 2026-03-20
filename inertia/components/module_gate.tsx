import type { ReactNode } from 'react'
import { useModules } from '~/hooks/use_modules'

interface ModuleGateProps {
  module: string
  children: ReactNode
  fallback?: ReactNode
}

export function ModuleGate({ module, children, fallback }: ModuleGateProps) {
  const { isModuleEnabled } = useModules()

  if (!isModuleEnabled(module)) {
    return fallback ?? null
  }

  return <>{children}</>
}
