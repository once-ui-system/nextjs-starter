"use client";

import React from 'react';

import { Heading, Text, Flex, Button, Grid, Icon } from '@/once-ui/components';
import Link from 'next/link';

export default function Home() {
	return (
		<Flex
			fillWidth
			flex={1}
			direction="column"
			alignItems="center"
			paddingTop="l"
			paddingX="l">
			<Flex
				style={{ overflow: 'hidden' }}
				fillWidth
				direction="column"
				alignItems="center"
				minHeight={1}
				flex={1}
				as="section"
				maxWidth={64}>
				<Flex
					style={{zIndex: '1'}}
					position="relative"
					background="surface"
					border="neutral-medium"
					borderStyle="solid-1"
					radius="l"
					paddingX="24"
					paddingY="16"
					marginBottom="xl">
					<Text
						onBackground="neutral-medium">
						Start by editing <span className="font-strong">app/page.tsx</span>
					</Text>
				</Flex>
				<Flex
					fillWidth
					fillHeight
					as="main"
					padding="l"
					direction="column"
					gap="l">
					<Flex
						fillWidth
						mobileDirection="column"
						gap="24">
						<Flex
							position="relative"
							fillWidth
							paddingY="xs"
							paddingX="xl">
							<Flex
								style={{ top: '15%', left: '50%', transform: 'translateX(-50%) translateY(-50%) rotate(30deg)', backgroundImage: 'radial-gradient(ellipse, var(--brand-background-strong) 0%, rgba(0,0,0,0) 75%' }}
								position="absolute"
								width={20}
								height={12}></Flex>
							<Flex
								style={{ top: '15%', left: '38%', transform: 'translateX(-50%) translateY(-50%) rotate(60deg)', backgroundImage: 'radial-gradient(ellipse, var(--brand-background-strong) 0%, rgba(0,0,0,0) 50%)' }}
								position="absolute"
								width={24}
								height={42}></Flex>
							<img
								style={{ height:'4rem', position:'relative' }}
								src="images/logo.svg" />
						</Flex>
						<Flex
							position="relative"
							fillWidth
							direction="column"
							gap="24">
							<Heading
								variant="display-strong-s"
								onBackground="neutral-strong">
								Comprehensive.<br/> Responsive.<br/>Accessible.
							</Heading>
							<Button
								style={{ marginBottom: 'var(--static-space-104)' }}
								suffixIcon="chevronRight"
								variant="secondary">
								Read docs
							</Button>
						</Flex>
					</Flex>
					<Grid
						style={{ border: '1px solid var(--neutral-border-medium)' }}
						columns="repeat(3, 1fr)"
						tabletColumns="1col"
						mobileColumns="1col"
						fillWidth>
						<Link
							style={{ padding: 'var(--responsive-space-l)' }}
							href="https://once-ui.com/docs/theming">
							<Flex
								fillWidth
								direction="column"
								paddingY="8"
								gap="8">
								<Flex
									fillWidth
									alignItems="center"
									gap="12">
									<Text
										onBackground="neutral-strong"
										variant="body-strong-m">
										Themes
									</Text>
									<Icon
										size="s"
										name="arrowUpRight"/>
								</Flex>
								<Text
									onBackground="neutral-weak"
									variant="body-default-s">
									Style your app in minutes.
								</Text>
							</Flex>
						</Link>
						<Link
							style={{ padding: 'var(--responsive-space-l)' }}
							href="https://once-ui.com/docs/layout">
							<Flex
								fillWidth
								direction="column"
								paddingY="8"
								gap="8">
								<Flex
									fillWidth
									alignItems="center"
									gap="12">
									<Text
										onBackground="neutral-strong"
										variant="body-strong-m">
										Layout
									</Text>
									<Icon
										size="s"
										name="arrowUpRight"/>
								</Flex>
								<Text
									onBackground="neutral-weak"
									variant="body-default-s">
									Build responsive layouts.
								</Text>
							</Flex>
						</Link>
						<Link
							style={{ padding: 'var(--responsive-space-l)' }}
							href="https://once-ui.com/docs/typography">
							<Flex
								fillWidth
								direction="column"
								paddingY="8"
								gap="8">
								<Flex
									fillWidth
									alignItems="center"
									gap="12">
									<Text
										onBackground="neutral-strong"
										variant="body-strong-m">
										Typography
									</Text>
									<Icon
										size="s"
										name="arrowUpRight"/>
								</Flex>
								<Text
									onBackground="neutral-weak"
									variant="body-default-s">
									Scale text automatically.
								</Text>
							</Flex>
						</Link>
					</Grid>
				</Flex>
			</Flex>
			<Flex
				fillWidth
				justifyContent="space-between"
				style={{ borderTop: '1px solid var(--neutral-border-medium)' }}
				as="footer"
				paddingX="l"
				paddingY="m">
				<Text
					onBackground="neutral-weak">
					© 2024 Once UI, MIT License
				</Text>
				<Flex
					gap="12">
					<Button
						href="https://github.com/once-ui-system/nextjs-starter"
						prefixIcon="github"
						size="s"
						variant="tertiary">
						GitHub
					</Button>
					<Button
						href="https://discord.com/invite/5EyAQ4eNdS"
						prefixIcon="discord"
						size="s"
						variant="tertiary">
						Discord
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}
