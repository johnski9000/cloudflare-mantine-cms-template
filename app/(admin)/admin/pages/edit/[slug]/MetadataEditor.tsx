import React, { useState, useEffect } from "react";
import {
  TextInput,
  Textarea,
  Select,
  Switch,
  Button,
  Tabs,
  Card,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  NumberInput,
  MultiSelect,
  Divider,
  Paper,
  Grid,
  Image,
  Alert,
  Collapse,
  ScrollArea,
  JsonInput,
  TagsInput,
  LoadingOverlay,
} from "@mantine/core";
import {
  FaSave,
  FaSearch,
  FaShareAlt,
  FaTwitter,
  FaCog,
  FaChartLine,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaGlobe,
  FaRobot,
  FaChevronDown,
  FaChevronUp,
  FaCode,
} from "react-icons/fa";
import { SavePage } from "@/app/utils/savePage";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/app/utils/notifications";

// Default metadata structure matching the page creation
const getDefaultMetadata = () => ({
  seo: {
    title: "",
    description: "",
    keywords: [],
    canonical: "",
    robots: "index, follow",
    author: "",
    alternates: {
      languages: {
        "en-US": "",
        "en-GB": "",
      },
      media: {
        mobile: "",
      },
    },
    googlebot:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    articleSection: "",
    articleTags: [],
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    verification: {
      google: "",
      bing: "",
      yandex: "",
    },
  },
  openGraph: {
    title: "",
    description: "",
    image: "",
    imageAlt: "",
    type: "website",
    url: "",
    siteName: "",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA"],
    determiner: "the",
    video: null,
    audio: null,
  },
  twitter: {
    card: "summary_large_image",
    title: "",
    description: "",
    image: "",
    imageAlt: "",
    site: "",
    creator: "",
    app: {
      name: "",
      id: {
        iphone: "",
        ipad: "",
        googleplay: "",
      },
    },
  },
  technical: {
    template: "default",
    language: "en",
    favicon: "/favicon.ico",
    themeColor: "#0ea5e9",
    viewport: "width=device-width, initial-scale=1",
    charset: "utf-8",
    xUaCompatible: "IE=edge",
    dnsPrefetch: [],
    contentSecurityPolicy: "default-src 'self'",
    referrerPolicy: "strict-origin-when-cross-origin",
    manifest: "/manifest.json",
    appleTouchIcon: "/apple-touch-icon.png",
  },
  navigation: {
    breadcrumbs: [],
    sitemap: {
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: new Date().toISOString(),
    },
    redirects: {
      from: [],
      type: "301",
    },
  },
  structuredData: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "",
      description: "",
      url: "",
    },
  ],
  analytics: {
    gtmId: "",
    gaId: "",
    fbPixel: "",
    customEvents: [],
  },
});
// Schema templates for different types
const schemaTemplates = {
  WebPage: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "",
    description: "",
    url: "",
    author: {
      "@type": "Organization",
      name: "",
    },
  },
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "",
    description: "",
    author: {
      "@type": "Person",
      name: "",
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "",
      logo: {
        "@type": "ImageObject",
        url: "",
      },
    },
  },
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "",
    description: "",
    image: "",
    brand: {
      "@type": "Brand",
      name: "",
    },
    offers: {
      "@type": "Offer",
      url: "",
      priceCurrency: "USD",
      price: "",
      availability: "https://schema.org/InStock",
    },
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [],
  },
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "",
    url: "",
    logo: "",
    sameAs: [],
  },
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "",
    },
    telephone: "",
    openingHours: "",
  },
};
export default function MetadataEditor({ pageData, updatePageContent }) {
  const [loading, setLoading] = useState(false);
  // Initialize with default metadata if not present
  const initializeMetadata = () => {
    if (pageData?.metaData) {
      // Deep merge to ensure all nested fields exist
      const defaultMeta = getDefaultMetadata();
      return {
        seo: {
          ...defaultMeta.seo,
          ...pageData.metaData.seo,
          alternates: {
            ...defaultMeta.seo.alternates,
            ...pageData.metaData.seo?.alternates,
            languages: {
              ...defaultMeta.seo.alternates.languages,
              ...pageData.metaData.seo?.alternates?.languages,
            },
            media: {
              ...defaultMeta.seo.alternates.media,
              ...pageData.metaData.seo?.alternates?.media,
            },
          },
          verification: {
            ...defaultMeta.seo.verification,
            ...pageData.metaData.seo?.verification,
          },
        },
        openGraph: { ...defaultMeta.openGraph, ...pageData.metaData.openGraph },
        twitter: {
          ...defaultMeta.twitter,
          ...pageData.metaData.twitter,
          app: {
            ...defaultMeta.twitter.app,
            ...pageData.metaData.twitter?.app,
            id: {
              ...defaultMeta.twitter.app.id,
              ...pageData.metaData.twitter?.app?.id,
            },
          },
        },
        technical: { ...defaultMeta.technical, ...pageData.metaData.technical },
        navigation: {
          ...defaultMeta.navigation,
          ...pageData.metaData.navigation,
          sitemap: {
            ...defaultMeta.navigation.sitemap,
            ...pageData.metaData.navigation?.sitemap,
          },
          redirects: {
            ...defaultMeta.navigation.redirects,
            ...pageData.metaData.navigation?.redirects,
          },
        },
        structuredData:
          pageData.metaData.structuredData || defaultMeta.structuredData,
        analytics: { ...defaultMeta.analytics, ...pageData.metaData.analytics },
      };
    }
    return getDefaultMetadata();
  };

  const [metaData, setMetaData] = useState(initializeMetadata());
  const [hasChanges, setHasChanges] = useState(false);

  const [expandedSections, setExpandedSections] = useState({});

  // Update local state when pageData changes
  useEffect(() => {
    setMetaData(initializeMetadata());
  }, [pageData]);

  // Handle nested object updates with safety checks
  const updateNestedField = (section, field, value) => {
    setMetaData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  // Handle deeply nested updates with safety checks
  const updateDeepNestedField = (section, subsection, field, value) => {
    setMetaData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [subsection]: {
          ...(prev[section]?.[subsection] || {}),
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  // Handle triple nested updates
  const updateTripleNestedField = (
    section,
    subsection,
    subsubsection,
    field,
    value
  ) => {
    setMetaData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [subsection]: {
          ...(prev[section]?.[subsection] || {}),
          [subsubsection]: {
            ...(prev[section]?.[subsection]?.[subsubsection] || {}),
            [field]: value,
          },
        },
      },
    }));
    setHasChanges(true);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      setLoading(true);
      console.log({ ...pageData, metaData });
      const res = await SavePage({ ...pageData, metaData });
      console.log("success?", res);
    } catch (error) {
      showErrorNotification("Error saving data!");
      setLoading(false);
    } finally {
      setLoading(false);
      showSuccessNotification("Succesfully saved data!");
    }
  };

  // Character count helper
  const getCharacterCount = (text, limit) => {
    const length = text?.length || 0;
    return (
      <Text
        size="xs"
        color={length > limit ? "red" : "dimmed"}
        className="text-right"
      >
        {length}/{limit}
      </Text>
    );
  };

  return (
    <div className="w-full">
      <LoadingOverlay visible={loading} />
      {/* Header */}
      <div className="mb-4">
        <Text weight={600} size="lg" className="mb-1">
          Metadata
        </Text>
        <Text size="xs" color="dimmed">
          SEO & Social settings
        </Text>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="mb-4">
          <Button
            fullWidth
            size="sm"
            leftSection={<FaSave size={12} />}
            onClick={handleSave}
            color="blue"
          >
            Save Changes
          </Button>
        </div>
      )}

      {/* Tabs - Horizontal Style */}
      <Tabs variant="pills" defaultValue="seo">
        <Tabs.List grow className="mb-3">
          <Tabs.Tab
            value="seo"
            leftSection={<FaSearch size={12} />}
            className="text-xs px-1"
          >
            SEO
          </Tabs.Tab>
          <Tabs.Tab
            value="social"
            leftSection={<FaShareAlt size={12} />}
            className="text-xs px-1"
          >
            Social
          </Tabs.Tab>
          <Tabs.Tab
            value="technical"
            leftSection={<FaCog size={12} />}
            className="text-xs px-1"
          >
            Tech
          </Tabs.Tab>
          <Tabs.Tab
            value="structured"
            leftSection={<FaCode size={12} />}
            className="text-xs px-1"
          >
            Schema
          </Tabs.Tab>
          <Tabs.Tab
            value="analytics"
            leftSection={<FaChartLine size={12} />}
            className="text-xs px-1"
          >
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* SEO Tab */}
        <Tabs.Panel value="seo" pt="xs">
          <Stack spacing="sm">
            {/* Basic SEO */}
            <Card padding="sm" radius="sm" withBorder>
              <Stack spacing="xs">
                <TextInput
                  label="Page Title"
                  size="xs"
                  placeholder="Page title..."
                  value={metaData.seo?.title || ""}
                  onChange={(e) =>
                    updateNestedField("seo", "title", e.target.value)
                  }
                />
                {getCharacterCount(metaData.seo?.title, 60)}

                <Textarea
                  label="Description"
                  size="xs"
                  placeholder="Page description..."
                  value={metaData.seo?.description || ""}
                  onChange={(e) =>
                    updateNestedField("seo", "description", e.target.value)
                  }
                  minRows={2}
                  maxRows={3}
                />
                {getCharacterCount(metaData.seo?.description, 160)}

                <TagsInput
                  label="Keywords"
                  size="xs"
                  placeholder="Add keywords"
                  data={[]}
                  value={metaData.seo?.keywords || []}
                  onChange={(value) =>
                    updateNestedField("seo", "keywords", value)
                  }
                />

                <Select
                  label="Robots"
                  size="xs"
                  data={[
                    { value: "index, follow", label: "Index & Follow" },
                    { value: "noindex, follow", label: "No Index" },
                    { value: "index, nofollow", label: "No Follow" },
                    { value: "noindex, nofollow", label: "None" },
                  ]}
                  value={metaData.seo?.robots || "index, follow"}
                  onChange={(value) =>
                    updateNestedField("seo", "robots", value)
                  }
                />
              </Stack>
            </Card>

            {/* Advanced SEO - Collapsible */}
            <Card padding="sm" radius="sm" withBorder>
              <Group
                position="apart"
                className="cursor-pointer"
                onClick={() => toggleSection("advancedSeo")}
              >
                <Text size="xs" weight={500}>
                  Advanced SEO
                </Text>
                <ActionIcon size="xs">
                  {expandedSections.advancedSeo ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </ActionIcon>
              </Group>

              <Collapse in={expandedSections.advancedSeo}>
                <Stack spacing="xs" className="mt-3">
                  <TextInput
                    label="Canonical URL"
                    size="xs"
                    placeholder="https://..."
                    value={metaData.seo?.canonical || ""}
                    onChange={(e) =>
                      updateNestedField("seo", "canonical", e.target.value)
                    }
                  />

                  <TextInput
                    label="Author"
                    size="xs"
                    placeholder="Company name"
                    value={metaData.seo?.author || ""}
                    onChange={(e) =>
                      updateNestedField("seo", "author", e.target.value)
                    }
                  />

                  <Textarea
                    label="Googlebot Directives"
                    size="xs"
                    placeholder="index, follow, max-image-preview:large..."
                    value={metaData.seo?.googlebot || ""}
                    onChange={(e) =>
                      updateNestedField("seo", "googlebot", e.target.value)
                    }
                    minRows={2}
                  />

                  <TextInput
                    label="Article Section"
                    size="xs"
                    placeholder="Section name"
                    value={metaData.seo?.articleSection || ""}
                    onChange={(e) =>
                      updateNestedField("seo", "articleSection", e.target.value)
                    }
                  />

                  <MultiSelect
                    label="Article Tags"
                    size="xs"
                    data={[]}
                    placeholder="Add tags"
                    searchable
                    creatable
                    clearable
                    value={metaData.seo?.articleTags || []}
                    onChange={(value) =>
                      updateNestedField("seo", "articleTags", value)
                    }
                    getCreateLabel={(query) => `+ Add "${query}"`}
                    maxDropdownHeight={120}
                  />

                  <Divider label="Verification Codes" labelPosition="center" />

                  <TextInput
                    label="Google Verification"
                    size="xs"
                    placeholder="Verification code"
                    value={metaData.seo?.verification?.google || ""}
                    onChange={(e) =>
                      updateDeepNestedField(
                        "seo",
                        "verification",
                        "google",
                        e.target.value
                      )
                    }
                  />

                  <TextInput
                    label="Bing Verification"
                    size="xs"
                    placeholder="Verification code"
                    value={metaData.seo?.verification?.bing || ""}
                    onChange={(e) =>
                      updateDeepNestedField(
                        "seo",
                        "verification",
                        "bing",
                        e.target.value
                      )
                    }
                  />

                  <TextInput
                    label="Yandex Verification"
                    size="xs"
                    placeholder="Verification code"
                    value={metaData.seo?.verification?.yandex || ""}
                    onChange={(e) =>
                      updateDeepNestedField(
                        "seo",
                        "verification",
                        "yandex",
                        e.target.value
                      )
                    }
                  />
                </Stack>
              </Collapse>
            </Card>

            {/* International SEO - Collapsible */}
            <Card padding="sm" radius="sm" withBorder>
              <Group
                position="apart"
                className="cursor-pointer"
                onClick={() => toggleSection("internationalSeo")}
              >
                <Text size="xs" weight={500}>
                  International SEO
                </Text>
                <ActionIcon size="xs">
                  {expandedSections.internationalSeo ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </ActionIcon>
              </Group>

              <Collapse in={expandedSections.internationalSeo}>
                <Stack spacing="xs" className="mt-3">
                  <TextInput
                    label="US Version URL"
                    size="xs"
                    placeholder="https://site.com/page"
                    value={metaData.seo?.alternates?.languages?.["en-US"] || ""}
                    onChange={(e) =>
                      updateTripleNestedField(
                        "seo",
                        "alternates",
                        "languages",
                        "en-US",
                        e.target.value
                      )
                    }
                  />

                  <TextInput
                    label="UK Version URL"
                    size="xs"
                    placeholder="https://site.com/gb/page"
                    value={metaData.seo?.alternates?.languages?.["en-GB"] || ""}
                    onChange={(e) =>
                      updateTripleNestedField(
                        "seo",
                        "alternates",
                        "languages",
                        "en-GB",
                        e.target.value
                      )
                    }
                  />

                  <TextInput
                    label="Mobile Version URL"
                    size="xs"
                    placeholder="https://m.site.com/page"
                    value={metaData.seo?.alternates?.media?.mobile || ""}
                    onChange={(e) =>
                      updateTripleNestedField(
                        "seo",
                        "alternates",
                        "media",
                        "mobile",
                        e.target.value
                      )
                    }
                  />
                </Stack>
              </Collapse>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Social Media Tab */}
        <Tabs.Panel value="social" pt="xs">
          <Stack spacing="sm">
            {/* Open Graph */}
            <Card padding="sm" radius="sm" withBorder>
              <Text size="xs" weight={500} mb="xs">
                Open Graph
              </Text>
              <Stack spacing="xs">
                <TextInput
                  label="OG Title"
                  size="xs"
                  placeholder="Social media title"
                  value={metaData.openGraph?.title || ""}
                  onChange={(e) =>
                    updateNestedField("openGraph", "title", e.target.value)
                  }
                />

                <Textarea
                  label="OG Description"
                  size="xs"
                  placeholder="Social media description"
                  value={metaData.openGraph?.description || ""}
                  onChange={(e) =>
                    updateNestedField(
                      "openGraph",
                      "description",
                      e.target.value
                    )
                  }
                  minRows={2}
                  maxRows={3}
                />

                <TextInput
                  label="OG Image"
                  size="xs"
                  placeholder="Image URL (1200x630)"
                  value={metaData.openGraph?.image || ""}
                  onChange={(e) =>
                    updateNestedField("openGraph", "image", e.target.value)
                  }
                />

                <TextInput
                  label="Image Alt Text"
                  size="xs"
                  placeholder="Describe the image"
                  value={metaData.openGraph?.imageAlt || ""}
                  onChange={(e) =>
                    updateNestedField("openGraph", "imageAlt", e.target.value)
                  }
                />

                {/* Image Preview */}
                {metaData.openGraph?.image && (
                  <div className="mt-2">
                    <Image
                      src={metaData.openGraph.image}
                      alt="OG Preview"
                      height={100}
                      radius="sm"
                      withPlaceholder
                    />
                  </div>
                )}

                <Select
                  label="OG Type"
                  size="xs"
                  data={[
                    { value: "website", label: "Website" },
                    { value: "article", label: "Article" },
                    { value: "product", label: "Product" },
                    { value: "video", label: "Video" },
                  ]}
                  value={metaData.openGraph?.type || "website"}
                  onChange={(value) =>
                    updateNestedField("openGraph", "type", value)
                  }
                />

                <TextInput
                  label="Site Name"
                  size="xs"
                  placeholder="Your Company"
                  value={metaData.openGraph?.siteName || ""}
                  onChange={(e) =>
                    updateNestedField("openGraph", "siteName", e.target.value)
                  }
                />

                <MultiSelect
                  label="Alternate Locales"
                  size="xs"
                  data={["en_GB", "en_CA", "es_ES", "fr_FR", "de_DE"]}
                  value={
                    metaData.openGraph?.alternateLocale || ["en_GB", "en_CA"]
                  }
                  onChange={(value) =>
                    updateNestedField("openGraph", "alternateLocale", value)
                  }
                />
              </Stack>
            </Card>

            {/* Twitter Card */}
            <Card padding="sm" radius="sm" withBorder>
              <Group spacing="xs" mb="xs">
                <FaTwitter size={12} className="text-blue-400" />
                <Text size="xs" weight={500}>
                  Twitter Card
                </Text>
              </Group>
              <Stack spacing="xs">
                <Select
                  label="Card Type"
                  size="xs"
                  data={[
                    { value: "summary", label: "Summary" },
                    { value: "summary_large_image", label: "Large Image" },
                    { value: "app", label: "App" },
                    { value: "player", label: "Player" },
                  ]}
                  value={metaData.twitter?.card || "summary_large_image"}
                  onChange={(value) =>
                    updateNestedField("twitter", "card", value)
                  }
                />

                <TextInput
                  label="Twitter Title"
                  size="xs"
                  placeholder="Title for Twitter"
                  value={metaData.twitter?.title || ""}
                  onChange={(e) =>
                    updateNestedField("twitter", "title", e.target.value)
                  }
                />

                <Textarea
                  label="Twitter Description"
                  size="xs"
                  placeholder="Description for Twitter"
                  value={metaData.twitter?.description || ""}
                  onChange={(e) =>
                    updateNestedField("twitter", "description", e.target.value)
                  }
                  minRows={2}
                />

                <TextInput
                  label="Twitter Image"
                  size="xs"
                  placeholder="Image URL (1200x600)"
                  value={metaData.twitter?.image || ""}
                  onChange={(e) =>
                    updateNestedField("twitter", "image", e.target.value)
                  }
                />

                <TextInput
                  label="Image Alt Text"
                  size="xs"
                  placeholder="Describe the image"
                  value={metaData.twitter?.imageAlt || ""}
                  onChange={(e) =>
                    updateNestedField("twitter", "imageAlt", e.target.value)
                  }
                />

                <TextInput
                  label="Site @"
                  size="xs"
                  placeholder="@company"
                  value={metaData.twitter?.site || ""}
                  onChange={(e) =>
                    updateNestedField("twitter", "site", e.target.value)
                  }
                />

                <TextInput
                  label="Creator @"
                  size="xs"
                  placeholder="@author"
                  value={metaData.twitter?.creator || ""}
                  onChange={(e) =>
                    updateNestedField("twitter", "creator", e.target.value)
                  }
                />

                {/* Twitter App - Collapsible */}
                <Divider label="App Settings" labelPosition="center" />

                <TextInput
                  label="App Name"
                  size="xs"
                  placeholder="App name"
                  value={metaData.twitter?.app?.name || ""}
                  onChange={(e) =>
                    updateDeepNestedField(
                      "twitter",
                      "app",
                      "name",
                      e.target.value
                    )
                  }
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Technical Tab */}
        <Tabs.Panel value="technical" pt="xs">
          <Stack spacing="sm">
            <Card padding="sm" radius="sm" withBorder>
              <Stack spacing="xs">
                <Select
                  label="Template"
                  size="xs"
                  data={[
                    { value: "default", label: "Default" },
                    { value: "landing", label: "Landing" },
                    { value: "blog", label: "Blog" },
                    { value: "product", label: "Product" },
                  ]}
                  value={metaData.technical?.template || "default"}
                  onChange={(value) =>
                    updateNestedField("technical", "template", value)
                  }
                />

                <Select
                  label="Language"
                  size="xs"
                  data={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "de", label: "German" },
                  ]}
                  value={metaData.technical?.language || "en"}
                  onChange={(value) =>
                    updateNestedField("technical", "language", value)
                  }
                />

                <TextInput
                  label="Theme Color"
                  size="xs"
                  placeholder="#0ea5e9"
                  value={metaData.technical?.themeColor || ""}
                  onChange={(e) =>
                    updateNestedField("technical", "themeColor", e.target.value)
                  }
                />

                <TextInput
                  label="Favicon"
                  size="xs"
                  placeholder="/favicon.ico"
                  value={metaData.technical?.favicon || ""}
                  onChange={(e) =>
                    updateNestedField("technical", "favicon", e.target.value)
                  }
                />

                <TagsInput
                  label="DNS Prefetch"
                  size="xs"
                  data={[]}
                  placeholder="Add domains to prefetch"
                  value={metaData.technical?.dnsPrefetch || []}
                  onChange={(value) =>
                    updateNestedField("technical", "dnsPrefetch", value)
                  }
                />

                <Textarea
                  label="CSP Header"
                  size="xs"
                  placeholder="default-src 'self'..."
                  value={metaData.technical?.contentSecurityPolicy || ""}
                  onChange={(e) =>
                    updateNestedField(
                      "technical",
                      "contentSecurityPolicy",
                      e.target.value
                    )
                  }
                  minRows={2}
                />

                <Select
                  label="Referrer Policy"
                  size="xs"
                  data={[
                    {
                      value: "strict-origin-when-cross-origin",
                      label: "Strict Origin",
                    },
                    { value: "no-referrer", label: "No Referrer" },
                    { value: "origin", label: "Origin Only" },
                    { value: "unsafe-url", label: "Unsafe URL" },
                  ]}
                  value={
                    metaData.technical?.referrerPolicy ||
                    "strict-origin-when-cross-origin"
                  }
                  onChange={(value) =>
                    updateNestedField("technical", "referrerPolicy", value)
                  }
                />
              </Stack>
            </Card>

            {/* Sitemap */}
            <Card padding="sm" radius="sm" withBorder>
              <Text size="xs" weight={500} mb="xs">
                Sitemap
              </Text>
              <Stack spacing="xs">
                <NumberInput
                  label="Priority"
                  size="xs"
                  placeholder="0.8"
                  min={0}
                  max={1}
                  step={0.1}
                  precision={1}
                  value={metaData.navigation?.sitemap?.priority || 0.8}
                  onChange={(value) =>
                    updateDeepNestedField(
                      "navigation",
                      "sitemap",
                      "priority",
                      value
                    )
                  }
                />

                <Select
                  label="Change Frequency"
                  size="xs"
                  data={[
                    { value: "always", label: "Always" },
                    { value: "hourly", label: "Hourly" },
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                    { value: "never", label: "Never" },
                  ]}
                  value={
                    metaData.navigation?.sitemap?.changeFrequency || "weekly"
                  }
                  onChange={(value) =>
                    updateDeepNestedField(
                      "navigation",
                      "sitemap",
                      "changeFrequency",
                      value
                    )
                  }
                />
              </Stack>
            </Card>

            {/* PWA */}
            <Card padding="sm" radius="sm" withBorder>
              <Text size="xs" weight={500} mb="xs">
                PWA Support
              </Text>
              <Stack spacing="xs">
                <TextInput
                  label="Manifest"
                  size="xs"
                  placeholder="/manifest.json"
                  value={metaData.technical?.manifest || ""}
                  onChange={(e) =>
                    updateNestedField("technical", "manifest", e.target.value)
                  }
                />

                <TextInput
                  label="Apple Touch Icon"
                  size="xs"
                  placeholder="/apple-touch-icon.png"
                  value={metaData.technical?.appleTouchIcon || ""}
                  onChange={(e) =>
                    updateNestedField(
                      "technical",
                      "appleTouchIcon",
                      e.target.value
                    )
                  }
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Structured Data Tab */}
        <Tabs.Panel value="structured" pt="xs">
          <Stack spacing="sm">
            <Alert icon={<FaInfoCircle />} size="xs">
              Structured data helps search engines understand your content. You
              can add multiple schemas.
            </Alert>

            {/* Add New Schema Button */}
            <Button
              size="xs"
              variant="light"
              leftIcon={<FaPlus size={12} />}
              onClick={() => {
                const newSchema = schemaTemplates.WebPage;
                setMetaData((prev) => ({
                  ...prev,
                  structuredData: [...(prev.structuredData || []), newSchema],
                }));
                setHasChanges(true);
              }}
            >
              Add Schema
            </Button>

            {/* Schema List */}
            {metaData.structuredData?.map((schema, index) => (
              <Card key={index} padding="sm" radius="sm" withBorder>
                <Stack spacing="xs">
                  <Group position="apart">
                    <Select
                      label={`Schema ${index + 1} Type`}
                      size="xs"
                      data={[
                        { value: "WebPage", label: "Web Page" },
                        { value: "Article", label: "Article" },
                        { value: "Product", label: "Product" },
                        { value: "FAQPage", label: "FAQ Page" },
                        { value: "Organization", label: "Organization" },
                        { value: "LocalBusiness", label: "Local Business" },
                      ]}
                      value={schema["@type"] || "WebPage"}
                      onChange={(value) => {
                        const newStructuredData = [...metaData.structuredData];
                        newStructuredData[index] = schemaTemplates[value];
                        setMetaData((prev) => ({
                          ...prev,
                          structuredData: newStructuredData,
                        }));
                        setHasChanges(true);
                      }}
                    />

                    {metaData.structuredData.length > 1 && (
                      <ActionIcon
                        size="sm"
                        color="red"
                        variant="subtle"
                        onClick={() => {
                          const newStructuredData =
                            metaData.structuredData.filter(
                              (_, i) => i !== index
                            );
                          setMetaData((prev) => ({
                            ...prev,
                            structuredData: newStructuredData,
                          }));
                          setHasChanges(true);
                        }}
                      >
                        <FaTrash size={12} />
                      </ActionIcon>
                    )}
                  </Group>

                  <JsonInput
                    label="Schema JSON-LD"
                    description="Edit structured data directly"
                    placeholder='{"@context": "https://schema.org"...}'
                    validationError="Invalid JSON"
                    formatOnBlur
                    autosize
                    minRows={6}
                    maxRows={15}
                    value={JSON.stringify(schema, null, 2)}
                    onChange={(value) => {
                      try {
                        const parsed = JSON.parse(value);
                        const newStructuredData = [...metaData.structuredData];
                        newStructuredData[index] = parsed;
                        setMetaData((prev) => ({
                          ...prev,
                          structuredData: newStructuredData,
                        }));
                        setHasChanges(true);
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                  />
                </Stack>
              </Card>
            ))}

            {/* Empty State */}
            {(!metaData.structuredData ||
              metaData.structuredData.length === 0) && (
              <Card padding="lg" radius="sm" withBorder>
                <Stack align="center" spacing="xs">
                  <FaCode size={24} className="text-gray-400" />
                  <Text size="sm" color="dimmed" align="center">
                    No structured data schemas added yet
                  </Text>
                  <Text size="xs" color="dimmed" align="center">
                    Add schemas to help search engines understand your content
                  </Text>
                </Stack>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics" pt="xs">
          <Stack spacing="sm">
            <Card padding="sm" radius="sm" withBorder>
              <Stack spacing="xs">
                <TextInput
                  label="GTM ID"
                  size="xs"
                  placeholder="GTM-XXXXX"
                  value={metaData.analytics?.gtmId || ""}
                  onChange={(e) =>
                    updateNestedField("analytics", "gtmId", e.target.value)
                  }
                />

                <TextInput
                  label="GA ID"
                  size="xs"
                  placeholder="G-XXXXXX or UA-XXXXX-X"
                  value={metaData.analytics?.gaId || ""}
                  onChange={(e) =>
                    updateNestedField("analytics", "gaId", e.target.value)
                  }
                />

                <TextInput
                  label="FB Pixel"
                  size="xs"
                  placeholder="XXXXXXXXXXXXXXX"
                  value={metaData.analytics?.fbPixel || ""}
                  onChange={(e) =>
                    updateNestedField("analytics", "fbPixel", e.target.value)
                  }
                />
              </Stack>
            </Card>

            <Card padding="sm" radius="sm" withBorder>
              <Text size="xs" weight={500} mb="xs">
                Custom Events
              </Text>
              <Text size="xs" color="dimmed">
                Custom event tracking can be configured in code
              </Text>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
