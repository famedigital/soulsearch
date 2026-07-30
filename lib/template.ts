import 'server-only'

import { cache } from 'react'
import { createAdminClient } from '@/utils/supabase/admin'
import {
  DEFAULT_SITE_TEMPLATE,
  normalizeSiteTemplate,
  type SiteTemplateId,
} from '@/lib/template-config'

export const getSiteTemplate = cache(async (): Promise<SiteTemplateId> => {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'site_template')
      .maybeSingle()

    if (error) throw error
    return normalizeSiteTemplate(data?.value)
  } catch (error) {
    console.error('[getSiteTemplate]', error)
    return DEFAULT_SITE_TEMPLATE
  }
})
