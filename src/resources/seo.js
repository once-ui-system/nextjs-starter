// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://demo.once-ui.com";

// metadata for pages
const meta = {
  home: {
    path: "/",
    title: "Once UI for Next.js",
    description:
      "An open-source design system and component library for Next.js that emphasizes easy styling and accessibility in UI development.",
    image: "/images/og/home.jpg",
    canonical: "https://once-ui.com",
    robots: "index,follow",
    alternates: [{ href: "https://once-ui.com", hrefLang: "en" }],
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