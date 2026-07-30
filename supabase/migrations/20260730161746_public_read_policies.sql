-- Public read access for anon/authenticated clients.
-- Admin mutations use the service role (bypasses RLS).

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_documents ENABLE ROW LEVEL SECURITY;

-- Tours: public can read active published packages
DROP POLICY IF EXISTS "Public read published tours" ON tours;
CREATE POLICY "Public read published tours" ON tours
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND is_published = true);

-- Blog: public can read published posts
DROP POLICY IF EXISTS "Public read published posts" ON blog_posts;
CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Hero slides: active only
DROP POLICY IF EXISTS "Public read active hero slides" ON hero_slides;
CREATE POLICY "Public read active hero slides" ON hero_slides
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Testimonials: approved featured/public list
DROP POLICY IF EXISTS "Public read approved testimonials" ON testimonials;
CREATE POLICY "Public read approved testimonials" ON testimonials
  FOR SELECT TO anon, authenticated
  USING (is_approved = true);

-- Site settings: public keys only
DROP POLICY IF EXISTS "Public read public settings" ON site_settings;
CREATE POLICY "Public read public settings" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- Content pages + FAQs
DROP POLICY IF EXISTS "Public read active content pages" ON content_pages;
CREATE POLICY "Public read active content pages" ON content_pages
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Public read active faqs" ON faqs;
CREATE POLICY "Public read active faqs" ON faqs
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Sensitive tables: no anon policies (service role bypasses RLS)
-- Explicit deny-by-default for admin_users, bookings, inquiries, etc.
