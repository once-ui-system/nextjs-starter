"use client";
import React, {ChangeEvent, useState} from "react";
import {
    Background,
    Badge,
    Button,
    Card,
    Column, Dialog,
    Flex,
    Heading,
    Icon, Input, Line,
    Row, Scroller,
    SegmentedControl,
    Text, Textarea,
} from "@/once-ui/components";
import styles from "./ProjectSimulator.module.scss"

const PricingSection = () => {
    const [activeFilter, setActiveFilter] = useState("webdesign");
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

    const toggleProduct = (id: number) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleInputChange = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [field]: e.target.value });
    };

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

    const selectedDetails = products.filter(p => selectedProducts.includes(p.id));

    return (
        <Flex fill direction="column" center paddingTop="xl" marginTop="xl" transition="macro-long">
            <Column center fill>
                <Flex horizontal="center" vertical="center">
                    <Heading variant="display-strong-xs">Entdecke unsere Angebote</Heading>
                </Flex>
                <Text variant="body-strong-m">
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
                <Scroller direction="row" center>
                    <Flex fill gap="xl" minHeight={40} maxHeight={40} direction="row">
                        {products
                            .filter(product => activeFilter === "all" || product.category === activeFilter)
                            .map(product => (
                                <Card
                                    key={product.id}
                                    height={40}
                                    width={25}
                                    padding="48"
                                    radius="xl"
                                    direction="column"
                                    shadow="s"
                                    onBackground="brand-strong"
                                    background="info-medium"
                                    border={product.popular ? "accent-alpha-medium" : "surface"}
                                >
                                    {selectedProducts.includes(product.id) && (
                                    <Background
                                        position="absolute"
                                        radius="xl"
                                        mask={{
                                            x: 50,
                                            y: 100,
                                            radius: 40,
                                        }}
                                        gradient={{
                                            display: true,
                                            x: 0,
                                            y: 0,
                                            width: 0,
                                            height: 0,
                                            tilt: 0,
                                            opacity: 60,
                                            colorStart: "page-background",
                                            colorEnd: "accent-alpha-strong"
                                        }}
                                    />
                                    )}
                                    <Flex
                                        fill
                                        center
                                        direction="column"
                                        vertical="start"
                                        horizontal="start"
                                        onClick={() => toggleProduct(product.id)}
                                    >
                                        <Column fill horizontal="end" position="absolute" bottom="0" right="0">
                                            <Text onBackground="info-weak">
                                                {filters.find(f => f.id === product.category)?.label || product.category}
                                            </Text>
                                        </Column>

                                        <Flex fill vertical="start" horizontal="start" direction="column" gap="l">
                                            <Column minHeight={4} gap="xs">
                                                <Heading as="h3">{product.title}</Heading>
                                                <Text variant="body-default-s">{product.description}</Text>
                                            </Column>
                                            <Line />
                                            <Column fillWidth center>
                                                {product.price && (
                                                    <Text variant="body-default-l">{product.price}</Text>
                                                )}
                                                {!product.price && product.note && (
                                                    <Text variant="body-default-s">{product.note}</Text>
                                                )}
                                            </Column>
                                            <Line />

                                            <Column fill gap="m" vertical="start" horizontal="start">
                                                {product.features.map((feature, idx) => (
                                                    <Row key={idx} gap="xs" center>
                                                        <Icon name="checkCircle" size="s" />
                                                        <Column>
                                                            <Text variant="body-default-s">{feature.title}</Text>
                                                            <Text variant="body-default-xs">{feature.desc}</Text>
                                                        </Column>
                                                    </Row>
                                                ))}
                                            </Column>
                                        </Flex>
                                    </Flex>
                                    <Column horizontal="end" fillWidth position="absolute" top="16" right="16">
                                        <Icon
                                            name = {selectedProducts.includes(product.id) ? "minus" : "plus"}
                                            transition="macro-medium"
                                        />
                                    </Column>
                                </Card>
                            ))}
                    </Flex>
                </Scroller>
            </Flex>

            <Dialog
                title="Produktanfrage"
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                transition="macro-medium"
            >
                <Column padding="xl" gap="xl">
                    <Column gap="xs">
                        <Heading as="h3" variant="heading-strong-l">📝 Zusammenfassung deiner Auswahl</Heading>
                        <Text variant="body-default-s" onBackground="info-weak">
                            Du hast <strong>{selectedDetails.length}</strong> Paket{selectedDetails.length > 1 ? "e" : ""} ausgewählt.
                        </Text>
                    </Column>

                    <Card padding="m" radius="l" shadow="s" background="surface" border="accent-alpha-medium">
                        <Column gap="m">
                            {selectedDetails.map(product => (
                                <Row key={product.id} gap="s" align="center">
                                    <Icon name="dot" size="s" />
                                    <Text variant="body-default-m">
                                        {product.title} – {product.price || product.note}
                                    </Text>
                                </Row>
                            ))}
                            <Line />
                            <Text variant="body-default-s" onBackground="info-weak">
                                Gesamtpreis:{" "}
                                <strong>
                                    {selectedDetails
                                        .map(p => p.price)
                                        .filter(Boolean)
                                        .join(", ") || "auf Anfrage"}
                                </strong>
                            </Text>
                        </Column>
                    </Card>

                    <Column gap="m">
                        <Input
                            id="name"
                            label="👤 Dein Name"
                            value={form.name}
                            onChange={handleInputChange("name")}
                            placeholder="Max Mustermann"
                        />
                        <Input
                            id="email"
                            label="📧 E-Mail-Adresse"
                            value={form.email}
                            onChange={handleInputChange("email")}
                            type="email"
                        />
                        <Input
                            id="phone"
                            label="📞 Telefonnummer"
                            value={form.phone}
                            onChange={handleInputChange("phone")}
                            type="tel"
                        />
                        <Textarea
                            id="information"
                            label="💬 Sonstige Informationen"
                            value={form.message}
                            onChange={handleInputChange("message")}
                        />
                    </Column>

                    <Column gap="xs" paddingTop="s">
                        <Button
                            label="Anfrage jetzt absenden"
                            size="l"
                            suffixIcon="sparkle"
                            onClick={() => {
                                console.log({ selectedProducts: selectedDetails, ...form });
                                setShowDialog(false);
                            }}
                        />
                        <Text variant="body-default-xs" onBackground="info-weak" align="center">
                            Deine Daten werden nur zur Bearbeitung deiner Anfrage verwendet. Keine Weitergabe an Dritte.
                        </Text>
                    </Column>
                </Column>
            </Dialog>


            {selectedProducts.length > 0 && (
                <Column
                    position="fixed"
                    bottom="0"
                    right="16"
                    padding="m"
                    margin="m"
                    zIndex={10}
                >
                    <Button
                        size="l"
                        suffixIcon="messageCircle"
                        label={`Jetzt anfragen (${selectedProducts.length} ${selectedProducts.length === 1 ? 'Paket' : 'Pakete'})`}
                        onClick={() => setShowDialog(true)}
                        className={styles.requestButton}
                    />
                </Column>
            )}
        </Flex>
    );
};

export default PricingSection;
