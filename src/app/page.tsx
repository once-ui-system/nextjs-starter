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
  UserMenu,
  Tag,
  DatePicker,
  DateInput,
} from "@/once-ui/components";
import Link from "next/link";
import { Select, NumberInput } from "@/once-ui/components";
import { Fade } from "@/once-ui/components/Fade";
import { MediaUpload } from "@/once-ui/modules";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();

  const handleSelect = (value: string) => {
    console.log("Selected option:", value);
    setSelectedValue(value);
  };

  const handleFirstDialogHeight = (height: number) => {
    setFirstDialogHeight(height);
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
      paddingTop="l"
      paddingX="l"
      direction="column"
      alignItems="center"
      flex={1}
    >
       <Fade pattern={{display: true, size: "4"}} position="fixed" top="0" left="0" zIndex={2} to="bottom" height={8} fillWidth blur={0.25} base="page"></Fade>
      <MediaUpload maxWidth="24rem" height="12rem" radius="xs" imageMaxWidth={1920} imageMaxHeight={1080}/>
      <Flex
        position="relative"
        as="section"
        fillWidth
        minHeight="0"
        maxWidth={68}
        direction="column"
        alignItems="center"
        flex={1}
      >
        <Flex
          as="main"
          direction="column"
          justifyContent="center"
          fillWidth
          fillHeight
          padding="l"
          gap="l"
        >
          <Flex mobileDirection="column" fillWidth gap="24">
            <Flex position="relative" flex={2} paddingTop="56" paddingX="xl">
              <Logo
                size="xl"
                icon={false}
                style={{ zIndex: "1" }}
                href="https://once-ui.com"
              />
            </Flex>
            <Flex
              position="relative"
              flex={4}
              gap="24"
              marginBottom="104"
              direction="column"
            >
              <InlineCode
                shadow="m"
                fit
                paddingX="16"
                paddingY="8"
              >
                Start by editing
                <Text onBackground="brand-medium">app/page.tsx</Text>
              </InlineCode>
              <Heading wrap="balance" variant="display-strong-s">
                <span className="font-code">
                  <LetterFx trigger="instant">
                    Helping designers code and developers design
                  </LetterFx>
                </span>
              </Heading>
              <Button
                id="readDocs"
                href="https://once-ui.com/docs"
                variant="secondary"
                arrowIcon
              >
                  Read docs
              </Button>
            </Flex>
          </Flex>
          <Tag marginTop="80" size="l" variant="gradient" label="Cool cool"/>
          <Grid
            radius="l"
            border="neutral-medium"
            columns="repeat(3, 1fr)"
            tabletColumns="1col"
            mobileColumns="1col"
            fillWidth
          >
            {links.map((link) => (
              <Link
                target="_blank"
                style={{ padding: "var(--responsive-space-l)" }}
                key={link.href}
                href={link.href}
              >
                <Flex fillWidth paddingY="8" gap="8" direction="column">
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
              </Link>
            ))}
          </Grid>
          Work in progress
          <Icon name="check" radius="full" background="brand-medium" padding="20"></Icon>
          <Feedback fillWidth title="Hey" marginTop="24" icon description="lolz" background="neutral-alpha-weak" radius={undefined} topRadius="l"/>
          <Button onClick={() => setIsFirstDialogOpen(true)}>Open First Dialog</Button>
          <Dialog
            maxWidth={120}
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
            maxWidth={120}
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
          <SmartImage border="neutral-alpha-weak" shadow="xl" alt="image" marginTop="80" src="/images/cover.png" enlarge priority radius="xl" aspectRatio="16 / 9"/>
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
            <Textarea id="textarea" label="Label" radius="bottom"/>
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
        position="relative"
        fillWidth
        paddingX="l"
        paddingY="m"
        justifyContent="space-between"
        mobileDirection="column"
      >
        <Text variant="body-default-s" onBackground="neutral-medium">
          2024 Once UI /{" "}
          <Link href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">
            MIT License
          </Link>
        </Text>
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
  );
}
