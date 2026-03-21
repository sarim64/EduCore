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
                Welcome to EduCore
              </CardTitle>
              <img
                src="/images/educore_main_logo.png"
                alt="EduCore Logo"
                className="w-80 h-64 object-contain"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </div>
    </>
  )
}
