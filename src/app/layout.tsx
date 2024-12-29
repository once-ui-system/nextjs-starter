import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";
import { headers } from "next/headers";
import { Metadata } from "next";

import {
  baseURL,
  style,
  meta,
  og,
  schema,
  social,
} from "@/once-ui/resources/config";

import { Background, Flex } from "@/once-ui/components";

import { Inter } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { ToastProvider } from "@/once-ui/components/ToastProvider";

const primary = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const code = Roboto_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

type FontConfig = {
  variable: string;
};

/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;
/*
 */

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const metadataBase = host ? new URL(`https://${host}`) : undefined;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: og.title,
      description: og.description,
      url: "https://" + baseURL,
      type: og.type as
        | "website"
        | "article"
        | "book"
        | "profile"
        | "music.song"
        | "music.album"
        | "music.playlist"
        | "music.radio_station"
        | "video.movie"
        | "video.episode"
        | "video.tv_show"
        | "video.other",
    },
    metadataBase,
  };
}

const schemaData = {
  "@context": "https://schema.org",
  "@type": schema.type,
  url: "https://" + baseURL,
  logo: schema.logo,
  name: schema.name,
  description: schema.description,
  email: schema.email,
  sameAs: Object.values(social).filter(Boolean),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      as="html"
      lang="en"
      fillHeight
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-border={style.border}
      data-theme={style.theme}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-surface={style.surface}
      data-transition={style.transition}
      data-scaling={style.scaling}
      className={classNames(
        primary.variable,
        code.variable,
        secondary ? secondary.variable : "",
        tertiary ? tertiary.variable : "",
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <ToastProvider>
        <Flex
          as="body"
          fillWidth
          direction="column"
          margin="0"
          padding="0">
          <Background
            position="absolute"
            mask={{
              x: 100,
              y: 0,
              radius: 100,
            }}
            gradient={{
              display: true,
              x: 100,
              y: 60,
              width: 70,
              height: 50,
              tilt: -40,
              opacity: 90,
              colorStart: "accent-background-strong",
              colorEnd: "page-background",
            }}
            grid={{
              display: true,
              opacity: 100,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          {children}
        </Flex>
      </ToastProvider>
    </Flex>
  );
}