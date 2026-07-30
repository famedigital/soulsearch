-- Dynamic content pages + FAQs (schema + lightweight Soul Search seeds)

CREATE TABLE IF NOT EXISTS content_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type VARCHAR(50) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL UNIQUE,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION update_content_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_content_pages_updated_at ON content_pages;
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_content_pages_updated_at();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_content_pages_updated_at();

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_faqs_sort ON faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_content_pages_type ON content_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_content_pages_active ON content_pages(is_active) WHERE is_active = true;

INSERT INTO content_pages (page_type, content, metadata) VALUES (
  'about',
  '{
    "hero": {
      "title": "Soul Search Tours",
      "subtitle": "Citrus-bright journeys, sky-wide horizons, mint-fresh adventures",
      "cta": { "text": "Explore Our Tours", "link": "/tours" }
    },
    "story": {
      "title": "Our Story",
      "content": "Soul Search Tours crafts personal journeys that reconnect travelers with place, culture, and wonder.",
      "founded": "2026"
    },
    "values": [
      { "title": "Authentic Experiences", "description": "Local-led journeys that go beyond the checklist." },
      { "title": "Sustainable Travel", "description": "Care for communities and landscapes on every trip." },
      { "title": "Personal Service", "description": "Itineraries shaped around your pace and interests." }
    ]
  }'::jsonb,
  '{"seoTitle": "About Us - Soul Search Tours", "seoDescription": "Learn about Soul Search Tours."}'::jsonb
) ON CONFLICT (page_type) DO NOTHING;

INSERT INTO content_pages (page_type, content, metadata) VALUES (
  'contact',
  '{
    "hero": {
      "title": "Get in Touch",
      "subtitle": "We are here to help you plan your next adventure"
    },
    "contactInfo": {
      "email": "hello@soulsearch.com",
      "phone": "+975 0000000",
      "address": "Thimphu, Bhutan",
      "whatsapp": ""
    },
    "officeHours": {
      "weekdays": "9:00 AM - 6:00 PM",
      "saturdays": "10:00 AM - 4:00 PM",
      "sundays": "Closed"
    },
    "formFields": {
      "showName": true,
      "showEmail": true,
      "showPhone": true,
      "showTravelDates": true,
      "showGroupSize": true,
      "showMessage": true,
      "requiredFields": ["name", "email", "message"]
    },
    "autoReply": {
      "enabled": true,
      "subject": "Thank you for contacting Soul Search Tours",
      "message": "We received your message and will reply within 24 hours."
    }
  }'::jsonb,
  '{"seoTitle": "Contact Us - Soul Search Tours", "seoDescription": "Contact Soul Search Tours."}'::jsonb
) ON CONFLICT (page_type) DO NOTHING;

INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('What is the best time to visit?', 'Spring and autumn usually offer the clearest weather and most comfortable travel conditions.', 'General', 1),
  ('Can I customize my itinerary?', 'Yes — every journey can be tailored to your dates, pace, and interests.', 'Booking', 2)
ON CONFLICT (question) DO NOTHING;
