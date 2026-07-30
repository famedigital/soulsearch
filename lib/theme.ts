import 'server-only'

import { cache } from 'react'
import { createAdminClient } from '@/utils/supabase/admin'
import {
  DEFAULT_GLOBAL_THEME,
  normalizeGlobalTheme,
  type GlobalTheme,
} from '@/lib/theme-config'

export const getGlobalTheme = cache(async (): Promise<GlobalTheme> => {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'global_theme')
      .maybeSingle()

    if (error) throw error
    return normalizeGlobalTheme(data?.value)
  } catch (error) {
    console.error('[getGlobalTheme]', error)
    return DEFAULT_GLOBAL_THEME
  }
})
