"use client";

import {
	Background,
	Button,
	Column,
	Heading,
	RevealFx,
	Row,
	SmartImage,
	TiltFx,
	Text, Flex,
} from "@/once-ui/components";
import { TechCarousel } from "@/app/components/techcarousel/TechCarousel";
import ScrollDown from "@/app/components/scrolldown/ScrollDown";

const Hero = () => {
	const techStack= ["Java", "React", "Java", "Spring", "Hibernate", "Vue", "MySQL", "Docker", "Git", "Angular", "Javascript"]
	
	const content = {
		subtitle: "Ihre Vision, Unser Code.",
		experience: "7+ Jahre IT-Expertise",
		description: "Professionelle Softwareentwicklung und moderne Webösungen. Wir verwandeln komplexe Anforderungen in nahtlose digitale Erlebnisse.",
		buttons: {
			primary: "Projekt starten",
			secondary: "Referenzen ansehen"
		}
	};
	
	return (
		<Flex
			fillWidth
			padding="xl"
			center
			direction="row"
			tabletDirection="column"
			mobileDirection="column"
			style={{
				height: "100vh"
			}}
		>
			<Column
				fillWidth
				maxWidth={30}
				horizontal="start"
				center
				padding="s"
			>
				<RevealFx delay={0.2} translateY={5}>
					<Text variant="heading-strong-xl">
						Erfahrung seit 2017
					</Text>
				</RevealFx>
				
				<RevealFx delay={0.3} translateY={5}>
					<Heading
						as="h1"
						variant="display-default-l"
						size="xl"
					>
						JExcellence
					</Heading>
				</RevealFx>
				
				<RevealFx delay={0.4} translateY={5}>
					<Text as="span" variant="display-default-s">
						{content.subtitle}
					</Text>
				</RevealFx>
				
				<Row gap="m" paddingTop="l" mobileDirection="column">
					<RevealFx delay={0.5} translateY={5}>
						<Button
							variant="primary"
							size="l"
							suffixIcon="chevronRight"
						>
							{content.buttons.primary}
						</Button>
					</RevealFx>
					<RevealFx delay={0.6} translateY={5}>
						<Button
							variant="tertiary"
							size="l"
							color="dark"
						>
							{content.buttons.secondary}
						</Button>
					</RevealFx>
				</Row>
				
				<TechCarousel
					items={techStack}
					center
					margin="xs"
					gap="xs"
				/>
				<Column>
					<RevealFx delay={0.5} translateY={0}>
						<ScrollDown/>
					</RevealFx>
				</Column>
			</Column>
			
			<Column fillWidth>
				<Background fillWidth>
					<RevealFx aspectRatio="12 / 8" delay={0.8} translateY={20} fillWidth>
						<TiltFx fillWidth>
							<SmartImage
								zIndex={1}
								src="/images/lmbeauty/desktop_lmbeauty.svg"
								fill
								priority
								sizes="(max-width: 1024px) 80vw, 960px"
								radius="l"
							/>
						</TiltFx>
					</RevealFx>
				</Background>
			</Column>
		</Flex>
	);
};

export { Hero };