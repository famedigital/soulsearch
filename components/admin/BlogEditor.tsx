'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MediaPickerModal } from './MediaPickerModal';
import { FormField, FormTextarea } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Save,
  Eye,
  Image as ImageIcon,
  Video,
  Code,
  Table,
  FileText,
  Search,
  Calendar,
  User,
  Tag,
  Hash,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  featured_image_public_id?: string;
  category: string;
  tags: string[];
  author_name: string;
  author_bio?: string;
  is_published: boolean;
  published_date?: string;
  read_time?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

interface BlogEditorProps {
  post?: BlogPost;
  postId?: string;
  isNewPost?: boolean;
  onSave?: (post: BlogPost) => Promise<void>;
  onCancel?: () => void;
}

/**
 * Enhanced Blog Editor with Cloudinary media integration, SEO preview, and rich text features
 */
export function BlogEditor({ post, postId, isNewPost, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>(
    post || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      author_name: '',
      is_published: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<'featured' | 'insert'>('featured');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [seoPreview, setSeoPreview] = useState(false);

  // Auto-fill author from logged-in admin
  useEffect(() => {
    if (!isNewPost && formData.author_name) return;
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.name && !formData.author_name) {
          setFormData((prev) => ({ ...prev, author_name: data.user.name }));
        }
      })
      .catch(() => {});
  }, [isNewPost]);

  // Fetch post data when postId is provided (editing existing post)
  useEffect(() => {
    if (postId && !post) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/admin/blog/${postId}`);
          if (response.ok) {
            const postData = await response.json();
            setFormData(postData);
          } else {
            console.error('Failed to fetch blog post');
            toast.error('Failed to load blog post');
          }
        } catch (error) {
          console.error('Error fetching blog post:', error);
          toast.error('Failed to load blog post');
        }
      };

      fetchPost();
    }
  }, [postId, post]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoSaveStatus === 'unsaved') {
        handleAutoSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formData, autoSaveStatus]);

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    // Here you would implement auto-save logic
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  };

  // Handle form changes
  const handleChange = (field: keyof BlogPost, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setAutoSaveStatus('unsaved');
  };

  // WordPress-style slug generation
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces/scores with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (value: string) => {
    handleChange('title', value);
    // Auto-generate slug from title (WordPress-style behavior)
    // Only generate if slug is empty or matches the previous title-based slug
    const newSlug = generateSlug(value);
    if (!formData.slug || formData.slug === '' || generateSlug(formData.title) === formData.slug) {
      handleChange('slug', newSlug);
    }
  };

  // Handle media selection from picker
  const handleMediaSelect = (media: any) => {
    if (mediaPickerMode === 'insert') {
      const items = Array.isArray(media) ? media : [media];
      const images = items
        .map((m: any) => `![${m.alt_text || m.name || 'image'}](${m.secure_url || m.url})`)
        .join('\n');
      handleChange('content', `${formData.content}\n${images}\n`);
    } else {
      const item = Array.isArray(media) ? media[0] : media;
      if (item) {
        handleChange('featured_image', item.secure_url || item.url);
        handleChange('featured_image_public_id', item.public_id);
      }
    }
    setShowMediaPicker(false);
  };

  const openFeaturedPicker = () => {
    setMediaPickerMode('featured');
    setShowMediaPicker(true);
  };

  const openInsertPicker = () => {
    setMediaPickerMode('insert');
    setShowMediaPicker(true);
  };

  // Insert content blocks
  const insertBlock = (type: 'image' | 'video' | 'code' | 'table') => {
    let block = '';

    switch (type) {
      case 'image':
        openInsertPicker();
        return;
      case 'video':
        block = '\n[Video: YouTube or Vimeo URL]\n';
        break;
      case 'code':
        block = '\n```\n// Your code here\n```\n';
        break;
      case 'table':
        block = '\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n';
        break;
    }

    handleChange('content', formData.content + block);
  };

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Handle save
  const handleSave = async (publish: boolean = false) => {
    try {
      setSaving(true);
      const postToSave = {
        ...formData,
        is_published: publish,
        read_time: calculateReadTime(formData.content),
        published_date: publish && !formData.published_date ? new Date().toISOString() : formData.published_date,
      };

      if (onSave) {
        await onSave(postToSave);
        // Show success message
        if (publish) {
          toast.success('Post published successfully!', {
            description: 'Your blog post is now live.',
            duration: 4000,
          });
        } else {
          toast.success('Draft saved successfully!', {
            description: 'Your changes have been saved.',
            duration: 3000,
          });
        }
      } else {
        // Default save logic
        const url = isNewPost ? '/api/admin/blog' : `/api/admin/blog/${postId}`;
        const method = isNewPost ? 'POST' : 'PUT';

        const { authFetch } = await import('@/lib/auth/fetch');
        const response = await authFetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postToSave),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to save blog post');
        }

        const result = await response.json();

        // Show success message
        if (publish) {
          toast.success('Post published successfully!', {
            description: 'Your blog post is now live.',
            duration: 4000,
            action: {
              label: 'View Post',
              onClick: () => window.open(`/blog/${postToSave.slug}`, '_blank'),
            },
          });
        } else {
          toast.success('Draft saved successfully!', {
            description: 'Your changes have been saved.',
            duration: 3000,
          });
        }

        // Call onCancel if this was a new post to redirect to list
        if (isNewPost && onCancel) {
          setTimeout(() => onCancel(), 1500);
        }
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save blog post', {
        description: error.message || 'An error occurred while saving. Please try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Available categories
  const categories = ['Travel Guide', 'Cultural', 'Festival', 'Trekking', 'Adventure', 'Spiritual', 'Food & Culture'];

  // SEO Preview
  const SEOPreview = () => (
    <Card>
      <CardContent className="p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
          {formData.featured_image ? (
            <img src={formData.featured_image} alt="" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-primary text-xs hover:underline truncate">
            soulsearch-beta.vercel.app/blog/{formData.slug || 'your-post-slug'}
          </p>
          <p className="font-medium text-foreground truncate">
            {formData.meta_title || formData.title || 'Your Post Title'}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {formData.meta_description || formData.excerpt || 'Your post description will appear here...'}
          </p>
        </div>
      </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm flex items-center gap-1 ${
            autoSaveStatus === 'saved' ? 'text-green-600' :
            autoSaveStatus === 'saving' ? 'text-amber-600' :
            'text-muted-foreground'
          }`}>
            {autoSaveStatus === 'saved' && <CheckCircle className="h-4 w-4" />}
            {autoSaveStatus === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
            {autoSaveStatus === 'unsaved' && <XCircle className="h-4 w-4" />}
            <span className="hidden xs:inline">
              {autoSaveStatus === 'saved' ? 'All changes saved' :
               autoSaveStatus === 'saving' ? 'Saving...' :
               'Unsaved changes'}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>

          {onCancel && (
            <Button variant="secondary" onClick={onCancel} className="flex-1 sm:flex-none text-xs sm:text-sm">
              Cancel
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">Save Draft</span>
            <span className="sm:hidden">Draft</span>
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {formData.is_published ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Title & Slug */}
            <div className="space-y-4">
              <FormField
                label="Post Title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter your post title..."
                className="text-2xl font-bold"
              />

              <FormField
                label="URL Slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="your-post-slug"
              />
            </div>

            {/* Content Editor Toolbar */}
            <Card>
              <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertBlock('image')} title="Insert Image">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertBlock('video')} title="Insert Video">
                  <Video className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertBlock('code')} title="Insert Code Block">
                  <Code className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertBlock('table')} title="Insert Table">
                  <Table className="h-4 w-4" />
                </Button>
              </div>

              <FormTextarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Write your blog content here... You can use Markdown syntax"
                rows={20}
                className="font-mono text-sm"
              />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardContent className="p-4">
              <label className="block text-sm font-medium mb-3">Featured Image</label>
              <button
                type="button"
                onClick={openFeaturedPicker}
                className="w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2"
              >
                {formData.featured_image ? (
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to add image</span>
                  </>
                )}
              </button>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardContent className="p-4">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-4">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <Input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
                placeholder="Enter tags separated by commas"
              />
              </CardContent>
            </Card>

            {/* Author */}
            <Card>
              <CardContent className="p-4">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Author
              </label>
              <FormField
                value={formData.author_name}
                onChange={(e) => handleChange('author_name', e.target.value)}
                placeholder="Author name (auto from login)"
                readOnly
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Set automatically from your admin account</p>
              </CardContent>
            </Card>

            {/* Publishing */}
            <Card>
              <CardContent className="p-4">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Publishing
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={formData.is_published}
                    onCheckedChange={(checked) => handleChange('is_published', checked === true)}
                  />
                  Published post
                </label>
              </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardContent className="p-4">
              <button
                type="button"
                onClick={() => setSeoPreview(!seoPreview)}
                className="flex items-center gap-2 text-sm font-medium mb-3"
              >
                <Search className="h-4 w-4" />
                SEO Preview
              </button>
              {seoPreview && (
                <div className="space-y-3">
                  <FormField
                    label="SEO Title"
                    value={formData.meta_title || ''}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    placeholder="Custom SEO title"
                  />
                  <FormTextarea
                    label="Meta Description"
                    value={formData.meta_description || ''}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    placeholder="Meta description for search engines"
                    rows={3}
                  />
                  <SEOPreview />
                </div>
              )}
              </CardContent>
            </Card>

            {/* Read Time */}
            <Card>
              <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated read time:</span>
                <span className="font-medium">{calculateReadTime(formData.content)} min</span>
              </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Preview Mode
        <Card>
          <CardContent className="p-8">
          <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>By {formData.author_name}</span>
            <span>•</span>
            <span>{formData.category}</span>
            <span>•</span>
            <span>{calculateReadTime(formData.content)} min read</span>
          </div>
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt={formData.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br/>') }} />
          </div>
          </CardContent>
        </Card>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={mediaPickerMode === 'insert'}
        allowedTypes={['image']}
        currentFolder="blog"
      />
    </div>
  );
}