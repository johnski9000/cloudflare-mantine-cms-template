import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ComponentMap from "@/app/components/ComponentMaps/ComponentMap";
import { NavigationMap } from "../components/ComponentMaps/NavigationMap";
import { FooterMap } from "../components/ComponentMaps/FooterMap";

// Force dynamic rendering for CMS content
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ComponentData {
  component: keyof typeof ComponentMap;
  props: any;
  priority?: boolean;
}

interface AllDataResponse {
  page: {
    slug: string;
    components: ComponentData[];
    status: string;
    metaData: any;
  };
  navigation: {
    compKey: string;
    props: any;
  };
  footer: {
    compKey: string;
    props: any;
  };
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Helper function to build page slug for nested pages
function buildPageSlug(slugArray?: string[]): string {
  if (!slugArray || slugArray.length === 0) {
    return "home";
  }

  // Filter out static assets and API routes
  const staticAssetExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".css",
    ".js",
    ".json",
    ".xml",
    ".txt",
  ];
  const hasStaticExtension = slugArray.some((segment) =>
    staticAssetExtensions.some((ext) => segment.toLowerCase().endsWith(ext))
  );

  if (
    hasStaticExtension ||
    slugArray.some(
      (segment) => segment.includes("api") || segment.includes("%3A")
    )
  ) {
    console.error("Static asset or API route detected in slug:", slugArray);
    throw new Error("Static asset route"); // This will trigger 404
  }

  return slugArray.join("/");
}

// Function to fetch metadata for dynamic pages
async function fetchMetadataForSlug(
  slug?: string[]
): Promise<AllDataResponse | null> {
  try {
    if (!process.env.KV_WORKER_URL || !process.env.KV_WEBSITE_ID) {
      console.error(
        "Missing required environment variables: KV_WORKER_URL or KV_WEBSITE_ID"
      );
      return null;
    }

    const pageSlug = buildPageSlug(slug);
    const key = pageSlug.startsWith(process.env.KV_WEBSITE_ID + ":")
      ? pageSlug
      : `${process.env.KV_WEBSITE_ID}:page:${pageSlug}`;

    const response = await fetch(
      `${process.env.KV_WORKER_URL}/api/getAllData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          pageSlug: key,
          navigationSlug: `${process.env.KV_WEBSITE_ID}:navigation`,
          footerSlug: `${process.env.KV_WEBSITE_ID}:footer`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
}

// Generate metadata dynamically for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Early exit for static assets
  if (
    slug &&
    slug.some((segment) =>
      /\.(png|jpg|jpeg|gif|svg|ico|css|js|json|xml|txt)$/i.test(segment)
    )
  ) {
    return {};
  }

  const allData = await fetchMetadataForSlug(slug);
  const pageSlug = buildPageSlug(slug);

  if (!allData?.page?.metaData) {
    // Fallback metadata for pages without CMS data
    const fallbackTitle = slug
      ? `${slug.join(" - ")} | Your Site Name`
      : "Your Site Name";

    return {
      title: fallbackTitle,
      description: "Professional services and information",
      robots: "index, follow",
      openGraph: {
        title: fallbackTitle,
        description: "Professional services and information",
        type: "website",
        locale: "en_GB",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: "Professional services and information",
      },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#0ea5e9",
      manifest: "/manifest.json",
      icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
      },
    };
  }

  const { seo, openGraph, twitter, technical } = allData.page.metaData;

  // Build metadata from CMS data
  const metadata: Metadata = {
    title: seo?.title || `${pageSlug} | Your Site Name`,
    description: seo?.description || "",
    keywords: seo?.keywords || [],
    robots: seo?.robots || "index, follow",
    authors: seo?.author ? [{ name: seo.author }] : undefined,

    // Open Graph
    openGraph: {
      title: openGraph?.title || seo?.title || "",
      description: openGraph?.description || seo?.description || "",
      type: (openGraph?.type as any) || "website",
      url: openGraph?.url || "",
      siteName: openGraph?.siteName || "Your Site Name",
      locale: openGraph?.locale || "en_GB",
      alternateLocale: openGraph?.alternateLocale || ["en_US", "en_CA"],
      images: openGraph?.image
        ? [
            {
              url: openGraph.image,
              alt: openGraph.imageAlt || "",
            },
          ]
        : undefined,
      videos: openGraph?.video ? [openGraph.video] : undefined,
      audio: openGraph?.audio ? [openGraph.audio] : undefined,
    },

    // Twitter
    twitter: {
      card: (twitter?.card as any) || "summary_large_image",
      title: twitter?.title || seo?.title || "",
      description: twitter?.description || seo?.description || "",
      site: twitter?.site || "",
      creator: twitter?.creator || "",
      images: twitter?.image
        ? [
            {
              url: twitter.image,
              alt: twitter.imageAlt || "",
            },
          ]
        : undefined,
    },

    // Technical metadata
    viewport: technical?.viewport || "width=device-width, initial-scale=1",
    themeColor: technical?.themeColor || "#0ea5e9",
    manifest: technical?.manifest || "/manifest.json",

    // Icons
    icons: {
      icon: technical?.favicon || "/favicon.ico",
      apple: technical?.appleTouchIcon || "/apple-touch-icon.png",
    },

    // Additional metadata
    category: "Professional Services",

    // Verification
    verification: {
      google: seo?.verification?.google || undefined,
      other: {
        bing: [seo?.verification?.bing || ""],
        yandex: [seo?.verification?.yandex || ""],
      },
    },

    // Alternates for language/media
    alternates: {
      canonical: seo?.canonical || undefined,
      languages: seo?.alternates?.languages || undefined,
      media: seo?.alternates?.media || undefined,
    },
  };

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(metadata).filter(([_, value]) => value !== undefined)
  ) as Metadata;
}

// Enhanced skeleton loaders with exact dimensions to prevent CLS
const NavigationSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse border-b border-gray-200 w-full"
    style={{ height: "115px", minHeight: "115px" }}
  />
);

// Specific skeletons with exact dimensions for better CLS prevention
const HeroSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse w-full"
    style={{
      height: "100vh",
      minHeight: "700px",
      aspectRatio: "16/9",
    }}
  />
);

const HeroBannerSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse w-full"
    style={{
      height: "100vh",
      minHeight: "600px",
      aspectRatio: "16/9",
    }}
  />
);

const FullScreenBannerSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse w-full"
    style={{
      height: "100vh",
      minHeight: "500px",
      aspectRatio: "21/9",
    }}
  />
);

const HeaderSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse w-full"
    style={{
      height: "200px",
      minHeight: "150px",
    }}
  />
);

const HeroSectionSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse w-full"
    style={{
      height: "100vh",
      minHeight: "650px",
      aspectRatio: "16/9",
    }}
  />
);

const ComponentSkeleton = ({
  height = 200,
  componentName,
  aspectRatio,
}: {
  height?: number;
  componentName?: string;
  aspectRatio?: string;
}) => {
  switch (componentName) {
    case "Hero":
      return <HeroSkeleton />;
    case "HeroBanner":
      return <HeroBannerSkeleton />;
    case "HeroSection":
      return <HeroSectionSkeleton />;
    case "FullScreenBanner":
    case "Banner":
      return <FullScreenBannerSkeleton />;
    case "Header":
      return <HeaderSkeleton />;
    default:
      return (
        <div
          className="bg-gray-100 animate-pulse rounded-lg my-4 w-full"
          style={{
            minHeight: `${height}px`,
            height: `${height}px`,
            aspectRatio: aspectRatio || "auto",
          }}
        />
      );
  }
};

const FooterSkeleton = () => (
  <div
    className="bg-gray-100 animate-pulse mt-8 w-full"
    style={{
      height: "256px",
      minHeight: "200px",
    }}
  />
);

// Full page skeleton that shows immediately with exact dimensions
const FullPageSkeleton = () => (
  <div className="w-full">
    <div style={{ height: "115px", minHeight: "115px" }}>
      <NavigationSkeleton />
    </div>
    <main className="relative">
      <div style={{ height: "100vh", minHeight: "700px" }}>
        <HeroSkeleton />
      </div>
      <div style={{ height: "300px", minHeight: "300px" }}>
        <ComponentSkeleton height={300} />
      </div>
      <div style={{ height: "200px", minHeight: "200px" }}>
        <ComponentSkeleton height={200} />
      </div>
    </main>
    <div style={{ height: "256px", minHeight: "200px" }}>
      <FooterSkeleton />
    </div>
  </div>
);

// Add timeout to prevent slow API calls from blocking
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Single fetch for all data with improved error handling and fallback
async function fetchAllData(pageSlug: string): Promise<AllDataResponse | null> {
  try {
    // Check if required environment variables exist
    if (!process.env.KV_WORKER_URL || !process.env.KV_WEBSITE_ID) {
      console.error(
        "Missing required environment variables: KV_WORKER_URL or KV_WEBSITE_ID"
      );
      return null;
    }

    const key = pageSlug.startsWith(process.env.KV_WEBSITE_ID + ":")
      ? pageSlug
      : `${process.env.KV_WEBSITE_ID}:page:${pageSlug}`;

    const response = await fetchWithTimeout(
      `${process.env.KV_WORKER_URL}/api/getAllData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          pageSlug: key,
          navigationSlug: `${process.env.KV_WEBSITE_ID}:navigation`,
          footerSlug: `${process.env.KV_WEBSITE_ID}:footer`,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `API responded with status: ${response.status} ${response.statusText}`
      );
      // Try to get error details
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("Error details:", errorText);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data: AllDataResponse = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log("Fetched all data for slug:", pageSlug, data);
    }

    return data;
  } catch (error) {
    console.error("Error fetching all data:", error);
    // More detailed error logging
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(
        "Network error - check if KV_WORKER_URL is accessible:",
        process.env.KV_WORKER_URL
      );
    }
    return null;
  }
}

// Get expected height for component to prevent CLS
function getComponentHeight(componentName: keyof typeof ComponentMap): number {
  switch (componentName) {
    case "Hero":
    case "HeroBanner":
    case "HeroSection":
      return 700;
    case "FullScreenBanner":
    case "Banner":
      return 500;
    case "Header":
      return 200;
    case "Footer":
      return 256;
    default:
      return 200;
  }
}

// Check if component is full-screen/hero type
function isFullScreenComponent(
  componentName: keyof typeof ComponentMap
): boolean {
  return [
    "Hero",
    "HeroBanner",
    "HeroSection",
    "FullScreenBanner",
    "Banner",
  ].includes(componentName);
}

// Component renderer with improved error handling
const RenderComponent = ({
  componentName,
  props,
}: {
  componentName: keyof typeof ComponentMap;
  props: any;
}) => {
  const ComponentEntry = ComponentMap[componentName];

  if (!ComponentEntry) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Component "${componentName}" not found in ComponentMap`);
    }
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-4"
        style={{ minHeight: `${getComponentHeight(componentName)}px` }}
      >
        <p className="text-red-600">Component "{componentName}" not found</p>
      </div>
    );
  }

  const { component: Component } = ComponentEntry;
  return <Component {...props} />;
};

// JSON-LD Structured Data Component - uses CMS data
const StructuredData = ({ metaData }: { metaData: any }) => {
  // Use structured data from CMS if available
  if (!metaData?.structuredData || metaData.structuredData.length === 0) {
    return null;
  }

  return (
    <>
      {metaData.structuredData.map((data: any, index: number) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
    </>
  );
};

// RENDER IMMEDIATELY - Shows skeleton while data loads
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <PageWithAllData params={params} />
    </Suspense>
  );
}

// Main component that fetches all data at once with CLS prevention
async function PageWithAllData({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  try {
    const { slug } = await params;

    // Early exit for static assets
    if (
      slug &&
      slug.some((segment) =>
        /\.(png|jpg|jpeg|gif|svg|ico|css|js|json|xml|txt)$/i.test(segment)
      )
    ) {
      notFound();
      return null;
    }

    const pageSlug = buildPageSlug(slug);

    if (process.env.NODE_ENV === "development") {
      console.log("Raw slug array:", slug);
      console.log("Built page slug for getAllData:", pageSlug);
    }

    const allData = await fetchAllData(pageSlug);

    if (!allData || !allData.page) {
      console.warn(`Page data not found for slug: ${pageSlug}`);
      // Instead of throwing an error that causes the 404 fallback error,
      // gracefully handle the missing data
      notFound();
      return null; // This line won't execute but TypeScript needs it
    }

    const { page, navigation, footer } = allData;

    // Get navigation component
    const NavComponent = navigation?.compKey
      ? NavigationMap[navigation.compKey]?.component
      : null;
    const navProps = navigation?.compKey
      ? {
          ...NavigationMap[navigation.compKey]?.metadata?.props,
          ...navigation.props,
        }
      : {};

    // Get footer component
    const FooterComponent = footer?.compKey
      ? FooterMap[footer.compKey]?.component
      : null;
    const footerProps = footer?.compKey
      ? {
          ...FooterMap[footer.compKey]?.metadata?.props,
          ...footer.props,
        }
      : {};

    // Get first component (priority) and rest (lazy loaded)
    const firstComponent = page.components?.[0];
    const remainingComponents = page.components?.slice(1) || [];

    return (
      <div className="w-full">
        {/* Add structured data */}
        <StructuredData metaData={page.metaData} />

        {/* Navigation - Priority component with reserved space */}
        <div style={{ minHeight: "115px" }}>
          {NavComponent ? (
            <NavComponent {...navProps} />
          ) : (
            <NavigationSkeleton />
          )}
        </div>

        <main className="relative">
          {/* First component renders immediately for LCP with reserved space */}
          {firstComponent && (
            <div
              style={{
                minHeight: isFullScreenComponent(firstComponent.component)
                  ? "100vh"
                  : `${getComponentHeight(firstComponent.component)}px`,
              }}
            >
              <Suspense
                fallback={
                  <ComponentSkeleton
                    componentName={firstComponent.component}
                    height={getComponentHeight(firstComponent.component)}
                  />
                }
              >
                <RenderComponent
                  componentName={firstComponent.component}
                  props={firstComponent.props}
                />
              </Suspense>
            </div>
          )}

          {/* Remaining components are lazy loaded with proper spacing */}
          {remainingComponents.map(
            (componentData: ComponentData, index: number) => {
              const expectedHeight = getComponentHeight(
                componentData.component
              );
              return (
                <div
                  key={`lazy-${index}`}
                  style={{
                    minHeight: isFullScreenComponent(componentData.component)
                      ? "100vh"
                      : `${expectedHeight}px`,
                  }}
                >
                  <Suspense
                    fallback={
                      <ComponentSkeleton
                        componentName={componentData.component}
                        height={expectedHeight}
                      />
                    }
                  >
                    <RenderComponent
                      componentName={componentData.component}
                      props={componentData.props}
                    />
                  </Suspense>
                </div>
              );
            }
          )}
        </main>

        {/* Footer - Lazy loaded with reserved space */}
        <div style={{ minHeight: "256px" }}>
          <Suspense fallback={<FooterSkeleton />}>
            {FooterComponent ? (
              <FooterComponent {...footerProps} />
            ) : (
              <FooterSkeleton />
            )}
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering page:", error);
    // Instead of calling notFound() here which might cause the fallback error,
    // return a proper error component or gracefully handle the error
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We're having trouble loading this page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="text-left bg-gray-100 p-4 rounded text-sm overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
