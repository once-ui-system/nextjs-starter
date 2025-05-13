"use client";

import React from "react";
import { Column, Heading, Icon, Row, Text, SmartImage } from "@/once-ui/components";

const features = [
	{
		title: "AI-Powered Development",
		description:
			"Harness the power of artificial intelligence to accelerate your development workflow with smart code suggestions and automated refactoring.",
		icon: "refresh",
		image: "/images/backgrounds/1.jpg",
	},
	{
		title: "Real-time Collaboration",
		description:
			"Work together seamlessly with your team through real-time editing, commenting, and version control integration.",
		icon: "refresh",
		accent: "success",
		image: "/images/backgrounds/2.jpg",
	},
	{
		title: "Advanced Analytics",
		description:
			"Gain deep insights into your application's performance with comprehensive analytics and monitoring tools.",
		icon: "refresh",
		accent: "warning",
		image: "/images/backgrounds/3.jpg",
	},
	{
		title: "Security First",
		description:
			"Built-in security features including encryption, authentication, and vulnerability scanning to keep your data safe.",
		icon: "refresh",
		accent: "error",
		image: "/images/backgrounds/4.jpg",
	},
];

export const StatsHighlight = () => {
	return (
		<Column fillWidth horizontal="center" gap="xl">
			<Column horizontal="center" gap="s" maxWidth="m">
				<Heading variant="display-strong-s" align="center">
					Next-Gen Features
				</Heading>
				<Text variant="body-default-xl" align="center" onBackground="neutral-medium" wrap="balance">
					Empowering developers with cutting-edge tools and capabilities
				</Text>
			</Column>
			
			<Column gap="xl" maxWidth="l">
				{features.map((feature, index) => (
					<Row
						key={index}
						gap="xl"
						direction={index % 2 === 0 ? "row" : "row-reverse"}
						vertical="center"
						tabletDirection="column"
					>
						<Column
							fillWidth
							position="sticky"
							top="0"
							paddingY="24"
							gap="m"
							tabletDirection="column"
						>
							<Icon padding="8" name={feature.icon} onBackground="brand-weak" />
							<Heading size="l">{feature.title}</Heading>
							<Text onBackground="neutral-medium" variant="body-default-m" wrap="balance">
								{feature.description}
							</Text>
						</Column>
						<SmartImage
							src={feature.image}
							alt={"Image for " + feature.title}
							sizes={"(max-width: 1024px) 90vw, 640px"}
							radius="l"
							aspectRatio="4 / 3"
						/>
					</Row>
				))}
			</Column>
		</Column>
	);
};
