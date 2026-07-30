-- Private first-run setup wizard state. Drafts stay unpublished until final review.
INSERT INTO site_settings (
  key,
  value,
  category,
  description,
  is_public,
  sort_order
)
VALUES (
  'admin_setup',
  '{
    "completed": false,
    "dismissed": false,
    "currentStep": "identity",
    "completedAt": null,
    "completedBy": null,
    "lastError": null,
    "publishedIds": {
      "tours": {},
      "blogPosts": {},
      "faqs": {},
      "heroSlides": {}
    },
    "draft": null
  }'::jsonb,
  'admin',
  'First-run admin setup wizard state (private)',
  false,
  90
)
ON CONFLICT (key) DO NOTHING;
