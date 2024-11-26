"use client";

import React from 'react';

import { Heading, Text, Flex, Button, Grid, Icon, InlineCode, Logo, LetterFx, Arrow } from '@/once-ui/components';
import Link from 'next/link';
import { Header } from '@/once-ui/modules/layout/Header';
import { FaLetterboxd } from 'react-icons/fa6';
import { Badge } from '@/once-ui/components/Badge';
export default function Home() {
	const links = [
		{
			href: "https://once-ui.com/docs/theming",
			title: "Themes",
			description: "Style your app in minutes.",
		},
		{
			href: "https://once-ui.com/docs/flexComponent",
			title: "Layout",
			description: "Build responsive layouts.",
		},
		{
			href: "https://once-ui.com/docs/typography",
			title: "Typography",
			description: "Scale text automatically.",
		},
	];

	return (
		<Flex
			fillWidth paddingTop="l" paddingX="l"
			direction="column" alignItems="center" flex={1}>

			<Flex
				position="relative"
				as="section" overflow="hidden"
				fillWidth minHeight="0" maxWidth={68}
				direction="column" alignItems="center" flex={1}>
				<Flex
					as="main"
					direction="column" justifyContent="center"
					fillWidth fillHeight padding="l" gap="l">
					<Flex
						mobileDirection="column"
						fillWidth gap="24">

						<Flex
							position="relative"
							flex={4} gap="24" marginBottom="104"
							direction="column">
							{/* <InlineCode
								className="shadow-m"
								style={{
									width: 'fit-content',
									padding: 'var(--static-space-8) var(--static-space-16)',
									backdropFilter: 'blur(var(--static-space-1))'
								}}>
								Start by editing <span className="brand-on-background-medium">app/page.tsx</span>
							</InlineCode> */}
							<Heading
								wrap="balance"
								variant="display-strong-s">
								<span className="font-code">
									<LetterFx
										trigger="instant"
									>
										New Portfolio in the works!
									</LetterFx>
								</span>
							</Heading>
							<Flex padding="16" gap="12" flex={1} justifyContent='center' direction="column" alignItems="center">

								<Link href="https://purohitamann.github.io/portfolio/">
									<Badge
										arrow
										effect
									>

										View Previous Version
									</Badge>
								</Link>


							</Flex>
							{/* <Button
								id="readDocs"
								href="https://once-ui.com/docs"
								variant="secondary">
								<Flex alignItems="center">
									Read docs
									<Arrow trigger="#readDocs" />
								</Flex>
							</Button> */}
						</Flex>
					</Flex>



				</Flex>
			</Flex>
			<Flex
				as="footer"
				position="relative"
				fillWidth paddingX="l" paddingY="m"
				justifyContent="space-between">
				<Text
					variant="body-default-s" onBackground="neutral-weak">
					© 2024 Aman Purohit  All Rights Reserved
				</Text>
				<Flex
					gap="12">
					<Button
						href="https://github.com/purohitamann"
						prefixIcon="github" size="s" variant="tertiary">
						GitHub
					</Button>
					<Button
						href="https://discord.com/users/purohitamann"
						prefixIcon="discord" size="s" variant="tertiary">
						Discord
					</Button>
				</Flex>
			</Flex>
		</Flex >
	);
}
