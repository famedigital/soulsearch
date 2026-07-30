import 'server-only'

import { cache } from 'react'
import { createAdminClient } from '@/utils/supabase/admin'
import {
  SETUP_SETTING_KEY,
  createDefaultSetupState,
  normalizeSetupState,
  type SetupState,
} from '@/lib/setup-config'

export const getSetupState = cache(async (): Promise<SetupState> => {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SETUP_SETTING_KEY)
      .maybeSingle()

    if (error) throw error
    if (!data?.value) return createDefaultSetupState()
    return normalizeSetupState(data.value)
  } catch (error) {
    console.error('[getSetupState]', error)
    return createDefaultSetupState()
  }
})

export async function saveSetupState(state: SetupState): Promise<SetupState> {
  const normalized = normalizeSetupState(state)
  const supabase = createAdminClient()
  const now = new Date().toISOString()

  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('key', SETUP_SETTING_KEY)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await supabase
      .from('site_settings')
      .update({
        value: normalized,
        category: 'admin',
        description: 'First-run admin setup wizard state (private)',
        is_public: false,
        updated_at: now,
      })
      .eq('key', SETUP_SETTING_KEY)
    if (error) throw error
  } else {
    const { error } = await supabase.from('site_settings').insert({
      key: SETUP_SETTING_KEY,
      value: normalized,
      category: 'admin',
      description: 'First-run admin setup wizard state (private)',
      is_public: false,
      sort_order: 90,
    })
    if (error) throw error
  }

  return normalized
}
