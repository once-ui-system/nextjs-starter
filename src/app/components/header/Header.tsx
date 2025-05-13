"use client";

import {
    Button,
    Column,
    Line,
    Logo,
    NavIcon,
    Option,
    Row,
    SmartLink,
    ToggleButton,
    UserMenu,
    Fade
} from "@/once-ui/components";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import styles from './Header.module.scss';

interface HeaderProps {
    authenticated?: boolean;
    avatar?: string;
    name?: string;
    subline?: string;
}

const NAV_ITEMS = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'courses', label: 'Courses' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
];

const Header: React.FC<HeaderProps> = ({ authenticated, avatar, name, subline }) => {
    const pathname = usePathname() ?? "";
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });
    
    const handleScroll = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const section = document.getElementById(id);
        if (section) {
            const headerHeight = document.querySelector('header')?.clientHeight || 0;
            const offset = headerHeight + 24;
            
            window.scrollTo({
                top: section.offsetTop - offset,
                behavior: 'smooth'
            });
            setIsMobileMenuOpen(false);
        }
    };
    
    return (
      <Row
        zIndex={3}
        fillWidth
        position="sticky"
        horizontal="center"
        top="0"
        className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      >
          <Fade
            fillWidth
            position="absolute"
            top="0"
            height={8}
            pattern={{ display: true, size: "1" }}
          />
          
          <Row
            as="header"
            fillWidth
            padding="xs"
            height="56"
            position="relative"
            className={styles.headerInner}
          >
              {/* Mobile Navigation */}
              <Row show="s" gap="4" fillWidth vertical="center" horizontal="space-between">
                  <Logo href="/" className={styles.logo} />
                  <NavIcon
                    isActive={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Mobile Menu"
                    className={styles.menuToggle}
                  />
              </Row>
              
              {/* Desktop Content */}
              <Row
                hide="s"
                fillWidth
                vertical="center"
                horizontal="space-between"
              >
                  <Logo size="l" href="/" className={styles.logo} />
                  
                  {authenticated ? (
                    <Row fillWidth vertical="center" horizontal="end" gap="l">
                        <Row className={styles.navContainer}>
                            {NAV_ITEMS.map((item) => (
                              <ToggleButton
                                key={item.id}
                                selected={pathname.includes(item.id)}
                                label={item.label}
                                href={`#${item.id}`}
                                className={styles.navItem}
                                onClick={(e) => handleScroll(item.id, e)}
                              />
                            ))}
                        </Row>
                        <UserMenu
                          name={name}
                          subline={subline}
                          avatarProps={{ empty: !avatar, src: avatar }}
                          dropdown={
                              <Column padding="2" gap="2" minWidth={8}>
                                  <Option label="Profile" value="profile" />
                                  <Option label="Settings" value="settings" />
                                  <Line />
                                  <Option label="Log out" value="logout" />
                              </Column>
                          }
                        />
                    </Row>
                  ) : (
                    <Row className={styles.navContainer} gap="m">
                        {NAV_ITEMS.map((item) => (
                          <SmartLink
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => handleScroll(item.id, e)}
                            className={`${styles.navItem} ${pathname.includes(item.id) ? styles.active : ''}`}
                          >
                              {item.label}
                          </SmartLink>
                        ))}
                    </Row>
                  )}
              </Row>
              
              {/* Mobile Menu */}
              {isMobileMenuOpen && (
                <Column
                  show="s"
                  position="absolute"
                  top="64"
                  left="0"
                  fillWidth
                  background="overlay"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="l"
                  gap="l"
                  className={styles.mobileMenu}
                >
                    {NAV_ITEMS.map((item) => (
                      <SmartLink
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleScroll(item.id, e)}
                        className={`${styles.navItem} ${pathname.includes(item.id) ? styles.active : ''}`}
                      >
                          {item.label}
                      </SmartLink>
                    ))}
                </Column>
              )}
          </Row>
          
          {/* Scroll Progress Bar */}
          <motion.div
            className={styles.scrollProgress}
            style={{
                transformOrigin: 'left',
                scaleX: scrollY
            }}
          />
      </Row>
    );
};

export { Header };