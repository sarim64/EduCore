import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

type Props = {
  title: string
  items: React.ReactNode[]
}

export default function ListWidget({ title, items }: Props) {
  const [open, setOpen] = useState(false)
  const preview = items.slice(0, 10)
  const hasMore = items.length > 10

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
      <ul className="space-y-1 text-sm text-gray-600">
        {preview.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {hasMore && (
        <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => setOpen(true)}>
          Show All ({items.length})
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ul className="space-y-1 text-sm text-gray-600">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  )
}
