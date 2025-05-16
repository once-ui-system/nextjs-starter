"use client";
import React, { useState } from "react";
import {
    Background,
    Button,
    Card,
    Column,
    Flex,
    Grid,
    Heading,
    Icon, Line,
    Row, Scroller,
    SegmentedControl,
    Text,
    Tooltip
} from "@/once-ui/components";
import {Slider} from "@/app/components/slider/Slider";
import {FlipCard} from "@/app/components/flipcard/FlipCard";

const PricingSection = () => {
    const [activeFilter, setActiveFilter] = useState("webdesign");
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const filters = [
        { id: "all", label: "Alle Pakete" },
        { id: "webdesign", label: "Webdesign" },
        { id: "wartung", label: "Wartung" },
        { id: "extras", label: "Extras" },
        { id: "minecraft", label: "Minecraft Plugins" },
    ];

    const products = [
        {
            id: 1,
            category: "webdesign",
            title: "Starter-Paket",
            price: "300,00 €",
            description: "Der perfekte Einstieg in die digitale Welt",
            features: [
                { title: "Professionelle One-Page", desc: "Responsive Design für alle Geräte" },
                { title: "Modernes Basisdesign", desc: "Ansprechendes Layout & Branding" },
                { title: "Rechtssicherheit", desc: "DSGVO-konforme Texte inklusive" },
            ],
            popular: false,
        },
        {
            id: 2,
            category: "webdesign",
            title: "Business-Paket",
            price: "800,00 €",
            description: "Professionelle Unternehmenspräsenz",
            features: [
                { title: "Bis zu 5 Seiten", desc: "Umfassende Inhaltsdarstellung" },
                { title: "Premium-Design", desc: "Individuelle Branding-Anpassungen" },
                { title: "SEO-Optimierung", desc: "Suchmaschinenoptimierte Struktur" },
                { title: "Kontaktformular", desc: "Mit Spam-Schutz" },
            ],
            popular: true,
        },
        {
            id: 3,
            category: "webdesign",
            title: "Enterprise-Paket",
            price: "1.500,00 €",
            description: "Komplettlösung für komplexe Anforderungen",
            features: [
                { title: "Unbegrenzte Seiten", desc: "Mit dynamischem Content" },
                { title: "Custom CMS", desc: "Individuelle Verwaltungsoberfläche" },
                { title: "Mehrsprachigkeit", desc: "Automatisierte Sprachumschaltung" },
                { title: "API-Integration", desc: "Anbindung externer Dienste" },
            ]
        },
        {
            id: 4,
            category: "webdesign",
            title: "Fullstack Application",
            price: null,
            description: "Komplette Webanwendung mit Backend",
            features: [
                { title: "Java Spring Backend", desc: "REST API mit Spring Boot" },
                { title: "Datenbankintegration", desc: "MySQL/PostgreSQL mit ORM" },
                { title: "OAuth2 Security", desc: "Sicheres Login-System" },
                { title: "CI/CD Pipeline", desc: "Automatisierte Deploymentprozesse" },
                { title: "24/7 Support", desc: "Priorisierter technischer Support" },
            ],
            note: "Individuelles Angebot nach Anforderung"
        },

        {
            id: 5,
            category: "wartung",
            title: "Basis-Wartung",
            price: "49,00 € / Monat",
            description: "Grundlegende Website-Pflege",
            features: [
                { title: "Sicherheitsupdates", desc: "Monatliche Systemaktualisierungen" },
                { title: "Backup-Service", desc: "Tägliche Sicherungen" },
                { title: "Content-Updates", desc: "Bis zu 2 Textänderungen/Monat" },
            ]
        },
        {
            id: 6,
            category: "wartung",
            title: "Premium-Wartung",
            price: "99,00 € / Monat",
            description: "Umfassende Betreuung",
            features: [
                { title: "Performance-Optimierung", desc: "Ladezeitenanalyse & Verbesserung" },
                { title: "SEO-Anpassungen", desc: "Monatliche Keyword-Optimierung" },
                { title: "Responsive Anpassungen", desc: "Gerätespezifische Optimierungen" },
                { title: "Notfall-Support", desc: "24h Reaktionszeit" },
            ],
            popular: true,
        },
        {
            id: 7,
            category: "wartung",
            title: "Komplett-Refresh",
            price: "auf Anfrage",
            description: "Technologie-Migration",
            features: [
                { title: "Technologie-Update", desc: "z.B. HTML zu React Migration" },
                { title: "Redesign", desc: "Modernes UI/UX Konzept" },
                { title: "Datenmigration", desc: "Überführung bestehender Inhalte" },
                { title: "Schulung", desc: "Einweisung in neues System" },
            ]
        },

        {
            id: 8,
            category: "extras",
            title: "Multilingualer Support",
            price: "120,00 € / Sprache",
            description: "Mehrsprachige Website-Einrichtung",
            features: [
                { title: "Sprachdateien", desc: "Übersetzungsvorbereitung" },
                { title: "Automatisierte Umschaltung", desc: "Browser-Spracherkennung" },
                { title: "SEO pro Sprache", desc: "Landesspezifische Optimierung" },
            ]
        },
        {
            id: 9,
            category: "extras",
            title: "Shopify/WordPress Setup",
            price: "400,00 €",
            description: "Komplettinstallation & Konfiguration",
            features: [
                { title: "Theme-Anpassung", desc: "Individuelles Design" },
                { title: "Payment-Integration", desc: "PayPal, Kreditkarten etc." },
                { title: "Produktmigration", desc: "Bestehende Datenübernahme" },
            ]
        },
        {
            id: 10,
            category: "extras",
            title: "Linux Hosting Setup",
            price: "150,00 €",
            description: "Professionelle Serverkonfiguration",
            features: [
                { title: "LAMP/LEMP Stack", desc: "Optimierte Serverumgebung" },
                { title: "SSL-Zertifikat", desc: "Let's Encrypt Integration" },
                { title: "Monitoring", desc: "24/7 Serverüberwachung" },
            ]
        },

        {
            id: 11,
            category: "minecraft",
            title: "Basic Plugin",
            price: "80,00 €",
            description: "Einfache Servererweiterung",
            features: [
                { title: "Custom Commands", desc: "Grundlegende Befehlsimplementierung" },
                { title: "Config-Dateien", desc: "Einstellungsmöglichkeiten" },
                { title: "Multi-Language Support", desc: "Einfache Sprachumschaltung" },
            ]
        },
        {
            id: 12,
            category: "minecraft",
            title: "Advanced Plugin",
            price: "200,00 €",
            description: "Komplexe Serverintegration",
            features: [
                { title: "Datenbankanbindung", desc: "MySQL/MongoDB Integration" },
                { title: "Discord-Bot", desc: "Live-Serverstatistiken" },
                { title: "Webinterface", desc: "Administrationsoberfläche" },
                { title: "Auto-Updater", desc: "Automatische Plugin-Aktualisierungen" },
            ],
            popular: true,
        },
        {
            id: 13,
            category: "minecraft",
            title: "Enterprise Solution",
            price: "auf Anfrage",
            description: "Komplettpaket für Netzwerke",
            features: [
                { title: "Custom API", desc: "REST-Schnittstelle für Webintegration" },
                { title: "Cluster-Support", desc: "Multi-Server Implementierung" },
                { title: "Anti-Cheat System", desc: "Custom Protection Mechanisms" },
                { title: "Priority Support", desc: "24/7 Notfallservice" },
            ]
        }
    ];

    return (
        <Flex fill direction="column" center paddingTop="xl" marginTop="xl">
            <Column center padding="s" fill>
                <Flex gap="s" horizontal="center" vertical="center">
                    <Icon name="sparkle" size="m" />
                    <Heading as="h1">
                        Entdecke unsere Angebote
                    </Heading>
                    <Icon name="sparkle" size="m"/>
                </Flex>
                <Text variant="body-strong-m" align="center">
                    Wähle das passende Paket für deine Anforderungen
                </Text>
            </Column>
            <Column fill center padding="m">
                <SegmentedControl
                    selected={activeFilter}
                    buttons={filters.map(filter => ({
                        value: filter.id,
                        children: filter.label,
                    }))}
                    onToggle={(filter) => setActiveFilter(filter)}
                />
            </Column>
            <Flex fitHeight fillWidth center gap="m" margin="m" padding="m">
                <Scroller
                    direction="row"
                    center
                >
                    <Flex fill gap="xl" minHeight={40} maxHeight={40} direction="row">
                    {products
                        .filter(product => activeFilter === "all" || product.category === activeFilter)
                        .map((product) => (
                            <FlipCard
                                minHeight={40}
                                maxHeight={40}
                                minWidth={25}
                                maxWidth={25}
                            >
                                <Card
                                    height={40}
                                    width={25}
                                    padding="xl"
                                    radius="xl"
                                    direction="column"
                                    key={product.id}
                                    shadow={hoveredCard === product.id.toString() ? "xl" : "s"}
                                    onMouseEnter={() => setHoveredCard(product.id.toString())}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    border={product.popular ? "accent-alpha-medium" : "surface"}
                                >
                                    <Flex fill center direction="column" vertical="start" horizontal="start">
                                        <Column fill horizontal="end" position="absolute" bottom="0" right="0">
                                            <Text
                                                onBackground="brand-weak"
                                            >
                                                {filters.find(f => f.id === product.category)?.label || product.category}
                                            </Text>
                                        </Column>

                                        <Flex fill vertical="start" horizontal="start" direction="column" gap="m">
                                            <Column minHeight={4}>
                                                <Heading as="h4">{product.title}</Heading>
                                                <Text variant="body-default-xs">{product.description}</Text>
                                            </Column>
                                            <Line/>
                                            <Column fillWidth center>
                                                {product.price && (
                                                    <Row gap="xs" fillWidth center>
                                                        <Text variant="body-default-xl">{product.price}</Text>
                                                    </Row>
                                                )}
                                                {!product.price && product.note && (
                                                    <Text variant="body-default-s">{product.note}</Text>
                                                )}
                                            </Column>
                                            <Line marginY="xs"/>

                                            <Column fill gap="s" vertical="center" horizontal="start">
                                                {product.features.map((feature, idx) => (
                                                    <Row key={idx} gap="xs" center>
                                                        <Icon
                                                            name="checkCircle"
                                                            size="s"
                                                        />
                                                        <Column>
                                                            <Text
                                                                variant="body-default-s"
                                                            >
                                                                {feature.title}
                                                            </Text>
                                                            <Text
                                                                variant="body-default-xs"
                                                            >
                                                                {feature.desc}
                                                            </Text>
                                                        </Column>
                                                    </Row>
                                                ))}
                                            </Column>
                                        </Flex>
                                    </Flex>
                                </Card>
                                <Card
                                    height={40}
                                    width={25}
                                    padding="xl"
                                    radius="xl"
                                    direction="column"
                                    key={product.id}
                                    shadow={hoveredCard === product.id.toString() ? "xl" : "s"}
                                    onMouseEnter={() => setHoveredCard(product.id.toString())}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    border={product.popular ? "accent-alpha-medium" : "surface"}
                                >

                                </Card>
                            </FlipCard>
                            ))}
                        </Flex>
                </Scroller>
            </Flex>
        </Flex>
    )
};

export default PricingSection;