'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormTextarea } from '@/components/ui/form-field';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { HOME_DEFAULTS, mergeHomeContent, type HomeContent } from '@/lib/content/home';

const ICON_OPTIONS = ['Heart', 'Shield', 'Mountain', 'Clock', 'Users', 'Compass', 'Star', 'Globe']

export function HomePageForm() {
  const [content, setContent] = useState<HomeContent>(HOME_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHomeContent()
  }, [])

  const fetchHomeContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/content?type=home')
      const data = await response.json()
      if (response.ok && data.content) {
        setContent(mergeHomeContent(data.content))
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error)
      toast.error('Failed to load homepage content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: 'home',
          content,
          metadata: {
            seoTitle: 'Homepage',
            seoDescription: 'Homepage sections including The Soul Search Difference',
          },
        }),
      })

      if (response.ok) {
        toast.success('Homepage content updated!', {
          description: 'Changes are live on the homepage.',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving homepage content:', error)
      toast.error('Failed to save homepage content')
    } finally {
      setSaving(false)
    }
  }

  const updateDifferentiator = (
    index: number,
    field: 'icon' | 'title' | 'description',
    value: string
  ) => {
    setContent((prev) => {
      const items = [...prev.differentiators.items]
      items[index] = { ...items[index], [field]: value }
      return {
        ...prev,
        differentiators: { ...prev.differentiators, items },
      }
    })
  }

  const addItem = () => {
    setContent((prev) => ({
      ...prev,
      differentiators: {
        ...prev.differentiators,
        items: [
          ...prev.differentiators.items,
          {
            icon: 'Star',
            title: 'New highlight',
            description: 'Describe this strength in one or two sentences.',
          },
        ],
      },
    }))
  }

  const removeItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      differentiators: {
        ...prev.differentiators,
        items: prev.differentiators.items.filter((_, i) => i !== index),
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading homepage content…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Homepage sections</h2>
          <p className="text-sm text-muted-foreground">
            Edit text shown on the public homepage. No coding needed — change the words and save.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save changes
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <h3 className="font-medium">Featured journeys section</h3>
            <p className="text-sm text-muted-foreground">Heading above the featured tour cards</p>
          </div>
          <FormField
            label="Small label"
            value={content.featured.eyebrow}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                featured: { ...prev.featured, eyebrow: e.target.value },
              }))
            }
          />
          <FormField
            label="Title"
            value={content.featured.title}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                featured: { ...prev.featured, title: e.target.value },
              }))
            }
          />
          <FormTextarea
            label="Subtitle"
            value={content.featured.subtitle}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                featured: { ...prev.featured, subtitle: e.target.value },
              }))
            }
            rows={2}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <h3 className="font-medium">The Soul Search Difference</h3>
            <p className="text-sm text-muted-foreground">
              Why-choose-us section on the homepage
            </p>
          </div>
          <FormField
            label="Small label"
            value={content.differentiators.eyebrow}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                differentiators: { ...prev.differentiators, eyebrow: e.target.value },
              }))
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title (before accent)"
              value={content.differentiators.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  differentiators: { ...prev.differentiators, title: e.target.value },
                }))
              }
            />
            <FormField
              label="Accent word (highlighted)"
              value={content.differentiators.titleAccent}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  differentiators: { ...prev.differentiators, titleAccent: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-4 pt-2">
            {content.differentiators.items.map((item, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border border-border bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Highlight {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={content.differentiators.items.length <= 1}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Icon</label>
                    <select
                      value={item.icon}
                      onChange={(e) => updateDifferentiator(index, 'icon', e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FormField
                    label="Title"
                    value={item.title}
                    onChange={(e) => updateDifferentiator(index, 'title', e.target.value)}
                  />
                </div>
                <FormTextarea
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateDifferentiator(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="size-4" />
            Add highlight
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save changes
        </Button>
      </div>
    </div>
  )
}
