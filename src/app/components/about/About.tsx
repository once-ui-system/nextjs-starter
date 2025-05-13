"use client";

import {
	Avatar,
	Column,
	Flex,
	Heading,
	Text,
	Badge,
	Row,
	Background,
	RevealFx,
	Icon
} from "@/once-ui/components";
import React, { useEffect, useState, useRef } from "react";
import styles from "./About.module.scss";
import {StatsHighlight} from "@/app/components/statshighlight/StatsHighlight";

const techBadges = [
	{
		icon: "code",
		text: "Full-Stack Entwicklung",
		color: "brand-solid-medium"
	},
	{
		icon: "puzzle",
		text: "Individuelle Lösungen",
		color: "accent-solid-medium"
	},
	{
		icon: "shield",
		text: "Sichere Architekturen",
		color: "brand-solid-medium"
	},
	{
		icon: "database",
		text: "Datenbankdesign",
		color: "accent-solid-medium"
	},
	{
		icon: "mobile",
		text: "Responsive Webapps",
		color: "brand-solid-medium"
	},
	{
		icon: "rocket",
		text: "High-Performance Apps",
		color: "accent-solid-medium"
	},
	{
		icon: "game",
		text: "Spieleentwicklung",
		color: "brand-solid-medium"
	},
];

const statsData = [
	{
		value: "100%",
		label: "Individuelle Lösungen",
		icon: "fingerprint",
		description: "Jedes Projekt ist einzigartig"
	},
	{
		value: "24h",
		label: "Supportbereitschaft",
		icon: "headset",
		description: "Immer für Dich erreichbar"
	},
	{
		value: "2k+",
		label: "Code Commits",
		icon: "git-branch",
		description: "Kontinuierliche Verbesserung"
	},
	{
		value: "∞",
		label: "Kreativität",
		icon: "lightbulb",
		description: "Grenzenlose Ideen"
	},
	{
		value: "<1s",
		label: "Ladezeiten",
		icon: "zap",
		description: "Optimierte Performance"
	},
	{
		value: "5+",
		label: "Jahre Erfahrung",
		icon: "calendar",
		description: "Wachsende Expertise"
	},
];

export const About = () => {
	const [scrollY, setScrollY] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isAvatarHovered, setIsAvatarHovered] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};
		
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	
	return (
		<Column
			fillWidth
			horizontal="center"
			gap="xs"
			paddingY="xl"
		>
			<RevealFx
				translateY="s"
				delay={0.6}
				fillWidth
				horizontal="center"
			>
				<Column
					fillWidth
					horizontal="center"
				>
					<Column
						className={`${styles.avatarExpandContainer} ${isAvatarHovered ? styles.hovered : ''}`}
						onMouseEnter={() => setIsAvatarHovered(true)}
						onMouseLeave={() => setIsAvatarHovered(false)}
					>
						<Avatar
							src="/images/avatar/avatar_1.jpg"
							size="xl"
							radius="l-4"
							border="brand-alpha-strong"
							statusIndicator={{ color: "green" }}
						/>
					</Column>
				</Column>
			</RevealFx>
			
			<Column gap="m" fillWidth maxWidth={60}>
				<RevealFx translateY="m" delay={0.8} fillWidth horizontal="center">
					<Heading as="h2" variant="display-strong-m" align="center" className={styles.glitchText}>
						Digitale Lösungen mit Herz
					</Heading>
				</RevealFx>
				
				<RevealFx translateY="m" delay={1.0} fillWidth horizontal="center">
					<Text align="center" variant="body-default-l" onBackground="neutral-strong">
						Hey! Schön, dass Du hier bist.
						Ich bin Justin, 25, ein leidenschaftlicher Fullstack-Entwickler mit einem Auge fürs Detail.
						Wenn Du eine maßgeschneiderte Weblösung suchst, die sich von der Masse abhebt,
						bist Du bei mir genau richtig. Meine Spezialgebiete umfassen Java/Hibernate  für robuste
						Backend-Systeme sowie moderne Frontend-Frameworks wie Vue.js, React und Angular.
						Ich liebe es, diese Technologien zu kombinieren, um für Dich einzigartige digitale Erlebnisse zu schaffen.
						
						Was mich von anderen unterscheidet? Ich glaube nicht an Einheitslösungen wie WordPress-Templates.
						Stattdessen entwickle ich für Dich individuelle Webprojekte, die genau auf Deine Bedürfnisse und Ziele zugeschnitten sind.
						
						Neben Webentwicklung konzipiere ich auch Lizenzierungssysteme für Software und entwickle
						Minecraft-Plugins – immer mit dem Fokus auf Qualität, Performance und Benutzerfreundlichkeit.
						Dein Projekt verdient nichts weniger als Exzellenz.
						
						Lass uns gemeinsam Deine Vision zum Leben erwecken!
					</Text>
				</RevealFx>
				
				<RevealFx translateY="m" delay={1.2} fillWidth horizontal="center" paddingBottom="xl">
					<Row gap="m" direction="column" center>
							<Flex
								ref={scrollContainerRef}
								gap="s"
								padding="l"
								fillWidth
							>
								{[...techBadges, ...techBadges].map((badge, index) => (
									<Badge
										key={`badge-item-${index}`}
										background="accent-alpha-weak"
										textVariant="body-default-s"
										icon={badge.icon}
										effect={true}
										title={badge.text}
									/>
								))}
							</Flex>
					</Row>
				</RevealFx>
				
				<RevealFx translateY="m" delay={1.4} fillWidth zIndex={2}>
					<StatsHighlight/>
				</RevealFx>
			</Column>
		</Column>
	);
};