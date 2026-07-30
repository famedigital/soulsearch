'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormTextarea } from '@/components/ui/form-field';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

interface HeroSlide {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  image_public_id: string;
  mobile_image_url?: string;
  mobile_image_public_id?: string;
  cta_text?: string;
  cta_link?: string;
  slide_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function HeroSlidesManagement() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/hero-slides');
      if (!response.ok) throw new Error('Failed to fetch hero slides');

      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !slide.is_active }),
      });

      if (!response.ok) throw new Error('Failed to update slide');

      toast.success(`Slide ${!slide.is_active ? 'activated' : 'deactivated'}`);
      await fetchSlides();
    } catch (error: any) {
      console.error('Toggle error:', error);
      toast.error('Failed to update slide status');
    }
  };

  const handleDelete = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete slide');

      toast.success('Slide deleted successfully');
      await fetchSlides();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete slide');
    }
  };

  const openEditModal = (slide?: HeroSlide) => {
    setEditingSlide(slide || null);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading hero slides...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Hero Slides</h2>
          <p className="text-muted-foreground mt-1">{slides.length} slides</p>
        </div>
        <Button
          onClick={() => openEditModal()}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Hero Slides Yet</p>
              <p className="text-sm mb-4">Create your first hero slide to get started</p>
              <Button onClick={() => openEditModal()}>
                <Plus className="h-4 w-4" />
                Add First Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide) => (
            <Card key={slide.id} className="transition-shadow">
              <CardContent className="p-4">
                {/* Slide Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                  <img
                    src={slide.image_url}
                    alt={slide.title || 'Hero slide'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="secondary">Order: {slide.slide_order}</Badge>
                  </div>
                </div>

                {/* Slide Details */}
                <div className="mb-3">
                  <h3 className="font-bold text-lg truncate">{slide.title || 'Untitled'}</h3>
                  <p className="text-sm text-muted-foreground truncate">{slide.subtitle || slide.description || 'No description'}</p>
                  {slide.cta_text && (
                    <p className="text-xs text-primary mt-1">CTA: {slide.cta_text}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => openEditModal(slide)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleToggleActive(slide)}
                  >
                    {slide.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleDelete(slide.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <HeroSlideForm
              slide={editingSlide}
              onSave={async (slideData) => {
                try {
                  setSaving(true);
                  const url = editingSlide
                    ? `/api/admin/hero-slides/${editingSlide.id}`
                    : '/api/admin/hero-slides';
                  const method = editingSlide ? 'PATCH' : 'POST';

                  const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(slideData),
                  });

                  if (!response.ok) throw new Error('Failed to save slide');

                  toast.success(`Slide ${editingSlide ? 'updated' : 'created'} successfully`);
                  setShowEditModal(false);
                  await fetchSlides();
                } catch (error: any) {
                  console.error('Save error:', error);
                  toast.error('Failed to save slide');
                } finally {
                  setSaving(false);
                }
              }}
              onCancel={() => setShowEditModal(false)}
              loading={saving}
            />
          </Card>
        </div>
      )}
    </div>
  );
}

function HeroSlideForm({
  slide,
  onSave,
  onCancel,
  loading,
}: {
  slide?: HeroSlide | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    image_url: slide?.image_url || '',
    image_public_id: slide?.image_public_id || '',
    mobile_image_url: slide?.mobile_image_url || '',
    mobile_image_public_id: slide?.mobile_image_public_id || '',
    cta_text: slide?.cta_text || '',
    cta_link: slide?.cta_link || '',
    slide_order: slide?.slide_order || 0,
    is_active: slide?.is_active ?? true,
  });
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url || !formData.image_public_id) {
      toast.error('Please select a hero image');
      return;
    }
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{slide ? 'Edit Slide' : 'New Slide'}</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={onCancel}
          className="text-2xl"
        >
          ×
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Slide title"
        />
        <FormField
          label="Subtitle"
          value={formData.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Subtitle text"
        />
      </div>

      <FormTextarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Slide description"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="CTA Button Text"
          value={formData.cta_text}
          onChange={(e) => handleChange('cta_text', e.target.value)}
          placeholder="e.g., 'Book Now'"
        />
        <FormField
          label="CTA Link"
          value={formData.cta_link}
          onChange={(e) => handleChange('cta_link', e.target.value)}
          placeholder="e.g., /tours"
        />
      </div>

      <FormField
        label="Slide Order"
        type="number"
        value={formData.slide_order?.toString() || '0'}
        onChange={(e) => handleChange('slide_order', parseInt(e.target.value) || 0)}
        placeholder="Display order (0 = first)"
      />

      <div className="flex items-center gap-2 min-h-11">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleChange('is_active', checked === true)}
        />
        <label htmlFor="is_active" className="text-sm font-medium">
          Active (show on homepage)
        </label>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center space-y-3">
        {formData.image_url ? (
          <img
            src={formData.image_url}
            alt="Preview"
            className="mx-auto max-h-40 rounded-lg object-cover object-top"
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
        )}
        <p className="text-xs text-muted-foreground">
          Use a wide landscape photo. The homepage fills the screen and keeps the top of the image
          visible (not zoomed into the center).
        </p>
        <p className="text-sm text-muted-foreground">
          {formData.image_url ? 'Hero image selected' : 'Select a hero image from Media Library'}
        </p>
        <Button type="button" onClick={() => setShowMediaPicker(true)}>
          {formData.image_url ? 'Change Image' : 'Choose Image'}
        </Button>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 justify-end pt-4 sticky bottom-0 bg-card">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {slide ? 'Update' : 'Create'} Slide
        </Button>
      </div>

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(media) => {
          const item = Array.isArray(media) ? media[0] : media;
          if (item) {
            handleChange('image_url', item.secure_url || item.url);
            handleChange('image_public_id', item.public_id);
          }
          setShowMediaPicker(false);
        }}
        multiple={false}
        allowedTypes={['image']}
        currentFolder="hero"
      />
    </form>
  );
}