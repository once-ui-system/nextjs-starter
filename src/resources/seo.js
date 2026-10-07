// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://tools.prgsn.dev";

// metadata for pages
const meta = {
  home: {
    path: "/",
    title: "ProgressionTools • Creating useful development tools for Roblox creators",
    description:
      "We create useful development tools that Roblox creators can use for completely free to help productivity flourish.",
    image: "/images/og/home.jpg",
    canonical: "https://tools.prgsn.dev",
    robots: "index,follow",
    alternates: [{ href: "https://tools.prgsn.dev", hrefLang: "en" }],
  },
  // add more routes and reference them in page.tsx
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "Once UI",
  description: meta.home.description,
  email: "lorant@once-ui.com",
};

export { meta, schema, baseURL };