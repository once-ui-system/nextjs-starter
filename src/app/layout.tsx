import { Flex, Text } from '@/once-ui/components'
import { Inter } from 'next/font/google'

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
})

import "@/once-ui/tokens/scheme.css";
import "@/once-ui/tokens/theme.css";
import "@/once-ui/tokens/layout.css";
import "@/once-ui/tokens/border.css";
import "@/once-ui/tokens/elevation.css";
import "@/once-ui/tokens/typography.css";

import "@/once-ui/styles/spacing.css";
import "@/once-ui/styles/border.css";
import "@/once-ui/styles/color.css";
import "@/once-ui/styles/background.css";
import "@/once-ui/styles/typography.scss";
import "@/once-ui/styles/global.scss";
import "@/once-ui/styles/layout.css";

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<html
			style={{ height: '100%', background: 'var(--page-background)' }}
			data-border="playful"
			data-theme="dark"
			data-neutral="gray"
			data-brand="cyan"
			data-accent="violet"
			lang="en"
			className={`${inter.variable}`}>
			<body
				style={{ display: 'flex', height: '100%', width: '100%', margin: "0", padding: "0" }}>
				<Flex
					flex={1}
					direction="column">
					{children}
				</Flex>
			</body>
		</html>
	);
}