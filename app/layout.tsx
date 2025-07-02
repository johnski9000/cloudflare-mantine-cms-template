import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "../theme";
import "./globals.css";
import AuthProvider from "./components/Providers/AuthProvider";
import { getSession } from "auth";
import { Notifications } from "@mantine/notifications";
import { BasketProvider } from "./context/BasketContext";
import { ModalsProvider } from "@mantine/modals";

// Cloudflare CMS Template Metadata
export const metadata = {
  title: "Cloudflare CMS Template | Modern Content Management System",
  description:
    "A modern, fast, and scalable CMS template built with Next.js, Mantine UI, and optimized for Cloudflare deployment. Perfect for content creators and developers.",
  keywords:
    "Cloudflare CMS, Next.js template, Mantine UI, headless CMS, content management system, React CMS, modern CMS template, JAMstack CMS",

  // Open Graph for social media
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-cloudflare-cms.com",
    siteName: "Cloudflare CMS Template",
    title: "Cloudflare CMS Template | Modern Content Management System",
    description:
      "A modern, fast, and scalable CMS template built with Next.js, Mantine UI, and optimized for Cloudflare deployment.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cloudflare CMS Template - Modern Content Management System",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@YourCMSTemplate",
    creator: "@YourCMSTemplate",
    title: "Cloudflare CMS Template | Modern CMS",
    description:
      "A modern, fast, and scalable CMS template built with Next.js and Mantine UI, optimized for Cloudflare deployment.",
    images: ["/og-image.jpg"],
  },

  // Additional SEO metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: "https://your-cloudflare-cms.com",
    languages: {
      "en-US": "https://your-cloudflare-cms.com",
    },
  },

  // General metadata
  other: {
    rating: "general",
    distribution: "global",
    "revisit-after": "7 days",
    author: "Cloudflare CMS Template",
    copyright: "Cloudflare CMS Template",

    // CMS Schema JSON-LD
    "application-ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Cloudflare CMS Template",
      description:
        "A modern, fast, and scalable CMS template built with Next.js, Mantine UI, and optimized for Cloudflare deployment.",
      url: "https://your-cloudflare-cms.com",
      applicationCategory: "ContentManagementSystem",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        name: "Your Name",
      },
    }),
  },

  // Verification tags (replace with actual values)
  verification: {
    google: "your-google-site-verification-code",
  },

  // App links
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", sizes: "16x16", type: "image/svg" },
      { url: "/favicon.svg", sizes: "32x32", type: "image/svg" },
    ],
    apple: [{ url: "/favicon.svg", sizes: "180x180", type: "image/svg" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#1976d2",
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: any }) {
  const session = await getSession();
  return (
    <html lang="en-US" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />

        {/* Additional SEO and Performance Meta Tags */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="msapplication-TileColor" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cloudflare CMS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* DNS Prefetch for common domains */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Structured Data for Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://your-cloudflare-cms.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "CMS Dashboard",
                  item: "https://your-cloudflare-cms.com/dashboard",
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider session={session}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications zIndex={1000} />
              <BasketProvider defaultCurrency="£">{children}</BasketProvider>
            </ModalsProvider>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
