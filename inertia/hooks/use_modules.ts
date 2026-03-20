import { usePage } from '@inertiajs/react'

export function useModules() {
  const { enabledModules } = usePage<{ enabledModules: string[] }>().props

  const modules = enabledModules ?? []

  return {
    enabledModules: modules,
    isModuleEnabled: (_moduleKey: string) => true,
  }
}
