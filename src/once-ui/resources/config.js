const baseURL = "amanpurohit.com";

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "light", // dark | light
  neutral: "gray", // sand | gray | slate
  brand: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "indigo", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "contrast", // color | contrast
  solidStyle: "flat", // flat | plastic
  border: "playful", // rounded | playful | conservative
  surface: "translucent", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

// default metadata
const meta = {
  title: "Aman Purohit",
  description:
    "I am a full-stack developer with a passion for building beautiful and functional applications.",
};

// default open graph data
const og = {
  title: "Aman Purohit",
  description:
    "I am a full-stack developer with a passion for building beautiful and functional applications.",
  type: "website",
};

// default schema data
const schema = {
  logo: "Aman Purohit",
  type: "Organization",
  name: "Aman Purohit",
  description:
    "I am a full-stack developer with a passion for building beautiful and functional applications.",
  email: "purohitaman@icloud.com",
};

// social links
const social = {
  github: "https://github.com/purohitamann",
  twitter: "https://www.twitter.com/_onceui",
  linkedin: "https://www.linkedin.com/company/once-ui/",
  discord: "https://discord.com/invite/5EyAQ4eNdS",
};

export { baseURL, style, meta, og, schema, social };
