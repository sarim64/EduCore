import { PropsWithChildren } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Toaster } from 'sonner'
import FlashMessages from '../shared/FlashMessage'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster richColors position="top-center" />
      <FlashMessages />

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border bg-background shadow">
          <CardHeader>
            <div className="flex flex-col items-center gap-3">
              <CardTitle className="text-3xl font-bold text-center text-foreground">
                Welcome to SchoolSphere
              </CardTitle>
              <img
                src="/images/main-logo.png"
                alt="Asset Intelligence Layer Logo"
                className="w-40 h-30 object-contain"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </div>
    </>
  )
}
