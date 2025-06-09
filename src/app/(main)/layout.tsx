import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';

import classNames from "classnames";

import { baseURL, meta, font, effects } from "@/resources/once-ui.config";
import { Meta, Schema,  Column, Flex, opacity, SpacingToken, Background} from "@once-ui-system/core";
import { Providers } from '../../components/Providers';

export async function generateMetadata() {
  return Meta.generate({
    title: meta.home.title,
    description: meta.home.description,
    baseURL: baseURL,
    path: meta.home.path,
    canonical: meta.home.canonical,
    image: meta.home.image,
    robots: meta.home.robots,
    alternates: meta.home.alternates,
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      fillWidth
      className={classNames(
        font.primary.variable,
        font.secondary.variable,
        font.tertiary.variable,
        font.code.variable,
      )}
    >
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={meta.home.title}
        description={meta.home.description}
        path={meta.home.path}
      />
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <It's not dynamic nor a security issue.>
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  
                  const defaultTheme = 'system';
                  root.setAttribute('data-neutral', 'gray');
                  root.setAttribute('data-brand', 'blue');
                  root.setAttribute('data-accent', 'indigo');
                  root.setAttribute('data-solid', 'contrast');
                  root.setAttribute('data-solid-style', 'flat');
                  root.setAttribute('data-border', 'playful');
                  root.setAttribute('data-surface', 'filled');
                  root.setAttribute('data-transition', 'all');
                  root.setAttribute('data-scaling', '100');
                  root.setAttribute('data-viz-style', 'categorical');
                  
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  const theme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(theme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  const styleKeys = ['neutral', 'brand', 'accent', 'solid', 'solid-style', 'viz-style', 'border', 'surface', 'transition', 'scaling'];
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <Column as="body" background="page" fillWidth margin="0" padding="0">
          <Background
            position="absolute"
            mask={{
              x: effects.mask.x,
              y: effects.mask.y,
              radius: effects.mask.radius,
              cursor: effects.mask.cursor,
            }}
            gradient={{
              display: effects.gradient.display,
              opacity: effects.gradient.opacity as opacity,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
            }}
            dots={{
              display: effects.dots.display,
              opacity: effects.dots.opacity as opacity,
              size: effects.dots.size as SpacingToken,
              color: effects.dots.color,
            }}
            grid={{
              display: effects.grid.display,
              opacity: effects.grid.opacity as opacity,
              color: effects.grid.color,
              width: effects.grid.width,
              height: effects.grid.height,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as opacity,
              size: effects.lines.size as SpacingToken,
              thickness: effects.lines.thickness,
              angle: effects.lines.angle,
              color: effects.lines.color,
            }}
          />
          {children}
        </Column>
      </Providers>
    </Flex>
  );
}
