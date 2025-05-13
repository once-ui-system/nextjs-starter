"use client";

import {
	Column,
	Row,
	Icon,
	Text,
	Line,
	RevealFx, Heading
} from "@/once-ui/components";

type TimelineItem = {
	year: string;
	title: string;
	icon?: string;
};

type TimelineProps = {
	items: TimelineItem[];
	variant?: "vertical" | "horizontal";
	iconSize?: "s" | "m" | "l";
	className?: string;
};

const Timeline = ({
	                  items,
	                  variant = "vertical",
	                  iconSize = "m",
	                  className = ""
                  }: TimelineProps) => {
	return variant === "vertical" ? (
		<Column gap="xl" className={`timeline-vertical ${className}`}>
			{items.map((item, index) => (
				<RevealFx key={index} delay={index * 0.1}>
					<div className="timeline-item">
						<div className="timeline-marker">
							<Icon
								name={item.icon || "sparkle"}
								size={iconSize}
								color="brand-weak"
							/>
							{index < items.length - 1 && (
								<Line
									textVariant="display-strong-s"
									className="timeline-line"
								/>
							)}
						</div>
						<div className="timeline-content">
							<Text variant="label-strong-m" color="neutral-weak">
								{item.year}
							</Text>
							<Heading variant="heading-strong-m">{item.title}</Heading>
						</div>
					</div>
				</RevealFx>
			))}
		</Column>
	) : (
		<Row gap="xl" className={`timeline-horizontal ${className}`}>
			{items.map((item, index) => (
				<RevealFx key={index} delay={index * 0.1}>
					<div className="timeline-item">
						<div className="timeline-marker">
							<Icon
								name={item.icon || "sparkle"}
								size={iconSize}
								color="brand-weak"
							/>
						</div>
						<div className="timeline-content">
							<Text variant="label-strong-s" color="neutral-weak">
								{item.year}
							</Text>
							<Text variant="body-strong-m">{item.title}</Text>
						</div>
						{index < items.length - 1 && (
							<Line textVariant="display-strong-s" className="timeline-connector" />
						)}
					</div>
				</RevealFx>
			))}
		</Row>
	);
};

export { Timeline };