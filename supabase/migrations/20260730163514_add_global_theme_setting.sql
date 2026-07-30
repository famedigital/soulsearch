INSERT INTO site_settings (
  key,
  value,
  category,
  description,
  is_public,
  sort_order
)
VALUES (
  'global_theme',
  '{
    "primary": "#F5C542",
    "secondary": "#22B8E6",
    "accent": "#63D9A6",
    "background": "#F7FCFA",
    "foreground": "#123047"
  }'::jsonb,
  'appearance',
  'Global color theme for the public website and admin portal',
  true,
  0
)
ON CONFLICT (key) DO NOTHING;
