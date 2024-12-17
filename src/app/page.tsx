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
  Calendar,
  CalendarInput,
  Accordion,
  Avatar,
  AvatarGroup,
  Skeleton,
  Textarea,
  User,
  DropdownWrapper,
  Option,
} from "@/once-ui/components";
import Link from "next/link";
import { Select } from "@/once-ui/components/Select";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");

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
      paddingTop="l"
      paddingX="l"
      direction="column"
      alignItems="center"
      flex={1}
    >
      <Flex
        position="relative"
        as="section"
        overflow="hidden"
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
          <Skeleton marginTop="40" shape="line" width="l" height="l"/>
          <Flex fillWidth direction="column" radius="xl" overflow="hidden" border="neutral-medium">
            <Accordion open title="Accordion title 1">Accordion content</Accordion>
            <Accordion title="Accordion title 1">Accordion content</Accordion>
          </Flex>
          <Flex gap="8">
            <Avatar size="s"/>
            <Avatar size="m"/>
            <Avatar size="l"/>
          </Flex>
          <AvatarGroup avatars={[{ src: "/images/cover.png" }, { src: "/images/cover.png" }, { src: "/images/cover.png" }]}></AvatarGroup>
          <Flex alignItems="center" gap="8">Hey man <Icon name="check" tooltip="Check and check" tooltipPosition="right"/></Flex>
          <Flex fillWidth textVariant="body-default-xl">We've reworked the <InlineCode marginX="8" gap="4"><Icon name="check" size="s"/>InlineCode</InlineCode> component.</Flex>
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
            <Flex fillWidth negativeGap="1">
              <Button weight="default" radius="left" fillWidth data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button weight="default" radius="none" fillWidth data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
              <Button weight="default" radius="right" fillWidth data-solid="color" data-border="rounded" data-solid-style="plastic" data-brand="indigo">Button</Button>
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
                        hasPrefix={<Icon name="edit" size="s" />}
                      />
                      <Option
                        onClick={() => console.log("Duplicate")}
                        value="duplicate"
                        label="Duplicate"
                        hasPrefix={<Icon name="copy" size="s" />}
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
                        hasPrefix={<Icon name="trash" size="s" />}
                        danger
                      />
                    </Flex>
                  }
                />
              </Flex>
            </Flex>
          </Flex>

          <Heading as="h2">Select</Heading>
          <Select
            id="select"
            label="Select Example"
            value={selectedValue}
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
          <Calendar id="calendar" size="l" showTime/>
          <CalendarInput id="calendarInput" label="Pick a date" />
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
