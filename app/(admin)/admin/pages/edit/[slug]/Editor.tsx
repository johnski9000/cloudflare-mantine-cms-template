"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createRoot, Root } from "react-dom/client";
import { useRouter } from "next/navigation";
import { AppShell, Box, Burger, MantineProvider } from "@mantine/core";
import { BasketProvider } from "@/app/context/BasketContext";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Paper,
  Drawer,
  Text,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
  LoadingOverlay,
} from "@mantine/core";
import { FiMonitor, FiTablet, FiSmartphone, FiRefreshCw } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import ComponentMap from "@/app/components/ComponentMaps/ComponentMap";
import { NavigationMap } from "@/app/components/ComponentMaps/NavigationMap";
import { FooterMap } from "@/app/components/ComponentMaps/FooterMap";
import { SidebarEditScreen } from "./SidebarEditScreen";
import "./module.editor.css";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { SavePage } from "@/app/utils/savePage";

interface ApiResponse {
  value: {
    compKey: string;
    props: any;
  };
}

interface EditorProps {
  slug: string;
  pageData: any;
  navigationData: ApiResponse;
  footerData: ApiResponse;
}

type ViewportSize = "mobile" | "tablet" | "desktop";

// Constants
const viewportSizes = {
  mobile: { width: "375px", height: "667px", icon: FiSmartphone },
  tablet: { width: "768px", height: "1024px", icon: FiTablet },
  desktop: { width: "100%", height: "100%", icon: FiMonitor },
} as const;

// IframeApp Component
const IframeApp = React.memo(
  ({
    navigationConfig,
    footerConfig,
    pageData,
    selectElement,
  }: {
    navigationConfig: any;
    footerConfig: any;
    pageData: any;
    selectElement: (data: any) => void;
  }) => {
    const handleElementClick = useCallback(
      (elementData: any) => {
        selectElement(elementData);
      },
      [selectElement]
    );

    const renderComponent = useCallback(
      (componentData: any, index: number) => {
        const ComponentEntry = ComponentMap[componentData.component];

        if (!ComponentEntry) {
          console.warn(
            `Component "${componentData.component}" not found in ComponentMap`
          );
          return (
            <div
              key={index}
              className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg"
            >
              <Text size="sm" fw={500}>
                Component Not Found
              </Text>
              <Text size="xs" c="dimmed">
                "{componentData.component}" is not available
              </Text>
            </div>
          );
        }

        const { component: Component } = ComponentEntry;
        const baseProps = ComponentEntry?.metadata?.props || {};
        const mergedProps = { ...baseProps, ...componentData.props };

        return (
          <div
            key={index}
            className="relative group transition-all hover:border-2 border-blue-500 duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-200 rounded-sm"
            onClick={() =>
              handleElementClick({
                component: componentData.component,
                compKey: componentData.component,
                props: mergedProps,
                index,
              })
            }
          >
            <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge size="xs" variant="filled" color="blue">
                {index + 1}
              </Badge>
            </div>
            <Component {...mergedProps} />
          </div>
        );
      },
      [handleElementClick]
    );

    return (
      <MantineProvider>
        <BasketProvider defaultCurrency="£">
          <div className="editor-viewport min-h-screen">
            {/* Navigation */}
            <div
              className="relative group transition-all hover:border-2 border-blue-500 duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-200 rounded-sm"
              onClick={() =>
                handleElementClick({
                  component: "navigation",
                  compKey: navigationConfig.compKey,
                  props: navigationConfig.props,
                })
              }
            >
              <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Badge size="xs" variant="filled" color="green">
                  Navigation
                </Badge>
              </div>
              <navigationConfig.component {...navigationConfig.props} />
            </div>

            {/* Page Components */}
            <div className="space-y-0">
              {pageData.components?.map(renderComponent)}
            </div>

            {/* Footer */}
            <div
              className="relative group transition-all hover:border-2 border-blue-500 duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-200 rounded-sm"
              onClick={() =>
                handleElementClick({
                  component: "footer",
                  compKey: footerConfig.compKey,
                  props: footerConfig.props,
                })
              }
            >
              <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Badge size="xs" variant="filled" color="orange">
                  Footer
                </Badge>
              </div>
              <footerConfig.component {...footerConfig.props} />
            </div>
          </div>
        </BasketProvider>
      </MantineProvider>
    );
  }
);

IframeApp.displayName = "IframeApp";

// Main Editor Component
function Editor({ slug, pageData, navigationData, footerData }: EditorProps) {
  const router = useRouter();
  const rootRef = useRef<Root | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [opened, { toggle }] = useDisclosure();
  // States
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState(pageData || null);
  const [navigationContent, setNavigationContent] = useState<any>(null);
  const [footerContent, setFooterContent] = useState<any>(null);

  console.log("navigation content", navigationData);
  console.log("footer content", footerData);
  // Process navigation config
  useEffect(() => {
    try {
      const NavComponent = NavigationMap[navigationData.compKey]?.component;
      if (!NavComponent) {
        throw new Error(
          `Navigation component "${navigationData.compKey}" not found`
        );
      }

      const defaultNavProps =
        NavigationMap[navigationData.compKey]?.metadata?.props || {};

      setNavigationContent({
        component: NavComponent,
        props: { ...defaultNavProps, ...navigationData.props },
        compKey: navigationData.compKey,
      });
    } catch (error) {
      console.error("Error creating navigation config:", error);
      setIframeError("Failed to load navigation component");
    }
  }, [navigationData]);

  // Process footer config
  useEffect(() => {
    try {
      const FooterComponent = FooterMap[footerData.compKey]?.component;
      if (!FooterComponent) {
        throw new Error(`Footer component "${footerData.compKey}" not found`);
      }

      const defaultFooterProps =
        FooterMap[footerData.compKey]?.metadata?.props || {};

      setFooterContent({
        component: FooterComponent,
        props: { ...defaultFooterProps, ...footerData.props },
        compKey: footerData.compKey,
      });
    } catch (error) {
      console.error("Error creating footer config:", error);
      setIframeError("Failed to load footer component");
    }
  }, [footerData]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "elementClick") {
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Initialize iframe root
  useEffect(() => {
    const initializeIframe = () => {
      if (!iframeRef.current?.contentDocument) return;

      const iframeDoc = iframeRef.current.contentDocument;
      const rootElement = iframeDoc.getElementById("root");

      if (rootElement && !rootRef.current) {
        try {
          rootRef.current = createRoot(rootElement);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to initialize iframe root:", error);
          setIframeError("Failed to initialize editor");
        }
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", initializeIframe);
      initializeIframe();
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", initializeIframe);
      }
      if (rootRef.current) {
        try {
          rootRef.current.unmount();
        } catch (error) {
          console.warn("Error unmounting iframe root:", error);
        }
        rootRef.current = null;
      }
    };
  }, []);

  // Render components into iframe
  useEffect(() => {
    if (!rootRef.current || !navigationContent || !footerContent) return;

    const selectElement = (data: any) => {
      window.parent.postMessage({ type: "elementClick", data }, "*");
    };

    try {
      rootRef.current.render(
        <IframeApp
          navigationConfig={navigationContent}
          footerConfig={footerContent}
          pageData={pageContent}
          selectElement={selectElement}
        />
      );
    } catch (error) {
      console.error("Failed to render iframe content:", error);
      setIframeError("Failed to render page content");
    }
  }, [navigationContent, footerContent, pageContent, viewport]);

  // Handlers
  const handleViewportChange = useCallback((newViewport: ViewportSize) => {
    setViewport(newViewport);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => {
      setIsLoading(false);
      notifications.show({
        title: "Editor Refreshed",
        message: "The editor has been refreshed successfully.",
        color: "green",
      });
    }, 500);
  }, [router]);

  // Update content handlers
  const updatePageContent = useCallback((newContent: any) => {
    setPageContent((prevContent) => ({
      ...prevContent,
      components: newContent,
    }));
  }, []);
  const metaDataUpdate = useCallback((newData: any) => {
    setPageContent(newData);
  }, []);

  const updateNavigationContent = useCallback((newContent: any) => {
    setNavigationContent(newContent);
  }, []);

  const updateFooterContent = useCallback((newContent: any) => {
    setFooterContent(newContent);
  }, []);

  // Generate iframe HTML content
  const iframeContent = useMemo(
    () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Editor Preview</title>
      
      <!-- Tailwind CSS - Latest -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <!-- Mantine Core & Dates - Updated to v8.0.1 -->
      <link rel="stylesheet" href="https://unpkg.com/@mantine/core@8.0.1/styles.css">
      <link rel="stylesheet" href="https://unpkg.com/@mantine/dates@8.0.1/styles.css">
      
      <!-- Additional Mantine packages -->
      <link rel="stylesheet" href="https://unpkg.com/@mantine/notifications@8.0.1/styles.css">
      <link rel="stylesheet" href="https://unpkg.com/@mantine/modals@8.1.0/styles.css">
      <link rel="stylesheet" href="https://unpkg.com/@mantine/carousel@8.1.0/styles.css">
      
      <!-- React - Updated to v19.1.0 (but using v18 for CDN compatibility) -->
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      
      <!-- Mantine Core Components -->
      <script src="https://unpkg.com/@mantine/core@8.0.1/index.umd.js"></script>
      
      <!-- Mantine Carousel Components -->
      <script src="https://unpkg.com/@mantine/carousel@8.1.0/index.umd.js"></script>
      
      <!-- Mantine Hooks -->
      <script src="https://unpkg.com/@mantine/hooks@8.0.1/index.umd.js"></script>
      
      <!-- Day.js for date handling -->
      <script src="https://unpkg.com/dayjs@1.11.7/dayjs.min.js"></script>
      
      <!-- UUID utility -->
      <script src="https://unpkg.com/uuid@11.1.0/dist/umd/uuid.min.js"></script>
      
      <!-- React Icons -->
      <script type="module">
        import * as ReactIcons from 'https://unpkg.com/react-icons@5.5.0/index.esm.js';
        window.ReactIcons = ReactIcons;
      </script>
      
      <!-- Tabler Icons -->
      <script type="module">
        import * as TablerIcons from 'https://unpkg.com/@tabler/icons-react@3.34.0/dist/index.esm.js';
        window.TablerIcons = TablerIcons;
      </script>
      
      <!-- Embla Carousel (required by Mantine Carousel) -->
      <script src="https://unpkg.com/embla-carousel@8.5.2/embla-carousel.umd.js"></script>
      <script src="https://unpkg.com/embla-carousel-react@8.5.2/embla-carousel-react.umd.js"></script>
      <script src="https://unpkg.com/embla-carousel-autoplay@8.6.0/embla-carousel-autoplay.umd.js"></script>
      

      <!-- Hello Pangea DnD -->
      <script src="https://unpkg.com/@hello-pangea/dnd@18.0.1/dist/index.umd.js"></script>
      
      <!-- React Markdown -->
      <script type="module">
        import ReactMarkdown from 'https://unpkg.com/react-markdown@10.1.0/index.js';
        window.ReactMarkdown = ReactMarkdown;
      </script>

      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #ffffff;
        }
        .editor-viewport { 
          min-height: 100vh;
          position: relative;
        }
        .hover-highlight {
          transition: all 0.3s ease;
        }
        .hover-highlight:hover {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .editor-viewport * {
          user-select: none;
        }
      </style>
    </head>
   <body>
      <div id="root" class="editor-viewport"></div>
      
      <!-- Load React first -->
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      
      <!-- Load dependencies in order -->
      <script src="https://unpkg.com/dayjs@1.11.7/dayjs.min.js"></script>
      
      <!-- Load Mantine after React -->
      <script src="https://unpkg.com/@mantine/core@7.12.2/index.umd.js"></script>
      <script src="https://unpkg.com/@mantine/hooks@7.12.2/index.umd.js"></script>
      
      <script>
        // Wait for all scripts to load before making them available
        window.addEventListener('load', function() {
          // Make React available globally
          if (typeof React !== 'undefined') {
            window.React = React;
            window.ReactDOM = ReactDOM;
          }
          
          // Make Mantine available globally with proper structure
          if (typeof MantineCore !== 'undefined') {
            window.Mantine = MantineCore;
            // Destructure common components for easier access
            const { 
              Button, 
              Text, 
              Group, 
              Stack, 
              Badge, 
              Paper,
              Box,
              MantineProvider 
            } = MantineCore;
            
            // Make individual components available globally
            window.Button = Button;
            window.Text = Text;
            window.Group = Group;
            window.Stack = Stack;
            window.Badge = Badge;
            window.Paper = Paper;
            window.Box = Box;
            window.MantineProvider = MantineProvider;
          }
          
          // Make hooks available
          if (typeof MantineHooks !== 'undefined') {
            Object.assign(window, MantineHooks);
          }
          
          // Signal that everything is ready
          window.mantineReady = true;
          window.dispatchEvent(new Event('mantineReady'));
        });
        
        // Tailwind config
        tailwind.config = {
          darkMode: 'class',
          content: ['*'],
        };
      </script>
    </body>
    </html>
  `,
    []
  );
  // Error state
  if (iframeError) {
    return (
      <div className="fixed insset-0 bg-gray-100 z-50 flex items-center justify-center">
        <Paper p="xl" shadow="md" className="text-center">
          <Text size="lg" fw={600} c="red" mb="md">
            Editor Error
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            {iframeError}
          </Text>
          <Button onClick={() => router.back()} variant="light">
            Go Back
          </Button>
        </Paper>
      </div>
    );
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      withBorder={false}
    >
      <LoadingOverlay visible={isLoading} />
      <AppShell.Header >
        <Paper
          shadow="md"
          className="bg-white border-b border-gray-200 p-4 !flex flex-col  z-[100]"
        >
          <Box className="flex justify-between w-full">
            <Group gap="md">
              <Button
                variant="light"
                leftSection={<IoMdArrowRoundBack size={16} />}
                onClick={() => {
                  window.location.href = `/admin/pages/`;
                }}
              >
                Back
              </Button>

              <div>
                <Text size="sm" fw={500}>
                  Editing Page
                </Text>
                <Text size="xs" c="dimmed">
                  {slug}
                </Text>
              </div>

            </Group>

            <div gap="xs" className="flex gap-4 !flex-row">
              <Button>Save</Button>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            </div>
          </Box>
        </Paper>
      </AppShell.Header>
      <AppShell.Navbar p="md" className="shadow-xl overflow-y-scroll">
        <SidebarEditScreen
          slug={slug}
          pageContent={pageContent}
          navigationContent={navigationContent}
          footerContent={footerContent}
          updatePageContent={updatePageContent}
          metaDataUpdate={metaDataUpdate}
          updateNavigationContent={updateNavigationContent}
          updateFooterContent={updateFooterContent}
          refreshSidebar={handleRefresh}
        />
      </AppShell.Navbar>
      <AppShell.Main className="flex flex-col gap-4 items-center">
        <Box className="sm:flex justify-center gap-2 w-full hidden ">
          {/* Viewport Controls */}
          {Object.entries(viewportSizes).map(([key, { icon: Icon }]) => (
            <Tooltip
              key={key}
              label={`${key.charAt(0).toUpperCase() + key.slice(1)} View`}
            >
              <Button
                variant={viewport === key ? "filled" : "light"}
                size="sm"
                onClick={() => handleViewportChange(key as ViewportSize)}
                leftSection={<Icon size={16} />}
              >
                {key === "desktop"
                  ? "Desktop"
                  : key === "tablet"
                  ? "Tablet"
                  : "Mobile"}
              </Button>
            </Tooltip>
          ))}
        </Box>
        <div
          className="bg-white flex-1 flex flex-col shadow-2xl rounded-xl overflow-hidden transition-all duration-300 ease-in-out relative border"
          style={{
            width: viewportSizes[viewport].width,
            height:
              viewport === "desktop" ? "100%" : viewportSizes[viewport].height,
            maxWidth: "100%",
            maxHeight: "100%",
            minHeight: viewport === "desktop" ? "auto" : "auto",
          }}
        >
          {/* Viewport indicator */}
          <div className="absolute top-2 left-2 z-10">
            <Badge size="xs" variant="filled" color="gray">
              {viewport}
            </Badge>
          </div>

          <iframe
            ref={iframeRef}
            srcDoc={iframeContent}
            className="flex-1"
            style={{
              width: "100%",
              height: "100% !important",
              border: "none",
              backgroundColor: "white",
            }}
            title="Page Editor Preview"
          />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default Editor;
