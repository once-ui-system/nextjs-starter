"use client";

import React, { useState } from "react";

import {
  Heading,
  Text,
  Flex,
  Button,
  Grid,
  Icon,
  InlineCode,
  Logo,
  RangeDatePicker,
  Input,
  LetterFx,
  Accordion,
  Avatar,
  AvatarGroup,
  Skeleton,
  Textarea,
  User,
  DropdownWrapper,
  Option,
  PasswordInput,
  SegmentedControl,
  Badge,
  SmartLink,
  Carousel,
  Dialog,
  Feedback,
  GlitchFx,
  SmartImage,
  Line,
  UserMenu,
  Tag,
  DatePicker,
  DateInput,
  LogoCloud,
  Background,
  useToast,
  Card,
  Scroller,
  StatusIndicator,
  TiltFx,
  HoloFx,
  IconButton,
} from "@/once-ui/components";
import Link from "next/link";
import { Select, NumberInput } from "@/once-ui/components";
import { Fade } from "@/once-ui/components/Fade";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";
import { TbBackground } from "react-icons/tb";
import { DateRange } from "@/once-ui/components/RangeDatePicker";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  const { addToast } = useToast();

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

  return (
    <Flex
      fillWidth
      paddingY="80"
      paddingX="l"
      direction="column"
      alignItems="center"
      flex={1}
    >
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
      <Flex
        position="fixed"
        top="0"
        fillWidth
        justifyContent="center"
        zIndex={3}
      >
        <Flex
          justifyContent="space-between"
          maxWidth="m"
          paddingX="24"
          paddingY="20"
        >
          <Logo size="m" icon={false} href="https://once-ui.com" />
          <Flex gap="12" data-border="rounded">
            <Button
              href="https://github.com/once-ui-system/nextjs-starter"
              prefixIcon="github"
              size="s"
              weight="default"
              variant="tertiary"
            >
              GitHub
            </Button>
            <Button
              href="https://discord.com/invite/5EyAQ4eNdS"
              prefixIcon="discord"
              size="s"
              weight="default"
              variant="tertiary"
            >
              Discord
            </Button>
          </Flex>
        </Flex>
      </Flex>
          <Flex
            overflow="hidden"
            as="main"
            maxWidth="m"
            position="relative"
            radius="xl"
            direction="column"
            alignItems="center"
            border="neutral-alpha-weak"
            fillWidth
          >
            <Flex
              fillWidth
              direction="column"
              alignItems="center"
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
              <Flex
                fillWidth
                direction="column"
                alignItems="center"
                gap="32"
                padding="32"
                position="relative"
              >
                <InlineCode radius="xl" shadow="m" fit paddingX="16" paddingY="8">
                  Start by editing
                  <Text onBackground="brand-medium" marginLeft="8">
                    app/page.tsx
                  </Text>
                </InlineCode>
                <Heading
                  wrap="balance"
                  variant="display-default-l"
                  align="center"
                  marginBottom="16"
                >
                  Once UI is like TypeScript for design
                </Heading>
                <Button
                  id="readDocs"
                  target="_blank"
                  label="Open docs"
                  href="https://once-ui.com/docs"
                  variant="secondary"
                  arrowIcon
                />
                <Flex alignItems="center" paddingTop="64" fillWidth gap="24" direction="column">
                <Line maxWidth={4} marginBottom="16" background="neutral-alpha-medium"/>
                <AvatarGroup
                  marginBottom="8"
                  reverse
                  size="s"
                  avatars={[
                    { src: "/images/l.jpg" },
                    { src: "/images/z.jpg" },
                  ]}/>
                <Heading
                  marginBottom="12"
                  as="h2"
                  align="center"
                  variant="heading-default-l">
                  Brought to you by indie creators<br/> behind stellar projects:
                </Heading>
                <LogoCloud
                  paddingBottom="104"
                  limit={3}
                  fillWidth
                  logos={[
                    { icon: false, wordmarkSrc: "/trademark/dopler-wordmark.svg",  size: "m" },
                    { icon: false, wordmarkSrc: "/trademark/design-engineers-wordmark.svg", size: "m" },
                    { icon: false, wordmarkSrc: "/trademark/enroll-wordmark.svg",  size: "m" },
                    { icon: false, wordmarkSrc: "/trademark/magic-portfolio-wordmark.svg", size: "m" },
                    { icon: false, size: "m" },
                  ]}
                  columns="3"
                  mobileColumns="1"
                />
                </Flex>
              </Flex>
              <Flex fillWidth paddingX="32" gap="12" direction="column" alignItems="center" position="relative">
                <Heading as="h2" variant="display-default-m">
                  Showcase
                </Heading>
                <Text
                  marginBottom="32"
                  align="center" onBackground="neutral-weak">
                  Tiny snippets to inspire your next project
                </Text>

                {/* LOGIN */}
                <Flex marginY="32" background="overlay" fillWidth radius="xl" border="neutral-alpha-weak" overflow="hidden">
                <Flex fill hide="m">
                  <SmartImage src="/images/login.png" alt="Preview image"/>
                </Flex>
                <Flex fillWidth direction="column" alignItems="center" gap="20" padding="32" position="relative">
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
                  <Heading as="h3" variant="display-default-s">
                    Welcome to Once UI
                  </Heading>
                  <Text onBackground="neutral-medium" marginBottom="24">
                    Log in or<SmartLink href="/">sign up</SmartLink>
                  </Text>
                  <Flex fillWidth direction="column" gap="8">
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
                  </Flex>
                  <Flex fillWidth paddingY="24">
                    <Flex
                      onBackground="neutral-weak"
                      fillWidth
                      gap="24"
                      alignItems="center"
                    >
                      <Line />/<Line />
                    </Flex>
                  </Flex>
                  <Flex direction="column" negativeGap="1" fillWidth>
                    <Input
                      id="email"
                      label="Email"
                      labelAsPlaceholder
                      radius="top"
                    />
                    <PasswordInput
                      autoComplete="new-password"
                      id="password"
                      label="Password"
                      labelAsPlaceholder
                      radius="bottom"
                    />
                  </Flex>
                  <Button id="login" label="Log in" arrowIcon fillWidth
                    onClick={() => {
                      addToast({
                        variant: "danger",
                        message: "There was an issue with your credentials."
                      });
                    }} />
                </Flex>
              </Flex>
              </Flex>
            </Flex>

            {/* PAYMENT */}
            <Flex paddingX="32" fillWidth paddingY="160" gap="64" position="relative" mobileDirection="column" alignItems="center">
              <Background
                style={{left: '-1px'}}
                borderTop="neutral-alpha-medium"
                mask={{
                  x: 0,
                  y: 50,
                  radius: 100,
                }}
                position="absolute"
                grid={{
                  display: true,
                  opacity: 80,
                  width: "10%",
                  color: "neutral-alpha-medium",
                  height: "1.25%",
                }}
              />
              <Flex position="relative" shadow="xl" fillWidth border="neutral-alpha-medium" borderStyle="dashed" background="page" radius="xl">
              <TiltFx aspectRatio="16 / 9" fillWidth radius="xl" border="accent-alpha-weak" overflow="hidden" maxWidth={32}>
                <HoloFx fill>
                  <Background
                    fill
                    position="absolute"
                    gradient={{
                      display: true,
                      opacity: 100,
                      tilt: -45,
                      height: 150,
                      width: 100,
                      x: 75,
                      y: -50,
                      colorStart: "brand-solid-strong",
                      colorEnd: "accent-solid-weak",
                    }}
                  >
                    <Flex
                      fill position="absolute" 
                      padding="24"
                      direction="column" justifyContent="flex-end" gap="12">
                      <Text variant="body-default-xl">Lorant One</Text>
                      <Flex fillWidth justifyContent="space-between" alignItems="flex-end" paddingRight="16">
                      <Flex gap="4" direction="column">
                        <Text variant="body-default-m">08 / 27</Text>
                        <Text variant="body-default-m">1234 5678 1234 5678</Text>
                      </Flex>
                      <Icon name="visa" size="xl"/>
                      </Flex>
                      </Flex>
                  </Background>
                </HoloFx>
              </TiltFx>
              </Flex>
              <Flex position="relative" fillWidth direction="column" negativeGap="1">
              <Flex fillWidth alignItems="center" justifyContent="space-between" marginBottom="32">
                <Heading as="h3" variant="display-default-xs">
                  Fill in your card details
                </Heading>
                <IconButton data-border="rounded" variant="tertiary" icon="chevronRight" tooltip="Next" tooltipPosition="left"/>
              </Flex>
              <Input
                id="cardnumber"
                label="Card number"
                labelAsPlaceholder
                radius="top"
                defaultValue="1234 5678 1234 5678"
              />
              <Flex fillWidth negativeGap="1">
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
              </Flex>
              </Flex>
            </Flex>

            {/* BOOKING */}
            <Flex padding="32" fillWidth gap="64" position="relative" mobileDirection="column" alignItems="center">
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
            <Flex fillWidth background="surface" radius="xl" border="neutral-medium" overflow="hidden" padding="32" direction="column" gap="40" position="relative">
              <Flex fillWidth justifyContent="center" negativeGap="1">
              <Flex maxWidth={12} gap="4" direction="column" leftRadius="l" paddingX="16" paddingY="12" background="surface" border="surface">
              <Text variant="label-default-s" onBackground="neutral-weak">Check in</Text>
                {selectedRange?.startDate ? (
                  <>
                    {selectedRange?.startDate.toLocaleDateString('default', { day: 'numeric', month: 'long' })}
                  </>
                ) : (
                  "Add dates"
                ) }
              </Flex>
              <Flex maxWidth={12} gap="4" direction="column" rightRadius="l" paddingX="16" paddingY="12" background="surface" border="surface">
                  <Text variant="label-default-s" onBackground="neutral-weak">Check out</Text>
                  {selectedRange?.endDate ? (
                      <>
                        {selectedRange?.endDate?.toLocaleDateString('default', { day: 'numeric', month: 'long' })}
                      </>
                  ) : (
                    "Add dates"
                  )}
              </Flex>
            </Flex>
            <Flex fillWidth justifyContent="center">
            <RangeDatePicker
              data-scaling="110"
              size="l"
              fitWidth gap="40" mobileDirection="column"
              onChange={(range) => setSelectedRange(range)}
              value={selectedRange}
            />
            </Flex>
            </Flex>
            </Flex>

            {/* PROFILE */}
            <Flex justifyContent="center" paddingX="32" fillWidth paddingTop="80" gap="32" position="relative">
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
                    height: 25,
                    width: 200,
                    x: 50,
                    y: 25,
                    colorStart: "neutral-background-medium",
                    colorEnd: "static-transparent",
                  }}
                />
              <Flex maxWidth={32} fillWidth direction="column" negativeGap="1" paddingTop="104">
              <Feedback icon variant="success" radius={undefined} topRadius="l" zIndex={1}>
                Your profile is public.
              </Feedback>
              <Flex background="page" radius={undefined} bottomRadius="l" overflow="hidden" position="relative" fillWidth direction="column" alignItems="center" border="neutral-medium">
              <MediaUpload
                border={undefined}
                emptyState={<Flex paddingBottom="80">Drag and drop or click to browse</Flex>}
                position="absolute" aspectRatio="16 / 9"
                sizes="560px" radius={undefined} initialPreviewImage="/images/profile.jpg">
              </MediaUpload>
              <Flex paddingTop="160" paddingX="32" paddingBottom="32" fillWidth direction="column" position="relative" alignItems="center" gap="8">
              <Avatar zIndex={1} style={{border: "8px solid var(--page-background)"}} size="xl" src="/images/l.jpg"/>
              <Heading as="h3" variant="display-default-m">Lorant One</Heading>
              <Text align="center" onBackground="neutral-weak" marginBottom="24">165 connections</Text>
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
                    label: <Flex gap="8">Notifications<StatusIndicator size="s" color="cyan"/></Flex>,
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
              <Flex paddingY="32" fillWidth direction="column" negativeGap="1">
              <Input radius="top" label="Name" labelAsPlaceholder defaultValue="Lorant One" id="name"/>
              <Input radius="bottom" label="Email" labelAsPlaceholder defaultValue="lorant@once-ui.com" id="profileEmail"/>
              </Flex>
              <Button variant="secondary" onClick={() => setIsFirstDialogOpen(true)}>
                Password and security
              </Button>
              </Flex>
              </Flex>
              </Flex>
              </Flex>

            {/* CODE PREVIEW */}
            <Flex justifyContent="center" paddingX="32" fillWidth paddingTop="80" position="relative">
            <CodeBlock
                highlight="15-19"
                codeInstances={[
                  {
                    code: 
`<Flex fillWidth mobileDirection="column" negativeGap="1">
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
        label: <Flex gap="8">Notifications<StatusIndicator size="s" color="cyan"/></Flex>,
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
    ]}
  />
</Flex>
`,
                    language: "tsx",
                    label: "tsx",
                  },
                  {
                    code: `<Button>lol</Button>`,
                    language: "css",
                    label: "css",
                  },
                ]}
              />
            </Flex>

            <Flex position="relative" fillWidth paddingX="32" paddingTop="160" paddingBottom="80" justifyContent="center">
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
            <Flex position="relative" textVariant="display-default-m" align="center">
              Build with style
            </Flex>
            </Flex>
            <Flex
                  fillWidth
                  overflow="hidden"
                >
                  <Flex maxWidth="32" borderTop="neutral-alpha-weak" borderBottom="neutral-medium"></Flex>
                  <Flex fillWidth border="neutral-alpha-weak" mobileDirection="column">
                  {links.map((link, index) => (
                    <SmartLink
                      unstyled
                      fillWidth
                      target="_blank"
                      key={link.href}
                      href={link.href}
                    >
                      <Card fillWidth padding="40" gap="8" direction="column" background={undefined} borderRight={index < links.length - 1 ? "neutral-alpha-weak" : undefined} border={undefined} radius={undefined}>
                        <Flex fillWidth justifyContent="center" gap="12" alignItems="center">
                          <Text
                            variant="body-strong-m"
                            onBackground="neutral-strong"
                          >
                            {link.title}
                          </Text>
                          <Icon size="s" name="arrowUpRight" />
                        </Flex>
                        <Text
                          align="center"
                          variant="body-default-s"
                          onBackground="neutral-weak"
                        >
                          {link.description}
                        </Text>
                      </Card>
                    </SmartLink>
                  ))}
                  </Flex>
                  <Flex maxWidth="32" borderTop="neutral-alpha-weak" borderBottom="neutral-medium"></Flex>
                </Flex>
                <Flex position="relative" as="footer" fillWidth paddingX="l" paddingTop="128" paddingBottom="80">
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
              <Flex position="relative" textVariant="body-default-xs" onBackground="neutral-medium" alignItems="center" align="center" fillWidth direction="column" gap="16">
                  <Logo wordmark={false} size="s"/>
                  <Text size="m"><Text onBackground="neutral-weak">2024 /</Text> Once UI</Text>
                  <SmartLink href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">
                    MIT License
                  </SmartLink>
                  </Flex>
              </Flex>
          </Flex>

          <Dialog
            isOpen={isFirstDialogOpen}
            onClose={() => setIsFirstDialogOpen(false)}
            title="Account details"
            description="Manage your email and password."
            base={isSecondDialogOpen}
            onHeightChange={(height) => setFirstDialogHeight(height)}
            footer={
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsFirstDialogOpen(false)}
                >
                  Close
                </Button>
              </>
            }
          >
            <Button onClick={() => setIsSecondDialogOpen(true)}>
              Change password
            </Button>
          </Dialog>
          <Dialog
            isOpen={isSecondDialogOpen}
            onClose={() => setIsSecondDialogOpen(false)}
            title="Second Dialog"
            stack
            description="This is the second dialog."
            minHeight={firstDialogHeight}
          >
            <Text>Content of the second dialog</Text>
            <Select
              searchable
              labelAsPlaceholder
              id="select"
              label="Select Example"
              value={selectedValue}
              minHeight={160}
              options={[
                {
                  value: "edit",
                  label: "Edit",
                  onClick: (value) => console.log("Edit clicked", value),
                },
                {
                  value: "Duplicate",
                  label: "Duplicate",
                  onClick: (value) => console.log("Duplicate clicked", value),
                },
                {
                  value: "archive",
                  label: "Archive",
                  onClick: (value) => console.log("Archive clicked", value),
                },
                {
                  value: "delete",
                  label: "Delete",
                  danger: true,
                  onClick: (value) => console.log("Delete clicked", value),
                },
              ]}
              onSelect={handleSelect}
            />
          </Dialog>
        </Flex>
  );
}