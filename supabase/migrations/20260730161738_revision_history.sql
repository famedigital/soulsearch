-- Revision history used by admin CMS audit trail

CREATE TABLE IF NOT EXISTS revision_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_title TEXT,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  old_values JSONB DEFAULT '{}'::jsonb,
  new_values JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revision_history_entity
  ON revision_history (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_revision_history_created_at
  ON revision_history (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_revision_history_user
  ON revision_history (user_id);
