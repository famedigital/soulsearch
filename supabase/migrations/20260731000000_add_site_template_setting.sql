-- Layout template for the public website, selectable from the admin CMS.
-- Valid values: 'aurora' | 'editorial' | 'immersive' (see lib/template-config.ts).
INSERT INTO site_settings (
  key,
  value,
  category,
  description,
  is_public,
  sort_order
)
VALUES (
  'site_template',
  '"aurora"'::jsonb,
  'appearance',
  'Layout template used across the public website',
  true,
  1
)
ON CONFLICT (key) DO NOTHING;
