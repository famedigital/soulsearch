'use client'

import { useState } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'

export function SetupMediaField({
  label,
  url,
  publicId,
  onChange,
  hint,
}: {
  label: string
  url: string
  publicId?: string
  onChange: (next: { url: string; publicId: string }) => void
  hint?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3">
        {url ? (
          <img src={url} alt="" className="h-20 w-auto max-w-[10rem] rounded-md object-cover" />
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            {url ? 'Change image' : 'Choose image'}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange({ url: '', publicId: '' })}
            >
              <X className="size-4" />
              Remove
            </Button>
          )}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <MediaPickerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={(media) => {
          const item = Array.isArray(media) ? media[0] : media
          if (item) {
            onChange({
              url: item.secure_url || item.url,
              publicId: item.public_id || publicId || '',
            })
          }
          setOpen(false)
        }}
      />
    </div>
  )
}
