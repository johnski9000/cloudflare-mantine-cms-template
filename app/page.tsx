import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ComponentMap from "@/app/components/ComponentMaps/ComponentMap";
import { NavigationMap } from "./components/ComponentMaps/NavigationMap";
import { FooterMap } from "./components/ComponentMaps/FooterMap";

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

// Root page doesn't have dynamic params, so we can simplify the interface
interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to fetch metadata
async function fetchMetadata(): Promise<AllDataResponse | null> {
  try {
    if (!process.env.KV_WORKER_URL || !process.env.KV_WEBSITE_ID) {
      console.error(
        "Missing required environment variables: KV_WORKER_URL or KV_WEBSITE_ID"
      );
      return null;
    }

    const homePageKey = `${process.env.KV_WEBSITE_ID}:page:homepage`;

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
          pageSlug: homePageKey,
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

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const allData = await fetchMetadata();

  if (!allData?.page?.metaData) {
    // Fallback metadata based on your carousel content
    return {
      title:
        "Anslow Building Surveyors - Professional Property Surveys in Altrincham",
      description:
        "Independent family-run surveying practice based in Altrincham, Trafford. Comprehensive building survey services including RICS Level 1, 2 & 3 surveys, pre-completion inspections, and defects analysis.",
      keywords: [
        "building surveyors",
        "property surveys",
        "RICS surveys",
        "Altrincham",
        "Trafford",
        "North West",
        "structural surveys",
        "home buyers report",
        "building inspection",
      ],
      robots: "index, follow",
      authors: [{ name: "Anslow Building Surveyors" }],
      openGraph: {
        title: "Anslow Building Surveyors - Professional Property Surveys",
        description:
          "Independent family-run surveying practice providing comprehensive building survey services in the North-West UK.",
        type: "website",
        locale: "en_GB",
        siteName: "Anslow Building Surveyors",
      },
      twitter: {
        card: "summary_large_image",
        title: "Anslow Building Surveyors - Professional Property Surveys",
        description:
          "Independent family-run surveying practice providing comprehensive building survey services in the North-West UK.",
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
    title:
      seo?.title || "Anslow Building Surveyors - Professional Property Surveys",
    description:
      seo?.description ||
      "Independent family-run surveying practice providing comprehensive building survey services.",
    keywords: seo?.keywords || [],
    robots: seo?.robots || "index, follow",
    authors: seo?.author ? [{ name: seo.author }] : undefined,

    // Open Graph
    openGraph: {
      title: openGraph?.title || seo?.title || "Anslow Building Surveyors",
      description: openGraph?.description || seo?.description || "",
      type: (openGraph?.type as any) || "website",
      url: openGraph?.url || "",
      siteName: openGraph?.siteName || "Anslow Building Surveyors",
      locale: openGraph?.locale || "en_GB",
      alternateLocale: openGraph?.alternateLocale || ["en_US", "en_CA"],
      images: openGraph?.image
        ? [
            {
              url: openGraph.image,
              alt: openGraph.imageAlt || "Anslow Building Surveyors",
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
              alt: twitter.imageAlt || "Anslow Building Surveyors",
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
    classification: "Building Surveying Services",

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

    // Structured data will be handled separately in the component
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
async function fetchAllData(): Promise<AllDataResponse | null> {
  try {
    // Check if required environment variables exist
    if (!process.env.KV_WORKER_URL || !process.env.KV_WEBSITE_ID) {
      console.error(
        "Missing required environment variables: KV_WORKER_URL or KV_WEBSITE_ID"
      );
      return null;
    }

    // For root page, we use "home" as the page slug
    const homePageKey = `${process.env.KV_WEBSITE_ID}:page:homepage`;

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
          pageSlug: homePageKey,
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
    console.log("data", data);
    if (process.env.NODE_ENV === "development") {
      console.log("Fetched home page data:", data);
    }

    return data;
  } catch (error) {
    console.error("Error fetching home page data:", error);
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
export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <HomePageWithAllData searchParams={searchParams} />
    </Suspense>
  );
}

// Main component that fetches all data at once with CLS prevention
async function HomePageWithAllData({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Loading home page...");
    }

    const allData = await fetchAllData();

    if (!allData || !allData.page) {
      console.warn("Home page data not found");
      // For the home page, if we can't fetch data, we should show a proper error
      // rather than calling notFound() which is for 404s
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome</h1>
            <p className="text-gray-600 mb-4">
              We're having trouble loading the page content right now.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
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
        {NavComponent ? <NavComponent {...navProps} /> : <NavigationSkeleton />}

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
    console.error("Error rendering home page:", error);
    // Return a proper error component instead of calling notFound()
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We're having trouble loading the home page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="text-left bg-gray-100 p-4 rounded text-sm overflow-auto max-w-2xl">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
