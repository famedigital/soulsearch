import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Plus_Jakarta_Sans, Inter, Playfair_Display, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  getSiteUrl,
} from "@/lib/seo";
import { getCompanyName, getSiteLogo } from "@/lib/brand";
import { DEFAULT_COMPANY_NAME } from "@/lib/brand-defaults";
import { getGlobalTheme } from "@/lib/theme";
import { themeToCssVariables } from "@/lib/theme-config";
import { getSiteTemplate } from "@/lib/template";
import { TemplateProvider } from "@/components/providers/TemplateProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const [siteName, logo] = await Promise.all([getCompanyName(), getSiteLogo()]);
  const description =
    SITE_DESCRIPTION.replace(DEFAULT_COMPANY_NAME, siteName) || SITE_DESCRIPTION;

  const icons: Metadata['icons'] = logo
    ? {
        icon: [
          { url: '/api/brand/icon/32', sizes: '32x32', type: 'image/png' },
          { url: '/api/brand/icon/192', sizes: '192x192', type: 'image/png' },
          { url: '/api/brand/icon/512', sizes: '512x512', type: 'image/png' },
          { url: logo },
        ],
        apple: [{ url: '/api/brand/icon/180', sizes: '180x180', type: 'image/png' }],
      }
    : {
        icon: [
          { url: '/brand/soulsearch-emblem.svg', type: 'image/svg+xml' },
          { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
          { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteName} - Discover the Last Shangri-La`,
      template: `%s | ${siteName}`,
    },
    description,
    applicationName: siteName,
    keywords: [
      "Bhutan tour",
      "Bhutan travel",
      "Bhutan trekking",
      "Bhutan festival",
      siteName,
      "Bhutan adventures",
    ],
    icons,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName,
      title: `${siteName} - Discover the Last Shangri-La`,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${siteName} — Bhutan tours`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - Discover the Last Shangri-La`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const theme = await getGlobalTheme();
  return {
    themeColor: theme.primary,
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, template] = await Promise.all([getGlobalTheme(), getSiteTemplate()]);
  const themeStyle = themeToCssVariables(theme) as CSSProperties;

  return (
    <html
      lang="en"
      data-template={template}
      style={themeStyle}
      className={cn(
        "h-full antialiased font-sans",
        geist.variable,
        jakartaSans.variable,
        inter.variable,
        playfair.variable
      )}
    >
      <body className="flex min-h-full flex-col font-sans">
        <TemplateProvider template={template}>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </TemplateProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
