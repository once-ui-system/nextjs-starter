"use client";

import {
    Card,
    Grid,
    Icon,
    Tag,
    RevealFx, Heading, Text, Column, Row, Flex
} from "@/once-ui/components";
import {useEffect, useRef, useState} from "react";
import styles from "./TechStack.module.scss";
import {ProgressRing} from "@/app/components/progressring/ProgressRing";

const TECH_STACK = [
    {
        name: "Java-Ökosystem",
        expertise: 97,
        years: 7,
        certs: ["Oracle Professional", "Spring Framework Specialist", "Paper/Bukkit Professional", "Hibernate Enthusiast"],
        description: "Meine Reise begann mit Minecraft-Plugin-Entwicklung - heute entwickle ich Enterprise-Lösungen mit Spring Boot & Hibernate. Präzise Code-Architekturen mit Fokus auf Performance und Wartbarkeit."
    },
    {
        name: "Fullstack Entwicklung",
        expertise: 92,
        years: 5,
        certs: ["React Newcomer", "Vue.js Newcomer", "Javascript Enthusiast", "REST Professional"],
        description: "Als Mitgründer realisierte ich moderne Web-Apps mit React/Vue.js Frontends und Spring-Backends. Mein Credo: Skalierbarkeit trifft auf ästhetisches Design."
    },
    {
        name: "Qualitätssicherung",
        expertise: 86,
        years: 3,
        certs: ["soon... ISTQB Certified Tester", "Selenium Specialist", "Ranorex Enthusiast"],
        description: "Bei ab-data treibe ich Testautomatisierung voran - von Unit Tests bis E2E mit Ranorex. Mein Anspruch: 100% Code Coverage bei kritischen Systemen."
    },
    {
        name: "DevOps Praxis",
        expertise: 82,
        years: 3,
        certs: ["Docker Newcomer", "Git Mastery"],
        description: "CI/CD-Pipelines mit Jenkins, Containerisierung komplexer Applikationen. Versionierung als Kunstform - jeder Commit erzählt eine Geschichte."
    },
    {
        name: "Datenbankdesign",
        expertise: 96,
        years: 7,
        certs: ["MySQL Professional", "Hibernate ORM", "Oracle", "Maria DB", "Mongo DB"],
        description: "Von einfachen Plugin-Datenbanken bis zu hochskalierbaren SQL-Architekturen. Datenmodellierung als Fundament stabiler Systeme."
    },
    {
        name: "Mensch & Technik",
        expertise: 100,
        years: 10,
        certs: ["Team Leadership", "Mentorship"],
        description: "Code schreibt man nicht allein - ich lebe Wissensaustausch und pair programming. Tech-Stacks müssen nicht nur funktionieren, sondern Teams begeistern."
    }
];

export const TechStack = () => {
    const techStackRef = useRef<HTMLDivElement>(null);
    const autoScrollEnabled = useRef(true);
    const isHovered = useRef(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const container = techStackRef.current;
        if (!container) return;

        let animationFrame: number;
        const startTime = Date.now();
        const baseDuration = 45000; // 45 seconds for full scroll

        const animateScroll = () => {
            if (!autoScrollEnabled.current) {
                animationFrame = requestAnimationFrame(animateScroll);
                return;
            }

            const elapsed = Date.now() - startTime;
            const speedFactor = isHovered.current ? 0.6 : 1; // 40% slower on hover
            const adjustedElapsed = elapsed * speedFactor;

            const progress = (adjustedElapsed % baseDuration) / baseDuration;
            const easeProgress = 0.5 * (1 - Math.cos(2 * Math.PI * progress));

            const maxScroll = container.scrollHeight - container.clientHeight;
            container.scrollTop = easeProgress * maxScroll;

            animationFrame = requestAnimationFrame(animateScroll);
        };

        // Prevent manual scrolling
        const handleWheel = (e: WheelEvent) => e.preventDefault();
        const handleTouchMove = (e: TouchEvent) => e.preventDefault();
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });

        animationFrame = requestAnimationFrame(animateScroll);

        return () => {
            cancelAnimationFrame(animationFrame);
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <Column center fill padding="xs" gap="xl">
            <Column center gap="s">
                <Flex gap="s" horizontal="center" vertical="center">
                    <Icon name="toolbox" size="xl" />
                    <Heading as="h1">
                        Meine Technologie-Expertise
                    </Heading>
                    <Icon name="codeBracket" size="xl" />
                </Flex>
                <Text variant="body-strong-m" align="center">
                    6 Kernkompetenzen · {TECH_STACK.reduce((sum, t) => sum + t.years, 0)}+ Jahre Erfahrung
                </Text>
            </Column>

            <Column
                ref={techStackRef}
                className={styles.techStackContainer}
                style={{ height: isMobile ? '70vh' : '60vh' }}
                onMouseEnter={() => isHovered.current = true}
                onMouseLeave={() => isHovered.current = false}
            >
                <Grid columns={2} tabletColumns={1} gap="m" fill>
                    {TECH_STACK.map((tech, index) => (
                        <RevealFx key={tech.name} delay={index * 0.15} fillWidth>
                            <Card radius="l" className={styles.skillCard}>
                                <Column padding="m" gap="m">
                                    <Flex gap="s" align="center">
                                        <div className={styles.indexBadge}>
                                            {index + 1}
                                        </div>
                                        <Heading as="h2">
                                            {tech.name}
                                        </Heading>
                                    </Flex>

                                    <Flex gap="l" align="start">
                                        <Column center flex={0}>
                                            <ProgressRing
                                                value={tech.expertise}
                                                label={`${tech.expertise}%`}
                                                size="m"
                                            />
                                            <Row gap="xs" center marginTop="m">
                                                <Icon name="calendar" size="xs" />
                                                <Text variant="body-strong-s">
                                                    {tech.years} Jahre
                                                </Text>
                                            </Row>
                                        </Column>

                                        <Column gap="s">
                                            <Flex wrap gap="xs">
                                                {tech.certs.map((cert) => (
                                                    <Tag
                                                        key={cert}
                                                        className={styles.skillTag}
                                                    >
                                                        {cert}
                                                    </Tag>
                                                ))}
                                            </Flex>
                                            <Text variant="body-default-s">
                                                {tech.description}
                                            </Text>
                                        </Column>
                                    </Flex>

                                    {tech.expertise >= 90 && (
                                        <Flex gap="xs" horizontal="end" className={styles.expertBadge}>
                                            <Icon name="star" size="s" />
                                            <Text variant="body-strong-s">
                                                Höchste Expertise
                                            </Text>
                                        </Flex>
                                    )}
                                </Column>
                            </Card>
                        </RevealFx>
                    ))}
                </Grid>
            </Column>
        </Column>
    );
};