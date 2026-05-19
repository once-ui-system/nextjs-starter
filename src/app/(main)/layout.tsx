import '@/resources/custom.css'

import type { Metadata } from 'next';
import localFont from 'next/font/local';

const plusJakarta = localFont({
  src: '../../../public/fonts/PlusJakartaSans-Regular.ttf',
  variable: '--font-plus-jakarta',
  display: 'swap',
});
import { baseURL, meta } from "@/resources/seo";
import { fonts, style, dataStyle } from "@/resources/once-ui.config";
import { Meta, Schema,  Column, Flex, Mask, MatrixFx, ThemeInit} from "@once-ui-system/core";
import { Providers } from '@/components/Providers';

const poppins = localFont({
  src: [
    {
      path: '../../../public/fonts/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Salaah Times in Botswana',
    description: "Get your daily prayer and jama'ah times for anywhere in Botswana.",
    metadataBase: new URL('https://once-ui.com'),
    alternates: {
      canonical: 'https://once-ui.com',
    },
    robots: 'index,follow',
    openGraph: {
      title: 'Salaah Times in Botswana',
      description: "Get your daily prayer and jama'ah times for anywhere in Botswana.",
      images: ['/images/og/home.jpg'],
      url: 'https://once-ui.com',
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${plusJakarta.variable} ${poppins.variable}`}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const savedTheme = localStorage.getItem('theme');
                  root.setAttribute('data-theme', savedTheme || 'dark');
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
