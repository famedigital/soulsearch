'use client'

import { createContext, useContext } from 'react'
import { DEFAULT_SITE_TEMPLATE, type SiteTemplateId } from '@/lib/template-config'

const TemplateContext = createContext<SiteTemplateId>(DEFAULT_SITE_TEMPLATE)

export function TemplateProvider({
  template,
  children,
}: {
  template: SiteTemplateId
  children: React.ReactNode
}) {
  return <TemplateContext.Provider value={template}>{children}</TemplateContext.Provider>
}

/**
 * Lets shared client chrome (navigation, footer) pick a layout without every
 * public page having to thread the template down as a prop.
 */
export function useSiteTemplate(): SiteTemplateId {
  return useContext(TemplateContext)
}
