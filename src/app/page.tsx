"use client";

import React, { useState } from "react";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Column,
  Row,
  StyleOverlay,
  CompareImage,
  ScrollToTop,
  ThemeSwitcher,
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";

import { BarGraph } from "@/once-ui/components/BarGraph";
import { LineGraph } from "@/once-ui/components/LineGraph";
import { MultiBarGraph } from "@/once-ui/components/MultiBarGraph";
import { LineBarGraph } from "@/once-ui/components/LineBarGraph";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  const { addToast } = useToast();
  const [intro, setIntro] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState<string[]>(["UX / UI", "Design systems", "AI / ML"]);
  const [twoFA, setTwoFA] = useState(false);

  const handleSelect = (value: string) => {
    console.log("Selected option:", value);
    setSelectedValue(value);
  };

  const links = [
    {
      href: "https://once-ui.com/docs/theming",
      title: "Themes",
      description: "Style your app in minutes",
    },
    {
      href: "https://once-ui.com/docs/flexComponent",
      title: "Layout",
      description: "Build responsive layouts",
    },
    {
      href: "https://once-ui.com/docs/typography",
      title: "Typography",
      description: "Scale text automatically",
    },
  ];

  const validateIntro = (value: React.ReactNode) => {
    if (typeof value === "string" && value.length < 10) {
      return (
        <Row horizontal="center" marginBottom="12" gap="8">
          <Icon name="errorCircle" />
          Intro must be at least 10 characters long.
        </Row>
      );
    }
    return null;
  };

  const validateLogin = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Email and / or password is invalid.";
    }
    return null;
  };

  return (
    <Column fillWidth paddingY="80" paddingX="s" horizontal="center" flex={1}>
      <ScrollToTop><IconButton variant="secondary" icon="chevronUp"/></ScrollToTop>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth horizontal="center" zIndex={3}>
        <Row
          data-border="rounded"
          horizontal="space-between"
          maxWidth="l"
          paddingRight="64"
          paddingLeft="32"
          paddingY="20"
        >
          <Logo size="s" icon={false} href="https://once-ui.com" />
          <Row gap="12" hide="s">
            <Button
              href="https://discord.com/invite/5EyAQ4eNdS"
              prefixIcon="discord"
              size="s"
              label="Discord"
              weight="default"
              variant="tertiary"
            />
            <Button
              href="https://github.com/once-ui-system"
              prefixIcon="github"
              size="s"
              label="GitHub"
              weight="default"
              variant="tertiary"
            />
            <Row position="fixed" top="20" right="20">
              <StyleOverlay
                position="fixed"
                top="8"
                right="8"
                style={{ height: "calc(100vh - var(--static-space-16))" }}
              />
            </Row>
          </Row>
          <Row gap="16" show="s" horizontal="center" paddingRight="24">
            <IconButton
              href="https://discord.com/invite/5EyAQ4eNdS"
              icon="discord"
              variant="tertiary"
            />
            <IconButton
              href="https://github.com/once-ui-system/nextjs-starter"
              icon="github"
              variant="tertiary"
            />
            <Row position="fixed" top="20" right="20">
              <StyleOverlay
                position="fixed"
                top="8"
                right="8"
                style={{ height: "calc(100vh - var(--static-space-16))" }}
              />
            </Row>
          </Row>
        </Row>
      </Row>
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        horizontal="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Column
          fillWidth
          horizontal="center"
          gap="48"
          radius="xl"
          paddingTop="80"
          position="relative"
        >
          <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: -35,
              height: 50,
              width: 75,
              x: 100,
              y: 40,
              colorStart: "accent-solid-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: -35,
              height: 20,
              width: 120,
              x: 120,
              y: 35,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Column fillWidth horizontal="center" gap="32" padding="32" position="relative">
            <InlineCode radius="xl" shadow="m" fit paddingX="16" paddingY="8">
              Start by editing
              <Text onBackground="brand-medium" marginLeft="8">
                app/page.tsx
              </Text>
            </InlineCode>
            <Heading wrap="balance" variant="display-strong-xl" align="center" marginBottom="16">
              Code faster than AI
            </Heading>
            <Button
              id="readDocs"
              target="_blank"
              label="Open docs"
              href="https://once-ui.com/docs"
              variant="secondary"
              arrowIcon
            />
            <Column horizontal="center" paddingTop="64" fillWidth gap="24">
              <Line maxWidth={4} marginBottom="16" background="neutral-alpha-medium" />
              <AvatarGroup
                marginBottom="8"
                reverse
                size="s"
                avatars={[
                  {
                    src: "/images/l.jpg",
                  },
                  {
                    src: "/images/z.jpg",
                  },
                ]}
              />
              <Heading marginBottom="12" as="h2" align="center" variant="heading-default-l">
                Brought to you by indie creators
                <br /> behind stellar projects:
              </Heading>
              <LogoCloud
                paddingBottom="104"
                columns="3"
                mobileColumns="1"
                limit={3}
                fillWidth
                logos={[
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/dopler-wordmark.svg",
                    href: "https://dopler.app",
                    size: "m",
                  },
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/design-engineers-wordmark.svg",
                    href: "https://club.dropler.io",
                    size: "m",
                  },
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/enroll-wordmark.svg",
                    href: "https://enroll.dopler.app",
                    size: "m",
                  },
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/magic-portfolio-wordmark.svg",
                    href: "https://magic-portfolio.com",
                    size: "m",
                  },
                ]}
              />
            </Column>
          </Column>
          <Column fillWidth paddingX="32" gap="12" horizontal="center" position="relative">
            <Heading as="h2" variant="display-default-m">
              Showcase
            </Heading>
            <Text marginBottom="32" align="center" onBackground="neutral-weak">
              Tiny snippets to inspire your next project
            </Text>

            {/* COMPARE IMAGE */}
            <CompareImage
              radius="xl"
              overflow="hidden"
              border="neutral-alpha-weak"
              leftContent={{ src: "/images/1.jpg", alt: "alt" }}
              rightContent={{ src: "/images/2.jpg", alt: "alt" }}
            />

            {/* LOGIN */}
            <Row
              marginY="32"
              background="overlay"
              fillWidth
              radius="xl"
              border="neutral-alpha-weak"
              overflow="hidden"
            >
              <Row fill hide="m">
                <SmartImage src="/images/login.png" alt="Preview image" sizes="560px" />
              </Row>
              <Column fillWidth horizontal="center" gap="20" padding="32" position="relative">
                <Background
                  mask={{
                    x: 100,
                    y: 0,
                    radius: 75,
                  }}
                  position="absolute"
                  grid={{
                    display: true,
                    opacity: 50,
                    width: "0.5rem",
                    color: "neutral-alpha-medium",
                    height: "1rem",
                  }}
                />
                <Logo wordmark={false} size="l" />
                <Heading as="h3" variant="display-default-s" align="center">
                  Welcome to Once UI
                </Heading>
                <Text onBackground="neutral-medium" marginBottom="24">
                  Log in or
                  <SmartLink href="/">sign up</SmartLink>
                </Text>
                <Column fillWidth gap="8">
                  <Button
                    label="Continue with Google"
                    fillWidth
                    variant="secondary"
                    weight="default"
                    prefixIcon="google"
                    size="l"
                  />
                  <Button
                    label="Continue with GitHub"
                    fillWidth
                    variant="secondary"
                    weight="default"
                    prefixIcon="github"
                    size="l"
                  />
                </Column>
                <Row fillWidth paddingY="24">
                  <Row onBackground="neutral-weak" fillWidth gap="24" vertical="center">
                    <Line />/<Line />
                  </Row>
                </Row>
                <Column gap="-1" fillWidth>
                  <Input
                    id="email"
                    label="Email"
                    labelAsPlaceholder
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    validate={validateLogin}
                    errorMessage={false}
                    radius="top"
                  />
                  <PasswordInput
                    autoComplete="new-password"
                    id="password"
                    label="Password"
                    labelAsPlaceholder
                    radius="bottom"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    validate={validateLogin}
                  />
                </Column>
                <Button
                  id="login"
                  label="Log in"
                  arrowIcon
                  fillWidth
                  onClick={() => {
                    addToast({
                      variant: "success",
                      message: "Wohoo! It's a toast!",
                    });
                  }}
                />
              </Column>
            </Row>
          </Column>
        </Column>

        {/* PAYMENT */}
        <Row
          paddingX="32"
          fillWidth
          paddingY="160"
          gap="64"
          position="relative"
          mobileDirection="column"
          vertical="center"
        >
          <Background
            style={{ left: "-1px" }}
            borderTop="neutral-alpha-medium"
            mask={{
              x: 0,
              y: 50,
              radius: 100,
            }}
            position="absolute"
            grid={{
              display: true,
              opacity: 100,
              width: "10%",
              color: "neutral-alpha-medium",
              height: "1.25%",
            }}
          />
          <Row
            position="relative"
            shadow="xl"
            fillWidth
            border="neutral-alpha-medium"
            borderStyle="dashed"
            background="page"
            radius="xl"
          >
            <TiltFx
              aspectRatio="16 / 9"
              fillWidth
              radius="xl"
              border="accent-alpha-weak"
              overflow="hidden"
            >
              <HoloFx fill>
                <Background
                  fill
                  position="absolute"
                  gradient={{
                    display: true,
                    tilt: -45,
                    height: 150,
                    width: 100,
                    x: 75,
                    y: -50,
                    colorStart: "brand-solid-strong",
                    colorEnd: "accent-solid-weak",
                  }}
                >
                  <Column
                    fill
                    position="absolute"
                    padding="24"
                    vertical="end"
                    gap="12"
                    onSolid="neutral-strong"
                  >
                    <Text variant="body-default-xl">Lorant One</Text>
                    <Row fillWidth horizontal="space-between" vertical="end" paddingRight="16">
                      <Column gap="4">
                        <Text variant="body-default-m">08 / 27</Text>
                        <Text variant="body-default-m">1234 5678 1234 5678</Text>
                      </Column>
                      <Icon name="visa" size="xl" />
                    </Row>
                  </Column>
                </Background>
              </HoloFx>
            </TiltFx>
          </Row>
          <Column position="relative" fillWidth gap="-1">
            <Row fillWidth vertical="center" horizontal="space-between" marginBottom="32">
              <Heading as="h3" variant="display-default-xs">
                Fill in your card details
              </Heading>
              <IconButton
                data-border="rounded"
                variant="tertiary"
                icon="chevronRight"
                tooltip="Next"
                tooltipPosition="left"
              />
            </Row>
            <Input
              id="cardnumber"
              label="Card number"
              labelAsPlaceholder
              radius="top"
              defaultValue="1234 5678 1234 5678"
            />
            <Row fillWidth gap="-1">
              <Input
                id="expiry"
                label="Expiry date"
                labelAsPlaceholder
                radius="bottom-left"
                defaultValue="08 / 27"
              />
              <Input
                id="cvv"
                label="CVV"
                labelAsPlaceholder
                radius="bottom-right"
                defaultValue="123"
              />
            </Row>
          </Column>
        </Row>

        {/* BOOKING */}
        <Row
          padding="32"
          fillWidth
          gap="64"
          position="relative"
          mobileDirection="column"
          vertical="center"
        >
          <Background
            fill
            position="absolute"
            gradient={{
              display: true,
              opacity: 60,
              tilt: 0,
              height: 100,
              width: 100,
              x: 50,
              y: 0,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Column
            fillWidth
            background="surface"
            radius="xl"
            border="neutral-medium"
            overflow="hidden"
            padding="32"
            gap="40"
            position="relative"
          >
            <Row fillWidth horizontal="center" gap="-1">
              <Column
                maxWidth={12}
                gap="4"
                leftRadius="l"
                paddingX="16"
                paddingY="12"
                background="surface"
                border="neutral-medium"
              >
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Check in
                </Text>
                {selectedRange?.startDate ? (
                  <>
                    {selectedRange?.startDate.toLocaleDateString("default", {
                      day: "numeric",
                      month: "long",
                    })}
                  </>
                ) : (
                  "Add dates"
                )}
              </Column>
              <Column
                maxWidth={12}
                gap="4"
                rightRadius="l"
                paddingX="16"
                paddingY="12"
                background="surface"
                border="neutral-medium"
              >
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Check out
                </Text>
                {selectedRange?.endDate ? (
                  <>
                    {selectedRange?.endDate?.toLocaleDateString("default", {
                      day: "numeric",
                      month: "long",
                    })}
                  </>
                ) : (
                  "Add dates"
                )}
              </Column>
            </Row>
            <Row fillWidth horizontal="center">
              <DateRangePicker
                data-scaling="110"
                size="l"
                fitWidth
                gap="40"
                mobileDirection="column"
                onChange={(range) => setSelectedRange(range)}
                value={selectedRange}
              />
            </Row>
          </Column>
        </Row>

        {/* PROFILE */}
        <Row horizontal="center" paddingX="32" paddingY="64" fillWidth gap="32" position="relative">
          <Background
            mask={{
              cursor: true,
            }}
            dots={{
              display: true,
              opacity: 50,
              color: "neutral-solid-strong",
              size: "48",
            }}
            fill
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: 0,
              height: 100,
              width: 200,
              x: 50,
              y: 0,
              colorStart: "neutral-background-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Column maxWidth={32} gap="-1">
            <Feedback
              icon
              variant="success"
              vertical="center"
              radius={undefined}
              topRadius="l"
              zIndex={1}
            >
              Your profile is public.
            </Feedback>
            <Column
              background="page"
              radius={undefined}
              bottomRadius="l"
              overflow="hidden"
              position="relative"
              fillWidth
              horizontal="center"
              border="neutral-medium"
            >
              <MediaUpload
                border={undefined}
                emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                position="absolute"
                aspectRatio="16 / 9"
                sizes="560px"
                radius={undefined}
                initialPreviewImage="/images/profile.jpg"
              />
              <Column
                paddingTop="160"
                paddingX="32"
                paddingBottom="32"
                fillWidth
                position="relative"
                horizontal="center"
                gap="8"
              >
                <Avatar
                  zIndex={1}
                  style={{
                    border: "8px solid var(--page-background)",
                  }}
                  size="xl"
                  src="/images/l.jpg"
                />
                <Heading marginTop="24" as="h3" variant="display-default-m">
                  Lorant One
                </Heading>
                <Text align="center" onBackground="neutral-weak" marginBottom="24">
                  165 connections
                </Text>
                <SegmentedControl
                  onToggle={(value) => console.log("SegmentedControl changed", value)}
                  buttons={[
                    {
                      size: "l",
                      value: "profile",
                      label: "Profile",
                    },
                    {
                      size: "l",
                      value: "settings",
                      label: "Settings",
                    },
                    {
                      size: "l",
                      value: "notifications",
                      label: (
                        <Row gap="8">
                          Notifications
                          <StatusIndicator size="s" color="cyan" />
                        </Row>
                      ),
                    },
                    {
                      size: "l",
                      value: "integrations",
                      label: "Integrations",
                    },
                    {
                      size: "l",
                      value: "inbox",
                      label: "Inbox",
                    },
                    {
                      size: "l",
                      value: "requests",
                      label: "Requests",
                    },
                  ]}
                />
                <Column paddingY="32" fillWidth gap="-1">
                  <Input
                    radius="top"
                    label="Name"
                    labelAsPlaceholder
                    defaultValue="Lorant One"
                    id="name"
                  />
                  <Input
                    radius="bottom"
                    label="Email"
                    labelAsPlaceholder
                    defaultValue="lorant@once-ui.com"
                    id="profileEmail"
                  />
                </Column>
                <Textarea
                  id="intro"
                  label="Intro"
                  lines="auto"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  validate={validateIntro}
                />
                <TagInput
                  id="interests"
                  value={tags}
                  onChange={(newTags: string[]) => {
                    setTags(newTags);
                  }}
                  label="Interests"
                />
                <Select
                  searchable
                  labelAsPlaceholder
                  id="select"
                  label="Country"
                  value={selectedValue}
                  options={[
                    {
                      value: "Austria",
                      label: "Austria",
                      onClick: (value) => console.log("Visiblity set: ", value),
                    },
                    {
                      value: "Finland",
                      label: "Finland",
                      onClick: (value) => console.log("Visiblity set: ", value),
                    },
                    {
                      value: "New Zeland",
                      label: "New Zeland",
                      onClick: (value) => console.log("Visiblity set: ", value),
                    },
                    {
                      value: "Norway",
                      label: "Norway",
                      onClick: (value) => console.log("Visiblity set: ", value),
                    },
                    {
                      value: "United Kingdom",
                      label: "United Kingdom",
                      onClick: (value) => console.log("Visiblity set: ", value),
                    },
                    {
                      value: "United States",
                      label: "United States",
                      onClick: (value) => console.log("Visiblity set: ", value),
                    },
                  ]}
                  onSelect={handleSelect}
                />
                <Button
                  className="mt-32"
                  prefixIcon="security"
                  variant="secondary"
                  onClick={() => setIsFirstDialogOpen(true)}
                >
                  Password and security
                </Button>
              </Column>
            </Column>
          </Column>
        </Row>

        {/* CODE PREVIEW */}
        <TiltFx fillWidth paddingX="32" paddingTop="64">
          <Column
            border="neutral-alpha-weak"
            paddingX="32"
            radius="xl"
            overflow="hidden"
            paddingY="160"
            fillWidth
            position="relative"
          >
            <Background
              mask={{
                x: 100,
                y: 0,
              }}
              position="absolute"
              grid={{
                display: true,
                color: "neutral-alpha-medium",
                width: "2rem",
                height: "2rem",
              }}
            />
            <Background
              mask={{
                x: 0,
                y: 100,
                radius: 100,
              }}
              position="absolute"
              grid={{
                display: true,
                color: "brand-alpha-strong",
                width: "12",
                height: "12",
              }}
              gradient={{
                display: true,
                opacity: 100,
                height: 100,
                width: 100,
                tilt: 0,
                x: 0,
                y: 100,
                colorStart: "brand-solid-strong",
                colorEnd: "brand-background-medium",
              }}
            />
            <Column horizontal="center" gap="48" fillWidth position="relative">
              <Heading align="center" as="h2" variant="display-default-l">
                Quick start
              </Heading>
              <CodeBlock
                compact
                maxWidth={40}
                codeInstances={[
                  {
                    code: `git clone https://github.com/once-ui-system/nextjs-starter.git`,
                    language: "tsx",
                    label: "tsx",
                  },
                ]}
              />
            </Column>
          </Column>
        </TiltFx>

        {/* DATA VISUALIZATION */}
        <Row
          position="relative"
          fillWidth
          paddingX="32"
          paddingY="160"
          horizontal="center"
          vertical="center"
        >
          <Background
            mask={{
              x: 50,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            dots={{
              display: true,
              opacity: 50,
              color: "neutral-solid-strong",
              size: "48",
            }}
          />
          <Column fillWidth gap="64">
            <Column gap="16" horizontal="center">
              <Heading as="h2" variant="display-default-m">
                Data Visualization
              </Heading>
              <Text align="center" onBackground="neutral-weak">
                Powerful, responsive charts with automatic theming support
              </Text>
            </Column>
            
            <Row fill gap="32" mobileDirection="column">
              {/* Bar Graph */}
              <Column fill>
              <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    Revenue
                  </Heading>
                  <BarGraph
                  hideAxisTitles
                  hideLabels
                  height={20}
                    barColor="success"
                    tooltipTitle="Revenue"
                    xAxisTitle="Month"
                    yAxisTitle="USD"
                    hideYAxisLabels={false}
                    data={[
                      { name: "Jan", value: 4500, startDate: "Jan", endDate: "January" },
                      { name: "Feb", value: 5200, startDate: "Feb", endDate: "February" },
                      { name: "Mar", value: 4900, startDate: "Mar", endDate: "March" },
                      { name: "Apr", value: 6300, startDate: "Apr", endDate: "April" },
                      { name: "May", value: 5900, startDate: "May", endDate: "May" },
                      { name: "Jun", value: 8200, startDate: "Jun", endDate: "June" },
                    ]}
                  />
                </Column>
              </Column>
              
              {/* Line Graph */}
              <Column fillWidth>
                <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    User Activity
                  </Heading>
                  <LineGraph
                  hideAxisTitles
                    height={20}
                    xAxisTitle="Week"
                    yAxisTitle="Users"
                    value1="Desktop"
                    value2="Mobile"
                    value3="Tablet"
                    data={[
                      { name: "W1", value1: 2100, value2: 1400, value3: 5500 },
                      { name: "W2", value1: 2200, value2: 4398, value3: 3200 },
                      { name: "W3", value1: 2000, value2: 1200, value3: 6500 },
                      { name: "W4", value1: 3780, value2: 1108, value3: 1700 },
                      { name: "W5", value1: 5990, value2: 1800, value3: 2100 },
                      { name: "W6", value1: 4000, value2: 2400, value3: 3000 },
                      { name: "W7", value1: 5000, value2: 3000, value3: 4000 },
                    ]}
                  />
                </Column>
              </Column>
            </Row>
            
            <Row fillWidth gap="32" mobileDirection="column">
              {/* Multi Bar Graph */}
              <Column fillWidth>
                <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    Quarterly Comparison
                  </Heading>
                  <MultiBarGraph
                  hideAxisTitles
                    height={20}
                    data={[
                      { name: "Q1", value1: 35000, value2: 45000, value3: 30000 },
                      { name: "Q2", value1: 42000, value2: 48000, value3: 36000 },
                      { name: "Q3", value1: 55000, value2: 51000, value3: 40000 },
                      { name: "Q4", value1: 75000, value2: 52000, value3: 48000 },
                    ]}
                    xAxisTitle="Quarter"
                    yAxisTitle="USD"
                    barLabels={["2023", "2024", "Projected"]}
                  />
                </Column>
              </Column>
              
              {/* Line Bar Graph */}
              <Column fillWidth>
                <Column background="neutral-weak" fill direction="column" border="neutral-alpha-weak" radius="xl" padding="32" gap="24">
                  <Heading as="h3" variant="heading-default-m">
                    Conversions vs Traffic
                  </Heading>
                  <LineBarGraph
                  hideAxisTitles
                    height={20}
                    lineColorVariant="info"
                    showArea={true}
                    xAxisTitle="Day"
                    yAxisTitle="Count"
                    lineName="Traffic"
                    barName="Conversions"
                    data={[
                      { name: "Mon", lineValue: 4500, barValue: 2190 },
                      { name: "Tue", lineValue: 5200, barValue: 4230 },
                      { name: "Wed", lineValue: 4800, barValue: 3250 },
                      { name: "Thu", lineValue: 5900, barValue: 3280 },
                      { name: "Fri", lineValue: 6800, barValue: 4320 },
                      { name: "Sat", lineValue: 4800, barValue: 3190 },
                      { name: "Sun", lineValue: 3900, barValue: 3170 },
                    ]}
                  />
                </Column>
              </Column>
            </Row>
            
            <Row horizontal="center" marginTop="32">
              <Button
                id="dataVizDocs" 
                target="_blank"
                label="Explore chart components"
                href="https://once-ui.com/docs/charts"
                variant="secondary"
                arrowIcon
              />
            </Row>
          </Column>
        </Row>

        <Row
          position="relative"
          fillWidth
          paddingX="32"
          paddingTop="160"
          minHeight={28}
          paddingBottom="80"
          horizontal="center"
          vertical="end"
        >
          <Background
            mask={{
              x: 50,
              y: 100,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "brand-alpha-strong",
              height: "0.25rem",
            }}
          />
          <Row position="relative" textVariant="display-default-m" align="center">
            Learn more
          </Row>
        </Row>
        <Row fillWidth overflow="hidden">
          <Row maxWidth="32" borderTop="neutral-alpha-weak" borderBottom="neutral-medium"></Row>
          <Row fillWidth border="neutral-alpha-weak" mobileDirection="column">
            {links.map((link, index) => (
              <Card
                key={index}
                fillWidth
                href={link.href}
                padding="40"
                gap="8"
                background="page"
                direction="column"
                borderRight={index < links.length - 1 ? "neutral-alpha-weak" : undefined}
                border={undefined}
              >
                <Row fillWidth center gap="12">
                  <Text variant="body-strong-m" onBackground="neutral-strong">
                    {link.title}
                  </Text>
                  <Icon size="s" name="arrowUpRight" />
                </Row>
                <Text align="center" variant="body-default-s" onBackground="neutral-weak">
                  {link.description}
                </Text>
              </Card>
            ))}
          </Row>
          <Row maxWidth="32" borderTop="neutral-alpha-weak" borderBottom="neutral-medium"></Row>
        </Row>
        <Row
          position="relative"
          as="footer"
          fillWidth
          paddingX="l"
          paddingTop="128"
          paddingBottom="80"
        >
          <Background
            borderTop="brand-alpha-strong"
            mask={{
              x: 50,
              y: 0,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "brand-alpha-strong",
              height: "0.25rem",
            }}
          />
          <Column
            position="relative"
            textVariant="body-default-xs"
            onBackground="neutral-medium"
            horizontal="center"
            align="center"
            fillWidth
            gap="16"
          >
            <Logo wordmark={false} size="s" />
            <Text size="m">
              <Text onBackground="neutral-weak">2025 /</Text> Once UI
            </Text>
            <SmartLink href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">
              MIT License
            </SmartLink>
            <ThemeSwitcher marginTop="24"/>
          </Column>
        </Row>
      </Column>

      <Dialog
        isOpen={isFirstDialogOpen}
        onClose={() => setIsFirstDialogOpen(false)}
        title="Account details"
        description="Manage your security settings and password."
        base={isSecondDialogOpen}
        onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsFirstDialogOpen(false)}>
              Close
            </Button>
          </>
        }
      >
        <Column paddingTop="24" fillWidth gap="24">
          <Switch
            reverse
            isChecked={twoFA}
            onToggle={() => setTwoFA(!twoFA)}
            label="2FA"
            description="Enable two factor authentication"
          />
          <Button onClick={() => setIsSecondDialogOpen(true)}>Change password</Button>
        </Column>
      </Dialog>
      <Dialog
        isOpen={isSecondDialogOpen}
        onClose={() => setIsSecondDialogOpen(false)}
        title="Change password"
        stack
        description="Choose a new password for your account."
        minHeight={firstDialogHeight}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsSecondDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsSecondDialogOpen(false)}>Save</Button>
          </>
        }
      >
        <PasswordInput id="resetPassword" label="New password" />
      </Dialog>
    </Column>
  );
}
