"use client";

import React, { useState } from "react";
import {
    Icon,
    Column,
    Button,
    Flex,
    Row,
    Text,
    ElementType,
    ToggleButton,
} from "@/once-ui/components";
import classNames from "classnames";
import styles from "./MobileMegaMenu.module.scss";

interface MenuLink {
    label: React.ReactNode;
    href: string;
    icon?: string;
    description?: React.ReactNode;
    selected?: boolean;
}

interface MenuSection {
    title?: React.ReactNode;
    links: MenuLink[];
}

interface MenuGroup {
    id: string;
    label: React.ReactNode;
    suffixIcon?: string;
    href?: string;
    selected?: boolean;
    sections?: MenuSection[];
}

interface MobileColumnMenuProps {
    menuGroups: MenuGroup[];
    onClose?: () => void;
}

const MobileColumnMenu: React.FC<MobileColumnMenuProps> = ({ menuGroups, onClose }) => {
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [openSection, setOpenSection] = useState<string | null>(null);

    const handleGroupClick = (groupId: string) => {
        setOpenSection(null);
        setOpenGroup((prev) => (prev === groupId ? null : groupId));
    };

    const handleSectionClick = (sectionTitle: string) => {
        setOpenSection((prev) => (prev === sectionTitle ? null : sectionTitle));
    };

    const handleLinkClick = (href: string) => {
        onClose?.();
    };

    return (
        <Flex fill background="surface" overflowY="auto">
            <Column gap="m" fill padding="8">
                {menuGroups.map((group) => (
                    <Column
                        fill
                        key={`group-${group.id}`}
                        border="neutral-alpha-strong"
                        radius="l"
                        padding="m"
                    >
                        <ToggleButton
                            fillWidth
                            aria-expanded={openGroup === group.id}
                            onClick={() => handleGroupClick(group.id)}
                            suffixIcon={openGroup === group.id ? "chevronUp" : "chevronDown"}
                            label={group.label}
                            variant="ghost"
                        />

                        {openGroup === group.id && group.sections && (
                            <Column gap="m" fill padding="m">
                                {group.sections.map((section, secIdx) => {
                                    const sectionKey = section.title ? `${group.id}-${section.title}` : `sec-${secIdx}`;
                                    const sectionTitle = String(section.title ?? "");

                                    return (
                                        <Column
                                            key={sectionKey}
                                            fill
                                            border="neutral-alpha-weak"
                                            radius="l"
                                        >
                                            {section.title && (
                                                <ToggleButton
                                                    fillWidth
                                                    aria-expanded={openSection === sectionTitle}
                                                    onClick={() => handleSectionClick(sectionTitle)}
                                                    suffixIcon={openSection === sectionTitle ? "chevronUp" : "chevronDown"}
                                                    label={section.title}
                                                    variant="outline"
                                                />
                                            )}

                                            {(section.title ? openSection === sectionTitle : true) && (
                                                <Column fitHeight padding="m">
                                                    {section.links.map((link, linkIdx) => (
                                                        <ElementType
                                                            key={`link-${linkIdx}`}
                                                            href={link.href}
                                                            tabIndex={0}
                                                            className={classNames(styles.menuLink)}
                                                            onClick={() => handleLinkClick(link.href)}
                                                            aria-label={typeof link.label === "string" ? link.label : undefined}
                                                            target={link.href.startsWith("http") ? "_blank" : undefined}
                                                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                                        >
                                                            {link.icon && (
                                                                <Icon
                                                                    name={link.icon}
                                                                    size="m"
                                                                    marginRight="16"
                                                                    onBackground="neutral-medium"
                                                                />
                                                            )}
                                                            <Column fill vertical="center" horizontal="start" gap="2">
                                                                <Text variant="body-default-m" onBackground="brand-medium">
                                                                    {link.label}
                                                                </Text>
                                                                {link.description && (
                                                                    <Text variant="body-default-s" onBackground="neutral-medium">
                                                                        {link.description}
                                                                    </Text>
                                                                )}
                                                            </Column>
                                                        </ElementType>
                                                    ))}
                                                </Column>
                                            )}
                                        </Column>
                                    );
                                })}
                            </Column>
                        )}
                    </Column>
                ))}
            </Column>

            {onClose && (
                <Column position="absolute" top="16" left="16" border="neutral-alpha-strong" radius="m">
                    <ToggleButton suffixIcon="close" onClick={onClose} size="l" />
                </Column>
            )}
        </Flex>
    );
};

MobileColumnMenu.displayName = "MobileColumnMenu";
export { MobileColumnMenu };
