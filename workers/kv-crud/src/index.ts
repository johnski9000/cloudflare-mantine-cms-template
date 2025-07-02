/**
 * Cloudflare Worker for managing page data in KV storage
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, method } = {
      pathname: url.pathname,
      method: request.method,
    };

    // List all pages with prefix "page:"
    if (pathname === "/api/pages/all") {
      return await listAllPages(request, env);
    }

    if (pathname.startsWith("/api/getAllData")) {
      return await getFullPageData(request, env);
    }

    // Handle individual page operations
    if (
      pathname.startsWith("/api/pages/") &&
      pathname !== "/api/pages/all" &&
      !pathname.startsWith("/api/pages/delete")
    ) {
      const slug = pathname.replace("/api/pages/", "");

      if (method === "GET") {
        return await getPage(request, env, slug);
      }

      if (method === "POST") {
        return await createOrUpdatePage(env, slug, request);
      }
    }

    // Handle page deletion
    if (pathname.startsWith("/api/pages/delete") && method === "POST") {
      const slug = pathname.replace("/api/pages/delete/", "");
      return await deletePage(request, env, slug);
    }

    // Handle navigation
    if (pathname.startsWith("/api/navigation")) {
      if (method === "POST") {
        return await createOrUpdateNavigation(env, request);
      } else if (method === "GET") {
        const slug = pathname.replace("/api/navigation/", "");
        return await getNavigation(request, env, slug);
      }
    }

    // Handle footer
    if (pathname.startsWith("/api/footer")) {
      if (method === "POST") {
        return await createOrUpdateFooter(env, request);
      } else if (method === "GET") {
        const slug = pathname.replace("/api/footer/", "");
        return await getFooter(request, env, slug);
      }
    }

    // Default response
    return new Response("Worker is running!", { status: 200 });
  },
};

/**
 * Helper function to ensure consistent key format
 */
function buildKey(websiteId, type, identifier = null) {
  const baseKey = websiteId + ":" + type;
  if (identifier) {
    // Check if identifier already has the websiteId prefix
    if (identifier.startsWith(websiteId + ":")) {
      return identifier;
    }
    return baseKey + ":" + identifier;
  }
  return baseKey;
}

/**
 * Create or update navigation
 */
async function createOrUpdateNavigation(env, request) {
  const body = await request.json();
  const { websiteId, pageData } = body;
  const key = buildKey(websiteId, "navigation");
  await env.IGNITE_CMS.put(key, JSON.stringify(pageData));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Create or update footer
 */
async function createOrUpdateFooter(env, request) {
  const body = await request.json();
  const { websiteId, pageData } = body;
  const key = buildKey(websiteId, "footer");
  await env.IGNITE_CMS.put(key, JSON.stringify(pageData));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Get navigation data
 */
async function getNavigation(request, env, slug) {
  // Handle case where slug might already include websiteId or just be the websiteId
  const key = slug.includes(":navigation") ? slug : slug + ":" + "navigation";
  const rawValue = await env.IGNITE_CMS.get(key);

  if (rawValue === null) {
    return new Response(JSON.stringify({ exists: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return new Response(
      JSON.stringify({
        exists: true,
        key: "navigation",
        value: parsedValue,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        exists: true,
        key: "navigation",
        value: rawValue,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Get footer data
 */
async function getFooter(request, env, slug) {
  // Handle case where slug might already include websiteId or just be the websiteId
  const key = slug.includes(":footer") ? slug : slug + ":" + "footer";
  const rawValue = await env.IGNITE_CMS.get(key);

  if (rawValue === null) {
    return new Response(JSON.stringify({ exists: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return new Response(
      JSON.stringify({
        exists: true,
        key: "footer",
        value: parsedValue,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        exists: true,
        key: "footer",
        value: rawValue,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * List all pages with the "page:" prefix
 */
async function listAllPages(request, env) {
  const body = await request.json();
  const { websiteId } = body;
  const prefix = buildKey(websiteId, "page", "");
  const keys = await env.IGNITE_CMS.list({ prefix });
  const values = await Promise.all(
    keys.keys.map(async (key) => ({
      key: key.name,
      value: await env.IGNITE_CMS.get(key.name),
    }))
  );

  return new Response(JSON.stringify(values), {
    headers: { "Content-Type": "application/json" },
  });
}

async function getFullPageData(request, env) {
  try {
    // Fetch all three items in parallel
    const body = await request.json();
    const { pageSlug, navigationSlug, footerSlug } = body;

    const [pageData, navigationData, footerData] = await Promise.all([
      env.IGNITE_CMS.get(pageSlug),
      env.IGNITE_CMS.get(navigationSlug),
      env.IGNITE_CMS.get(footerSlug),
    ]);

    // Check if page exists
    if (!pageData) {
      return new Response(JSON.stringify({ error: "Page not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse each piece of data
    const parseData = (data) => {
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch (e) {
        return { value: data };
      }
    };

    // Combine all data into single response
    const response = {
      page: parseData(pageData),
      navigation: parseData(navigationData),
      footer: parseData(footerData),
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching page data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
/**
 * Get a specific page by slug
 */
async function getPage(request, env, slug) {
  // slug might be just the page slug or the full key
  const data = await env.IGNITE_CMS.get(slug);
  if (!data) {
    return new Response(JSON.stringify({ error: "Page not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsedData = JSON.parse(data);
    return new Response(JSON.stringify(parsedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ value: data }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Create or update a page
 */
async function createOrUpdatePage(env, slug, request) {
  const body = await request.json();
  const { websiteId, pageData } = body;

  // Handle both cases: slug with or without websiteId prefix
  const key = slug.startsWith(websiteId + ":")
    ? slug
    : buildKey(websiteId, "page", slug);
  await env.IGNITE_CMS.put(key, JSON.stringify(pageData));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Delete a page
 */
async function deletePage(request, env, slug) {
  try {
    const body = await request.json();
    const { websiteId } = body;

    // Handle both cases: slug with or without websiteId prefix
    const key = slug.startsWith(websiteId + ":")
      ? slug
      : buildKey(websiteId, "page", slug);

    // Check if the key exists first
    const exists = await env.IGNITE_CMS.get(key);
    if (!exists) {
      return new Response(
        JSON.stringify({ success: false, error: "Page not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await env.IGNITE_CMS.delete(key);
    return new Response(
      JSON.stringify({ success: true, message: "Page deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
