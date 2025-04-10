import { Row, RevealFx, Flex, Badge, BadgeProps } from "@/once-ui/components";
import styles from "./TechCarousel.module.scss";
import { IconName } from "@/once-ui/icons";
import React from "react";
import {SpacingToken} from "@/once-ui/types";

const defaultIconMap: Record<string, IconName> = {
	java: 'java',
	typescript: 'typescript',
	javascript: 'js',
	
	spring: 'spring',
	hibernate: 'hibernate',
	react: 'react',
	angular: 'angular',
	vue: 'vue',
	nodejs: 'node',
	
	postgresql: 'postgres',
	mysql: 'mysql',
	mongodb: 'mongo',
	
	docker: 'docker',
	kubernetes: 'kubernetes',
	aws: 'aws',
	gcp: 'gcp',
	git: 'git',
	
	graphql: 'graphql',
	redis: 'redis',
	nginx: 'nginx'
};

type TechItem = string | {
	name: string;
	icon?: IconName;
};

type TechCarouselProps = {
	items: TechItem[];
	textVariant?: BadgeProps["textVariant"];
	spacing?: SpacingToken | "-1" | undefined;
	iconMap?: Record<string, IconName>;
} & Partial<BadgeProps>;

const TechCarousel = ({
	                      items,
	                      textVariant = "body-default-s",
	                      spacing = "s",
	                      iconMap = {},
	                      ...badgeProps
                      }: TechCarouselProps) => {
	
	const mergedIconMap = { ...defaultIconMap, ...iconMap };
	
	const normalizedItems = items.map(item =>
		typeof item === 'string' ? { name: item } : item
	);
	
	return (
		<Row position="relative" overflow="hidden" fillWidth padding="l">
			<Flex gap={spacing} className={styles.marqueeContent}>
				{[...normalizedItems, ...normalizedItems].map((item, i) => {
					const iconName = item.icon || mergedIconMap[item.name.toLowerCase()];
					
					return (
						<RevealFx
							key={`${item.name}-${i}`}
							delay={0.7 + (i % items.length) * 0.1}
							translateY={5}
						>
							<Badge
								background="transparent"
								border="transparent"
								shadow="xs"
								textVariant={textVariant}
								icon={iconName}
								title={item.name}
								{...badgeProps}
							/>
						</RevealFx>
					);
				})}
			</Flex>
		</Row>
	);
};

export { TechCarousel, defaultIconMap };