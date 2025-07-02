"use client";
import {
  Button,
  Divider,
  Input,
  Text,
  List,
  Paper,
  ThemeIcon,
} from "@mantine/core";
import React, { useState } from "react";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

function CreatePage() {
  const [slug, setSlug] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const slugRegex =
    /^[a-z0-9]+(?:[-a-z0-9]*[a-z0-9])?(?:\/[a-z0-9]+(?:[-a-z0-9]*[a-z0-9])?)*$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();

    // Allow user to type `/` freely but sanitize on submission
    setSlug(value);

    if (value && !slugRegex.test(value)) {
      setError(
        "Invalid format: Only lowercase letters, numbers, hyphens (-), and forward slashes (/) are allowed."
      );
    } else {
      setError("");
    }
  };

  // Updated addPage function with complete metadata
  const addPage = async () => {
    if (!slug || error) return;

    // Sanitization before sending to API
    const cleanedSlug = slug
      .replace(/^\/+/, "") // Remove leading slashes
      .replace(/\/+$/, "") // Remove trailing slashes
      .replace(/\/{2,}/g, "/"); // Remove consecutive slashes

    // Generate title from slug
    const generateTitle = (slug: string) => {
      return slug
        .split(/[-/]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const pageTitle = generateTitle(cleanedSlug);
    const siteName = "Your Company Name"; // Replace with your actual site name
    const siteUrl = "https://yoursite.com"; // Replace with your actual site URL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: cleanedSlug,
          pageData: {
            // Page Status & Identification
            slug: cleanedSlug,
            status: "draft",
            components: [], // Components at root level

            // All metadata grouped together
            metaData: {
              // Core SEO Meta Tags
              seo: {
                title: `${pageTitle} | ${siteName}`,
                description: `Learn more about ${pageTitle.toLowerCase()} at ${siteName}. Discover our services, solutions, and expertise.`,
                keywords: [
                  ...cleanedSlug.split(/[-/]/),
                  "company",
                  "services",
                  "solutions",
                ],
                canonical: `${siteUrl}/${cleanedSlug}`,
                robots: "index, follow",
                author: siteName,

                // Additional SEO fields for maximum ranking potential
                alternates: {
                  // Language alternates for international SEO
                  languages: {
                    "en-US": `${siteUrl}/${cleanedSlug}`,
                    "en-GB": `${siteUrl}/gb/${cleanedSlug}`,
                  },
                  // Mobile/AMP version if applicable
                  media: {
                    mobile: `${siteUrl}/m/${cleanedSlug}`,
                  },
                },

                // Advanced robots directives
                googlebot:
                  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",

                // Content categorization
                articleSection: pageTitle,
                articleTags: cleanedSlug.split(/[-/]/),

                // Publishing metadata
                datePublished: new Date().toISOString(),
                dateModified: new Date().toISOString(),

                // Site verification (add your actual codes)
                verification: {
                  google: "your-google-verification-code",
                  bing: "your-bing-verification-code",
                  yandex: "your-yandex-verification-code",
                },
              },

              // Open Graph (Social Media)
              openGraph: {
                title: `${pageTitle} | ${siteName}`,
                description: `Learn more about ${pageTitle.toLowerCase()} at ${siteName}. Discover our services, solutions, and expertise.`,
                image:
                  "https://via.placeholder.com/1200x630/0ea5e9/ffffff?text=Open+Graph+Image",
                imageAlt: `${pageTitle} - ${siteName}`, // Important for accessibility
                type: "website",
                url: `${siteUrl}/${cleanedSlug}`,
                siteName: siteName,
                locale: "en_US",
                alternateLocale: ["en_GB", "en_CA"], // For international reach
                determiner: "the", // For proper grammar in shares
                video: null, // Can add video URL if applicable
                audio: null, // Can add audio URL if applicable
              },

              // Twitter Card
              twitter: {
                card: "summary_large_image",
                title: `${pageTitle} | ${siteName}`,
                description: `Learn more about ${pageTitle.toLowerCase()} at ${siteName}.`,
                image:
                  "https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=Twitter+Card+Image",
                imageAlt: `${pageTitle} - ${siteName}`,
                site: "@yourcompany",
                creator: "@yourcompany",

                // Additional Twitter fields
                app: {
                  name: siteName,
                  id: {
                    iphone: "your-app-id",
                    ipad: "your-app-id",
                    googleplay: "your-app-id",
                  },
                },
              },

              // Technical metadata
              technical: {
                template: "default",
                language: "en",
                favicon: "/favicon.ico",
                themeColor: "#0ea5e9",
                viewport: "width=device-width, initial-scale=1",
                charset: "utf-8",
                xUaCompatible: "IE=edge",

                // Performance hints
                dnsPrefetch: [
                  "https://fonts.googleapis.com",
                  "https://www.google-analytics.com",
                ],

                // Security headers
                contentSecurityPolicy: "default-src 'self'",
                referrerPolicy: "strict-origin-when-cross-origin",

                // PWA support
                manifest: "/manifest.json",
                appleTouchIcon: "/apple-touch-icon.png",
              },

              // Navigation
              navigation: {
                breadcrumbs: generateBreadcrumbs(cleanedSlug),
                sitemap: {
                  priority: 0.8, // 0.0 to 1.0
                  changeFrequency: "weekly", // always, hourly, daily, weekly, monthly, yearly, never
                  lastModified: new Date().toISOString(),
                },
                redirects: {
                  from: [],
                  type: "301",
                },
              },

              // Structured Data (JSON-LD) - can have multiple types
              structuredData: [
                {
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "@id": `${siteUrl}/${cleanedSlug}#webpage`,
                  name: pageTitle,
                  description: `Learn more about ${pageTitle.toLowerCase()} at ${siteName}.`,
                  url: `${siteUrl}/${cleanedSlug}`,
                  isPartOf: {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`,
                    name: siteName,
                    url: siteUrl,
                    potentialAction: {
                      "@type": "SearchAction",
                      target: `${siteUrl}/search?q={search_term_string}`,
                      "query-input": "required name=search_term_string",
                    },
                  },
                  publisher: {
                    "@type": "Organization",
                    "@id": `${siteUrl}#organization`,
                    name: siteName,
                    logo: {
                      "@type": "ImageObject",
                      url: "https://via.placeholder.com/600x60/0ea5e9/ffffff?text=Logo",
                      width: 600,
                      height: 60,
                    },
                    sameAs: [
                      "https://twitter.com/yourcompany",
                      "https://facebook.com/yourcompany",
                      "https://linkedin.com/company/yourcompany",
                    ],
                  },
                  breadcrumb: {
                    "@type": "BreadcrumbList",
                    "@id": `${siteUrl}/${cleanedSlug}#breadcrumb`,
                    itemListElement: generateBreadcrumbsStructured(cleanedSlug),
                  },
                  primaryImageOfPage: {
                    "@type": "ImageObject",
                    url: "https://via.placeholder.com/1200x630/0ea5e9/ffffff?text=Primary+Image",
                  },
                  datePublished: new Date().toISOString(),
                  dateModified: new Date().toISOString(),
                },
                // Can add more specific types based on content
                // e.g., FAQPage, HowTo, Article, Product, etc.
              ],

              // Analytics & tracking
              analytics: {
                gtmId: "GTM-XXXXX", // Google Tag Manager
                gaId: "UA-XXXXX-X", // Google Analytics
                fbPixel: "XXXXX", // Facebook Pixel
                customEvents: [], // Custom tracking events
              },
            },
          },
        }),
      }
    );
    if (response.ok) {
      console.log("Page created successfully!");
      setSuccess(true);
    } else {
      console.error("Failed to create page.");
    }
  };

  // Helper function to generate breadcrumbs
  const generateBreadcrumbs = (slug: string) => {
    const parts = slug.split("/");
    const breadcrumbs = [{ label: "Home", href: "/" }];

    let currentPath = "";
    parts.forEach((part, index) => {
      currentPath += (index === 0 ? "" : "/") + part;
      breadcrumbs.push({
        label: part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        href: `/${currentPath}`,
      });
    });

    return breadcrumbs;
  };

  // Helper function to generate structured breadcrumbs
  const generateBreadcrumbsStructured = (slug: string) => {
    const parts = slug.split("/");
    const items = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yoursite.com/",
      },
    ];

    let currentPath = "";
    parts.forEach((part, index) => {
      currentPath += (index === 0 ? "" : "/") + part;
      items.push({
        "@type": "ListItem",
        position: index + 2,
        name: part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        item: `https://yoursite.com/${currentPath}`,
      });
    });

    return items;
  };
  return (
    <div className="">
      {/* Tutorial Section */}
      <div className="mb-4 ">
        <h2 className="text-gray-800 mb-2 font-semibold">
          How to Name Your Page:
        </h2>

        <List size="sm" spacing="xs" className="mb-3">
          <List.Item
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <FaCheck size={12} />
              </ThemeIcon>
            }
          >
            <strong>
              Use only lowercase letters, numbers, and hyphens (-).
            </strong>
          </List.Item>
          <List.Item>
            <strong>Examples:</strong> about-us, services, contact-page.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <FaCheck size={12} />
              </ThemeIcon>
            }
          >
            <strong>
              Do not use spaces, special symbols, or capital letters.
            </strong>
          </List.Item>
          <List.Item>
            <strong>Wrong examples:</strong> About Us, contact_page, @home.
          </List.Item>
        </List>

        <Divider className="my-3" />

        <h2 className="text-gray-800 font-semibold mb-2">
          How Nested Pages Work:
        </h2>

        <List size="sm" spacing="xs">
          <List.Item>
            A nested page is a <strong>sub-page</strong> that belongs to another
            page.
          </List.Item>
          <List.Item>
            <strong>Example:</strong> If you create a &quot;team&quot; page, you
            might want to add a sub-page like &quot;team/john-doe&quot; to show
            details about a specific team member.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <FaCheck size={12} />
              </ThemeIcon>
            }
          >
            <strong>Correct nested page examples:</strong> services/web-design,
            blog/first-post, about-us/history.
          </List.Item>
          <List.Item>
            <strong>Wrong examples:</strong> services_web_design, blog first
            post.
          </List.Item>
          <List.Item>
            Separate sections with a <strong>forward slash (/)</strong>, and do
            not use spaces or underscores.
          </List.Item>
        </List>
      </div>

      {/* Input & Button Section */}
      <div className="flex items-center space-x-3">
        <Input
          type="text"
          placeholder="Enter page URL name (e.g., about-us or services/web-design)"
          value={slug}
          onChange={handleChange}
          className="flex-grow"
          size="md"
          error={error}
        />
        <Button
          onClick={addPage}
          variant="filled"
          color="blue"
          size="md"
          className="shrink-0"
          disabled={!slug || !!error}
        >
          Create Page
        </Button>
      </div>

      {error && (
        <Text color="red" size="sm" className="mt-2">
          {error}
        </Text>
      )}

      {/* Success Message and Navigate Button */}
      {success && (
        <Paper shadow="xs" p="md" className="mt-4 bg-green-50 rounded-lg">
          <Text size="sm" color="green" className="!mb-4">
            ✅ Page created successfully!
          </Text>
          <Button
            variant="outline"
            color="green"
            size="md"
            fullWidth
            rightSection={<FaArrowRight />}
            onClick={() => router.push(`/${slug}`)}
          >
            Navigate and Start Editing
          </Button>
        </Paper>
      )}
    </div>
  );
}

export default CreatePage;
