const baseURL = "jexcellence.de";

const style = {
  theme: "dark",
  neutral: "gray",
  brand: "pink",
  accent: "pink",
  solid: "color",
  solidStyle: "flat",
  border: "playful",
  surface: "translucent",
  transition: "all",
  scaling: "90",
};

const effects = {
  mask: {
    cursor: true,
    x: 0,
    y: 0,
    radius: 75,
  },
  gradient: {
    display: true,
    x: 50,
    y: 0,
    width: 100,
    height: 100,
    tilt: 0,
    colorStart: "brand-background-strong",
    colorEnd: "static-transparent",
    opacity: 100,
  },
  dots: {
    display: false,
    size: 2,
    color: "brand-on-background-weak",
    opacity: 20,
  },
  lines: {
    display: false,
    color: "neutral-alpha-weak",
    opacity: 100,
  },
  grid: {
    display: false,
    color: "neutral-alpha-weak",
    opacity: 100,
  },
};

const meta = {
  icons: {
    icon: '/favicon.ico',
  },
  title: "LMBeauty | Professionelle Wimpern in Oldenburg",
  description: "Hi, ich bin Lisa – deine Make-up & Wimpernexpertin in Oldenburg. Mit Leidenschaft und Präzision hebe ich deine einzigartige Schönheit hervor. Ob natürlicher Alltagslook oder glamouröser Abendstil: Gemeinsam kreieren wir, was zu dir passt. Vertraue auf 𝗟𝗠 𝗕𝗲𝗮𝘂𝘁𝘆 – wo Professionalität und Herzblut dein Strahlen unterstreichen. 💫 Jetzt Termin sichern und dich verwandeln lassen!",
};

const og = {
  icons: {
    icon: '/favicon.ico',
  },
  title: "LMBeauty | Professionelle Wimpern in Oldenburg",
  description: "Hi, ich bin Lisa – deine Make-up & Wimpernexpertin in Oldenburg. Mit Leidenschaft und Präzision hebe ich deine einzigartige Schönheit hervor. Ob natürlicher Alltagslook oder glamouröser Abendstil: Gemeinsam kreieren wir, was zu dir passt. Vertraue auf 𝗟𝗠 𝗕𝗲𝗮𝘂𝘁𝘆 – wo Professionalität und Herzblut dein Strahlen unterstreichen. 💫 Jetzt Termin sichern und dich verwandeln lassen!.",
  type: "website",
  image: "https://jexcellence.de/images/avatar_1.png",
};

const schema = {
  logo: "https://jexcellence.de/images/avatar_1.png",
  type: "LocalBusiness",
  name: "LM Beauty",
  description: "Hi, ich bin Lisa – deine Make-up & Wimpernexpertin in Oldenburg. Mit Leidenschaft und Präzision hebe ich deine einzigartige Schönheit hervor. Ob natürlicher Alltagslook oder glamouröser Abendstil: Gemeinsam kreieren wir, was zu dir passt. Vertraue auf 𝗟𝗠 𝗕𝗲𝗮𝘂𝘁𝘆 – wo Professionalität und Herzblut dein Strahlen unterstreichen. 💫 Jetzt Termin sichern und dich verwandeln lassen!",
  email: "justin.eiletz@jexcellence.de",
};

const social = {
  instagram: "https://www.instagram.com/jexcellence_/",
};

export { baseURL, style, meta, og, schema, social, effects };
