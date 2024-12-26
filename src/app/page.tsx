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
  Background,
  Card,
  Scroller,
} from "@/once-ui/components";
import Link from "next/link";
import { Select, NumberInput } from "@/once-ui/components";
import { Fade } from "@/once-ui/components/Fade";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();

  const handleSelect = (value: string) => {
    console.log("Selected option:", value);
    setSelectedValue(value);
  };

  const links = [
    {
      href: "https://once-ui.com/docs/theming",
      title: "Themes",
      description: "Style your app in minutes.",
    },
    {
      href: "https://once-ui.com/docs/flexComponent",
      title: "Layout",
      description: "Build responsive layouts.",
    },
    {
      href: "https://once-ui.com/docs/typography",
      title: "Typography",
      description: "Scale text automatically.",
    },
  ];

  return (
    <Flex
      fillWidth
      paddingTop="104"
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
      ></Fade>
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
          paddingY="16"
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
        position="relative"
        as="section"
        maxWidth="m"
        direction="column"
        alignItems="center"
      >
        <Flex
          position="relative"
          fillWidth
          direction="column">
          <Flex
            overflow="hidden"
            as="main"
            direction="column"
            radius="xl"
            alignItems="center"
            border="neutral-alpha-weak"
            fillWidth
          >
            <Flex
              fillWidth
              direction="column"
              alignItems="center"
              gap="48"
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
                  x: 100,
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
                  colorStart: "accent-solid-weak",
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
                  height: 40,
                  width: 75,
                  x: 100,
                  y: 55,
                  colorStart: "warning-solid-strong",
                  colorEnd: "static-transparent",
                }}
              />
              <Flex
                fillWidth
                direction="column"
                alignItems="center"
                gap="24"
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
                  Once UI is like Typescript for design
                </Heading>
                <Button
                  id="readDocs"
                  target="_blank"
                  label="Open docs"
                  href="https://once-ui.com/docs"
                  variant="secondary"
                  arrowIcon
                />
                <Flex
                  marginTop="48"
                  mobileDirection="column"
                  fillWidth
                  overflow="hidden"
                >
                  <Flex maxWidth="32" borderTop="neutral-alpha-weak" borderBottom="neutral-medium"></Flex>
                  <Flex fillWidth border="neutral-alpha-weak">
                  {links.map((link, index) => (
                    <SmartLink
                      unstyled
                      fillWidth
                      target="_blank"
                      key={link.href}
                      href={link.href}
                    >
                      <Card fillWidth padding="40" gap="8" direction="column" background={undefined} borderRight={index < links.length - 1 ? "neutral-alpha-weak" : undefined} border={undefined} radius={undefined}>
                        <Flex fillWidth gap="12" alignItems="center">
                          <Text
                            variant="body-strong-m"
                            onBackground="neutral-strong"
                          >
                            {link.title}
                          </Text>
                          <Icon size="s" name="arrowUpRight" />
                        </Flex>
                        <Text
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
              </Flex>
              <Flex fillWidth paddingX="32" paddingTop="16" gap="32" direction="column" position="relative">
                <Heading as="h2" variant="display-default-xs">
                  Showcase
                </Heading>
                <Flex fillWidth mobileDirection="column" radius="xl" border="neutral-alpha-weak" overflow="hidden">
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
                      id="password"
                      label="Password"
                      labelAsPlaceholder
                      radius="bottom"
                    />
                  </Flex>
                  <Button id="login" label="Log in" arrowIcon fillWidth />
                </Flex>
              </Flex>
              </Flex>
            </Flex>
            <Flex paddingX="32" fillWidth paddingTop="80" gap="32" direction="column" position="relative">
            <Background
                mask={{
                  x: 50,
                  y: 100,
                }}
                position="absolute"
                grid={{
                  display: true,
                  width: "0.25rem",
                  color: "brand-alpha-medium",
                  height: "0.25rem",
                }}
              />
              <Flex fillWidth direction="column" negativeGap="1">
                  <Feedback icon variant="warning" radius={undefined} topRadius="l" zIndex={1}>
                    We recommend you to update your cover image.
                  </Feedback>
                  <MediaUpload marginBottom="12" radius={undefined} bottomRadius="l" initialPreviewImage="/images/cover.png">
                    <Flex fill alignItems="flex-end" zIndex={1} position="absolute">
                      <Fade to="top" fillWidth height={12} pattern={{ display: true, size: "2" }} position="absolute" bottom="0" bottomRadius="l"/>
                      <Flex padding="24" position="relative">
                      <User name="Lorant" subline="Pro"/>
                      </Flex>
                    </Flex>
                  </MediaUpload>
                  <Scroller fillWidth gap="12" tabletDirection="column">
                    {Array(4).fill(null).map((_, index) => (
                      <Flex key={index} fillWidth direction="column" negativeGap="1" minWidth={16}>
                        <SmartImage
                          topRadius="l"
                          border="neutral-medium"
                          shadow="xl"
                          alt="image"
                          src="/images/cover.png"
                          priority
                          aspectRatio="16 / 9"
                        />
                        <Textarea
                          id={`Alt text ${index + 1}`}
                          label="Alt text"
                          radius="bottom"
                          lines="auto"
                        />
                      </Flex>
                    ))}
                  </Scroller>
                </Flex>
              <Flex fillWidth mobileDirection="column" negativeGap="1">
              <Flex fillWidth leftRadius="l" direction="column" border="neutral-medium" padding="24" maxWidth={32}>
              <SegmentedControl
                onToggle={(value) => console.log("SegmentedControl changed", value)}
                buttons={[
                  {
                    size: "l",
                    value: "edit1",
                    label: "calendar",
                  },
                  {
                    size: "l",
                    value: "duplicate2",
                    label: "eye",
                  },
                  {
                    size: "l",
                    value: "archive3",
                    label: "person",
                  },
                  {
                    size: "l",
                    value: "archive35",
                    label: "person",
                  },
                  {
                    size: "l",
                    value: "delete4",
                    label: "eyeDropper",
                  },
                  {
                    size: "l",
                    value: "edit5",
                    label: "calendar",
                  },
                  {
                    size: "l",
                    value: "duplicate6",
                    label: "eye",
                  },
                  {
                    size: "l",
                    value: "archive7",
                    label: "person",
                  },
                  {
                    size: "l",
                    value: "delete8",
                    label: "eyeDropper",
                  },
                ]}
              />
              </Flex>
              <CodeBlock
                radius={undefined}
                rightRadius="l"
                highlight="2-3,5"
                codeInstances={[
                  {
                    code: `<Button>lol</Button>
    <Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>`,
                    language: "tsx",
                    label: "tsx",
                  },
                  {
                    code: `<Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>
    <Button>lol</Button>`,
                    language: "css",
                    label: "css",
                  },
                ]}
              />
              </Flex>
              <Flex as="footer" fillWidth paddingX="l" gap="16" paddingY="64" textVariant="body-default-xs" onBackground="neutral-medium" justifyContent="center" alignItems="center" align="center" direction="column">
                  <Logo wordmark={false} size="s"/>
                  <Text size="m">2024 / Once UI</Text>
                  <SmartLink href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">
                    MIT License
                  </SmartLink>
              </Flex>
            </Flex>
          </Flex>
          <Tag marginTop="80" size="l" variant="gradient" label="Cool cool" />
          Work in progress
          <Icon
            name="check"
            radius="full"
            background="brand-medium"
            padding="20"
          ></Icon>
          <Feedback
            fillWidth
            title="Hey"
            marginTop="24"
            icon
            description="lolz"
            background="neutral-alpha-weak"
            radius={undefined}
            topRadius="l"
          />
          <Button onClick={() => setIsFirstDialogOpen(true)}>
            Open First Dialog
          </Button>
          <Dialog
            isOpen={isFirstDialogOpen}
            onClose={() => setIsFirstDialogOpen(false)}
            title="First Dialog"
            description="This is the first dialog. Click the button below to open the second dialog."
            base={isSecondDialogOpen}
            onHeightChange={(height) => setFirstDialogHeight(height)}
            footer={
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsFirstDialogOpen(false)}
                >
                  Close Dialog
                </Button>
                <Button onClick={() => setIsSecondDialogOpen(true)}>
                  Open Another
                </Button>
              </>
            }
          >
            <Button onClick={() => setIsSecondDialogOpen(true)}>
              Open Second Dialog
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
          <SmartLink prefixIcon="check" href="https://once-ui.com/docs">
            Docs
          </SmartLink>
          <Skeleton marginTop="40" shape="line" width="l" height="l" />
          <Flex
            fillWidth
            direction="column"
            radius="xl"
            overflow="hidden"
            border="neutral-medium"
          >
            <Accordion open title="Accordion title 1">
              Accordion content
            </Accordion>
            <Accordion title="Accordion title 1">Accordion content</Accordion>
          </Flex>
          <Carousel
            marginBottom="40"
            images={[
              { src: "/images/cover.png", alt: "alt" },
              { src: "/images/cover.png", alt: "alt" },
              { src: "/images/cover.png", alt: "alt" },
              { src: "/images/cover.png", alt: "alt" },
            ]}
          ></Carousel>
          <Badge
            radius="s"
            title="Badge"
            marginTop="40"
            href="https://cica.com"
          />
          <Flex gap="8">
            <Avatar size="s" marginTop="64" shadow="xl" />
            <Avatar size="m" />
            <Avatar size="l" />
          </Flex>
          <AvatarGroup
            avatars={[
              { src: "/images/cover.png" },
              { src: "/images/cover.png" },
              { src: "/images/cover.png" },
            ]}
          ></AvatarGroup>
          <Flex alignItems="center" gap="8">
            Hey man{" "}
            <Icon
              name="check"
              tooltip="Check and check"
              tooltipPosition="right"
            />
          </Flex>
          <Heading as="h2">Select</Heading>
          <Flex fillWidth negativeGap="1" direction="column">
            <Input id="input" label="Email" radius="top" />
            <PasswordInput radius="none" id="password" label="Password" />
            <Button radius="bottom" label="Login" fillWidth size="l" />
          </Flex>
          <UserMenu
            name="Lorant"
            subline="Member"
            maxWidth={16}
            dropdown={
              <Flex direction="column" gap="2" padding="4">
                <Option
                  onClick={() => console.log("Edit")}
                  value="edit"
                  label="Edit"
                />
                <Option
                  onClick={() => console.log("Duplicate")}
                  value="duplicate"
                  label="Duplicate"
                />
                <Option
                  onClick={() => console.log("Archive")}
                  value="archive"
                  label="Archive"
                  hasPrefix={
                    <Icon name="check" onBackground="neutral-medium" size="s" />
                  }
                />
              </Flex>
            }
          ></UserMenu>
          <SegmentedControl
            fillWidth={false}
            onToggle={(value) => console.log("SegmentedControl changed", value)}
            buttons={[
              {
                value: "edit",
                prefixIcon: "calendar",
                suffixIcon: "chevronDown",
              },
              {
                value: "duplicate",
                prefixIcon: "eye",
              },
              {
                value: "archive",
                prefixIcon: "person",
              },
              {
                value: "delete",
                prefixIcon: "eyeDropper",
              },
            ]}
          />
          <SegmentedControl
            onToggle={(value) => console.log("SegmentedControl changed", value)}
            buttons={[
              {
                value: "edit1",
                label: "calendar",
              },
              {
                value: "duplicate2",
                label: "eye",
              },
              {
                value: "archive3",
                label: "person",
              },
              {
                value: "delete4",
                label: "eyeDropper",
              },
            ]}
          />
          <DatePicker
            padding="xl"
            background="neutral-weak"
            id="calendar"
            size="l"
            timePicker
          />
          <DateInput
            radius="top"
            description="hello"
            id="calendarInput"
            label="Pick a date"
            timePicker
          />
        </Flex>
      </Flex>
    </Flex>
  );
}