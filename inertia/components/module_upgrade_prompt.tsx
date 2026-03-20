import { Lock } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'

interface ModuleUpgradePromptProps {
  moduleName: string
}

export function ModuleUpgradePrompt({ moduleName }: ModuleUpgradePromptProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Lock className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          This feature requires the <span className="font-semibold">{moduleName}</span> module.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Contact your administrator to enable it.
        </p>
      </CardContent>
    </Card>
  )
}
