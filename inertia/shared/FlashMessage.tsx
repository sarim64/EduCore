import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'

export default function FlashMessages() {
  const { flash } = usePage().props as {
    flash?: Record<string, string>
  }

  useEffect(() => {
    if (!flash) return

    for (const [type, message] of Object.entries(flash)) {
      if (!message) continue

      switch (type) {
        case 'success':
          toast.success(message)
          break
        case 'error':
          toast.error(message)
          break
        case 'warning':
          toast.warning?.(message)
          break
        default:
          toast(message)
      }
    }
  }, [flash])

  return null
}
