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
          size: "4"
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}>
      </Fade>
      <Flex
        position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
        <Flex justifyContent="space-between" maxWidth="m" paddingX="24"
        paddingY="16">
        <Logo
          size="m"
          icon={false}
          href="https://once-ui.com"
        />
        <Flex gap="12">
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
        <Flex position="relative" fillWidth direction="column">
          <Flex
            overflow="hidden"
            as="main"
            direction="column"
            gap="24"
            topRadius="xl"
            alignItems="center"
            border="neutral-alpha-weak"
            fillWidth
          >
            <Flex fillWidth direction="column" alignItems="center" gap="48" paddingY="80"
            paddingX="32" position="relative">
            <Background
              mask={{
                x: 0,
                y: 40,
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
                radius: 100
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
                radius: 100
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
            <Flex fillWidth direction="column" alignItems="center" gap="24" position="relative">
            <InlineCode
              shadow="m"
              fit
              paddingX="16"
              paddingY="8"
            >
              Start by editing
              <Text onBackground="brand-medium" marginLeft="8">app/page.tsx</Text>
            </InlineCode>
            <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
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
                border="neutral-medium"
                radius="xl"
                mobileDirection="column"
                fillWidth
              >
                {links.map((link) => (
                  <SmartLink
                    style={{width: '100%'}}
                    target="_blank"
                    key={link.href}
                    href={link.href}
                  >
                    <Flex fillWidth padding="40" gap="8" direction="column">
                      <Flex fillWidth gap="12" alignItems="center">
                        <Text variant="body-strong-m" onBackground="neutral-strong">
                          {link.title}
                        </Text>
                        <Icon size="s" name="arrowUpRight" />
                      </Flex>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {link.description}
                      </Text>
                    </Flex>
                  </SmartLink>
                ))}
              </Flex>
            </Flex>
              <Flex fillWidth>
              <Heading as="h2" variant="display-default-xs">
                Showcase
              </Heading>
              </Flex>
              <Feedback icon>This is a quick preview of Once UI components, not a comprehensive list.</Feedback>
            <Flex fillWidth direction="column" negativeGap="1">
              <SmartImage topRadius="l" border="neutral-medium" shadow="xl" alt="image" src="/images/cover.png" priority aspectRatio="16 / 9"/>
              <Textarea id="Alt text" label="Alt text" radius="bottom" lines="auto"/>
            </Flex>
            </Flex>
            <Flex fillWidth direction="column" alignItems="center" gap="20">
              <Logo wordmark={false} size="l"/>
              <Heading as="h3" variant="display-default-s">Welcome to Once UI</Heading>
              <Text onBackground="neutral-medium" marginBottom="24">Log in or<SmartLink href="/">sign up</SmartLink></Text>
              <Flex fillWidth direction="column" gap="8">
              <Button label="Continue with Google" fillWidth variant="secondary" weight="default" prefixIcon="google" size="l"/>
              <Button label="Continue with GitHub" fillWidth variant="secondary" weight="default" prefixIcon="github" size="l"/>
              </Flex>
              <Flex fillWidth paddingY="24">
                <Flex onBackground="neutral-weak" fillWidth gap="24" alignItems="center"><Line/>/<Line/></Flex></Flex>
            <Flex direction="column" negativeGap="1" fillWidth>
              <Input id="email" label="Email" labelAsPlaceholder radius="top"/>
              <PasswordInput id="password" label="Password" labelAsPlaceholder radius="bottom"/>
            </Flex>
            <Button id="login" label="Log in" arrowIcon fillWidth/>
            </Flex>
          </Flex>
            <MediaUpload maxWidth={24} height={12} radius="xs"/>
          <CodeBlock
            highlight="2-3,5"
            codePreview={<Button>lol</Button>}
            codeInstances={[
              {
                code: 
`<Button>lol</Button>
<Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button><Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>`,
                language: "tsx",
                label: "tsx",
              },
              {
                code: 
`<Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>
<Button>lol</Button>`,
                language: "css",
                label: "css",
              }
            ]}/>
          <Tag marginTop="80" size="l" variant="gradient" label="Cool cool"/>
          Work in progress
          <Icon name="check" radius="full" background="brand-medium" padding="20"></Icon>
          <Feedback fillWidth title="Hey" marginTop="24" icon description="lolz" background="neutral-alpha-weak" radius={undefined} topRadius="l"/>
          <Button onClick={() => setIsFirstDialogOpen(true)}>Open First Dialog</Button>
          <Dialog
            isOpen={isFirstDialogOpen}
            onClose={() => setIsFirstDialogOpen(false)}
            title="First Dialog"
            description="This is the first dialog. Click the button below to open the second dialog."
            base={isSecondDialogOpen}
            onHeightChange={(height) => setFirstDialogHeight(height)}
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsFirstDialogOpen(false)}>Close Dialog</Button>
                <Button onClick={() => setIsSecondDialogOpen(true)}>Open Another</Button>
              </>
              }
          >
            <Button onClick={() => setIsSecondDialogOpen(true)}>Open Second Dialog</Button>
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
                onClick: (value) => console.log("Edit clicked", value)
              },
              {
                value: "Duplicate",
                label: "Duplicate",
                onClick: (value) => console.log("Duplicate clicked", value)
              },
              {
                value: "archive",
                label: "Archive",
                onClick: (value) => console.log("Archive clicked", value)
              },
              {
                value: "delete",
                label: "Delete",
                danger: true,
                onClick: (value) => console.log("Delete clicked", value)
              }
            ]}
            onSelect={handleSelect}
          />
          </Dialog>
          <SmartLink prefixIcon="check" href="https://once-ui.com/docs">Docs</SmartLink>
          <Skeleton marginTop="40" shape="line" width="l" height="l"/>
          <Flex fillWidth direction="column" radius="xl" overflow="hidden" border="neutral-medium">
            <Accordion open title="Accordion title 1">Accordion content</Accordion>
            <Accordion title="Accordion title 1">Accordion content</Accordion>
          </Flex>
          <Carousel marginBottom="40" images={[{ src: "/images/cover.png", alt: "alt" }, { src: "/images/cover.png", alt: "alt" }, { src: "/images/cover.png", alt: "alt" }, { src: "/images/cover.png", alt: "alt" }]}></Carousel>
          <Badge radius="s" title="Badge" marginTop="40" href="https://cica.com"/>
          <Flex gap="8">
            <Avatar size="s" marginTop="64" shadow="xl"/>
            <Avatar size="m"/>
            <Avatar size="l"/>
          </Flex>
          <AvatarGroup avatars={[{ src: "/images/cover.png" }, { src: "/images/cover.png" }, { src: "/images/cover.png" }]}></AvatarGroup>
          <Flex alignItems="center" gap="8">Hey man <Icon name="check" tooltip="Check and check" tooltipPosition="right"/></Flex>
          <Text as="p" variant="body-default-xl">We've reworked the <InlineCode marginX="8" gap="4"><Icon name="check" size="s"/>InlineCode</InlineCode> component.</Text>
          <Flex fillWidth padding="48" radius="xl" background="surface" data-theme="dark" direction="column" gap="48">
            <Flex fillWidth wrap gap="12">
              <Button data-solid="inverse" data-brand="blue">Button</Button>
              <Button data-solid="inverse" data-brand="indigo">Button</Button>
              <Button data-solid="inverse" data-brand="violet">Button</Button>
              <Button data-solid="inverse" data-brand="magenta">Button</Button>
              <Button data-solid="inverse" data-brand="pink">Button</Button>
              <Button data-solid="inverse" data-brand="red">Button</Button>
              <Button data-solid="inverse" data-brand="orange">Button</Button>
              <Button data-solid="inverse" data-brand="yellow">Button</Button>
              <Button data-solid="inverse" data-brand="moss">Button</Button>
              <Button data-solid="inverse" data-brand="green">Button</Button>
              <Button data-solid="inverse" data-brand="emerald">Button</Button>
              <Button data-solid="inverse" data-brand="aqua">Button</Button>
              <Button data-solid="inverse" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button data-solid="color" data-brand="blue">Button</Button>
              <Button data-solid="color" data-brand="indigo">Button</Button>
              <Button data-solid="color" data-brand="violet">Button</Button>
              <Button data-solid="color" data-brand="magenta">Button</Button>
              <Button data-solid="color" data-brand="pink">Button</Button>
              <Button data-solid="color" data-brand="red">Button</Button>
              <Button data-solid="color" data-brand="orange">Button</Button>
              <Button data-solid="color" data-brand="yellow">Button</Button>
              <Button data-solid="color" data-brand="moss">Button</Button>
              <Button data-solid="color" data-brand="green">Button</Button>
              <Button data-solid="color" data-brand="emerald">Button</Button>
              <Button data-solid="color" data-brand="aqua">Button</Button>
              <Button data-solid="color" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="blue">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="violet">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="magenta">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="pink">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="red">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="orange">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="yellow">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="moss">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="green">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="emerald">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="aqua">Button</Button>
              <Button data-theme="dark" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="blue">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="violet">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="magenta">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="pink">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="red">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="orange">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="yellow">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="moss">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="green">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="emerald">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="aqua">Button</Button>
              <Button data-theme="dark" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button size="l" data-solid="contrast" data-border="rounded" data-solid-style="plastic" data-brand="blue">Button</Button>
              <Button size="m" data-solid="contrast" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button size="s" data-solid="contrast" data-border="rounded" data-solid-style="plastic" data-brand="violet">Button</Button>
            </Flex>
          </Flex>

          <Flex fillWidth padding="48" topRadius="xl" bottomRightRadius="xl" background="page" data-theme="light" direction="column" gap="48">
            <Flex fillWidth wrap gap="12">
              <Button data-solid="inverse" data-brand="blue">Button</Button>
              <Button data-solid="inverse" data-brand="indigo">Button</Button>
              <Button data-solid="inverse" data-brand="violet">Button</Button>
              <Button data-solid="inverse" data-brand="magenta">Button</Button>
              <Button data-solid="inverse" data-brand="pink">Button</Button>
              <Button data-solid="inverse" data-brand="red">Button</Button>
              <Button data-solid="inverse" data-brand="orange">Button</Button>
              <Button data-solid="inverse" data-brand="yellow">Button</Button>
              <Button data-solid="inverse" data-brand="moss">Button</Button>
              <Button data-solid="inverse" data-brand="green">Button</Button>
              <Button data-solid="inverse" data-brand="emerald">Button</Button>
              <Button data-solid="inverse" data-brand="aqua">Button</Button>
              <Button data-solid="inverse" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button data-solid="color" data-brand="blue">Button</Button>
              <Button data-solid="color" data-brand="indigo">Button</Button>
              <Button data-solid="color" data-brand="violet">Button</Button>
              <Button data-solid="color" data-brand="magenta">Button</Button>
              <Button data-solid="color" data-brand="pink">Button</Button>
              <Button data-solid="color" data-brand="red">Button</Button>
              <Button data-solid="color" data-brand="orange">Button</Button>
              <Button data-solid="color" data-brand="yellow">Button</Button>
              <Button data-solid="color" data-brand="moss">Button</Button>
              <Button data-solid="color" data-brand="green">Button</Button>
              <Button data-solid="color" data-brand="emerald">Button</Button>
              <Button data-solid="color" data-brand="aqua">Button</Button>
              <Button data-solid="color" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="blue">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="violet">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="magenta">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="pink">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="red">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="orange">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="yellow">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="moss">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="green">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="emerald">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="aqua">Button</Button>
              <Button data-theme="light" data-solid="inverse" data-border="conservative" data-solid-style="plastic" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="blue">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="violet">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="magenta">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="pink">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="red">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="orange">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="yellow">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="moss">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="green">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="emerald">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="aqua">Button</Button>
              <Button data-theme="light" data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="cyan">Button</Button>
            </Flex>
            <Flex fillWidth wrap gap="12">
              <Button size="l" data-solid="contrast" data-border="rounded" data-solid-style="plastic" data-brand="blue">Button</Button>
              <Button size="m" data-solid="contrast" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button size="s" data-solid="contrast" data-border="rounded" data-solid-style="plastic" data-brand="violet">Button</Button>
            </Flex>
          </Flex>

          <Flex fillWidth padding="48" radius="xl" background="surface" data-theme="dark" direction="column" gap="48">
            <Flex fillWidth negativeGap="1">
              <Button variant="secondary" radius="left" data-solid="inverse" data-brand="blue">Button</Button>
              <Button variant="secondary" radius="none" data-solid="inverse" data-brand="indigo">Button</Button>
              <Button variant="secondary" radius="right" data-solid="inverse" data-brand="violet">Button</Button>
            </Flex>
            <Flex fillWidth negativeGap="1">
              <Button variant="secondary" radius="left" data-solid="inverse" data-brand="blue">Button</Button>
              <Button fillWidth prefixIcon="plus" suffixIcon="chevronDown" justifyContent="space-between" variant="secondary" radius="none" data-solid="inverse" data-brand="indigo">Button</Button>
              <Button variant="secondary" radius="right" data-solid="inverse" data-brand="violet">Button</Button>
            </Flex>
          </Flex>

          <NumberInput step={5} id="input" label="Label"></NumberInput>

          <Flex fillWidth direction="column" negativeGap="1">
            <Input hasPrefix={<Icon name="check"/>} radius="top" id="input" label="Label"/>
            <Input radius="none" id="input-2" label="Label"/>
            <Input radius="none" id="input-2" label="Label"/>
          </Flex>
          
          <Flex fillWidth direction="column" gap="24">
            <Heading as="h2">Dropdown Wrapper</Heading>
            <Text>A flexible wrapper component for creating custom dropdowns.</Text>

            <Flex gap="24">
              <Flex direction="column" gap="8">
                <DropdownWrapper
                  trigger={
                    <Button variant="secondary" suffixIcon="chevronDown">
                      Actions
                    </Button>
                  }
                  dropdown={
                    <Flex direction="column" gap="2">
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
                        hasPrefix={<Icon name="check" onBackground="neutral-medium" size="s" />}
                      />
                      <Option
                        onClick={() => console.log("Delete")}
                        value="delete"
                        label="Delete"
                        danger
                      />
                    </Flex>
                  }
                />
              </Flex>
            </Flex>
          </Flex>

          <Heading as="h2">Select</Heading>
          <Flex fillWidth negativeGap="1" direction="column">
            <Input id="input" label="Email" radius="top" />
            <PasswordInput
              radius="none"
              id="password"
              label="Password"/>
            <Button radius="bottom" label="Login" fillWidth size="l"/>
          </Flex>
          <UserMenu name="Lorant"
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
                  hasPrefix={<Icon name="check" onBackground="neutral-medium" size="s" />}
                />
              </Flex>
            }
            ></UserMenu>
          <SegmentedControl
            fillWidth={false}
            onToggle={(value) => console.log("SegmentedControl changed", value)}
            buttons={
            [
              {
                value: "edit",
                prefixIcon: "calendar",
                suffixIcon: "chevronDown"
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
              }
            ]
          }/>
          <SegmentedControl
            onToggle={(value) => console.log("SegmentedControl changed", value)}
            buttons={
            [
              {
                size: 'l',
                value: "edit1",
                label: "calendar",
              },
              {
                size: 'l',
                value: "duplicate2",
                label: "eye",
              },
              {
                size: 'l',
                value: "archive3",
                label: "person",
              },
              {
                size: 'l',
                value: "archive35",
                label: "person",
              },
              {
                size: 'l',
                value: "delete4",
                label: "eyeDropper",
              },
              {
                size: 'l',
                value: "edit5",
                label: "calendar",
              },
              {
                size: 'l',
                value: "duplicate6",
                label: "eye",
              },
              {
                size: 'l',
                value: "archive7",
                label: "person",
              },
              {
                size: 'l',
                value: "delete8",
                label: "eyeDropper",
              }
            ]
          }/>
          <SegmentedControl
            onToggle={(value) => console.log("SegmentedControl changed", value)}
            buttons={
            [
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
            ]
          }/>
          <DatePicker padding="xl" background="neutral-weak" id="calendar" size="l" timePicker/>
          <DateInput radius="top" description="hello" id="calendarInput" label="Pick a date" timePicker />
          <Flex fillWidth height={24} overflowY="scroll">
            asd
          </Flex>
          <Button
            id="github"
            fillWidth
            href="https://github.com/once-ui-system/nextjs-starter"
            prefixIcon="github"
            size="l"
            justifyContent="space-between"
            variant="tertiary"
            arrowIcon
          >
            GitHub
          </Button>
          <Button
            fillWidth
            size="m"
            variant="tertiary"
          >
            GitHub
          </Button>
          <Button
            fillWidth
            size="s"
            variant="tertiary"
          >
            GitHub
          </Button>

        </Flex>
      </Flex>
      <Flex
        as="footer"
        fillWidth
        paddingX="l"
        paddingY="m"
      >
        <Text variant="body-default-s" onBackground="neutral-medium">
          2024 Once UI /{" "}
          <Link href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">
            MIT License
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}
