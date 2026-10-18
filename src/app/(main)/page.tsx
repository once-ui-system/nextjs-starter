import {
  Heading,
  Text,
  Button,
  Column,
  Tag,
  Logo,
  Line,
} from "@once-ui-system/core";
import { LetterFx } from "@once-ui-system/fx";
import { Schema } from "@once-ui-system/core";
import { baseURL, meta } from "@/resources/seo";

export default function Home() {
  return (
    <Column fillWidth minHeight="100vh" center padding="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={meta.home.title}
        description={meta.home.description}
        path={meta.home.path}
      />
      <Column maxWidth="s" horizontal="center" gap="l" align="center">
        <Tag
          variant="announce"
          textVariant="code-default-s"
          border="neutral-alpha-medium"
          onBackground="neutral-medium"
          vertical="center"
          gap="16"
        >
          <Logo showIn="dark" icon="/trademarks/wordmark-dark.svg" href="https://once-ui.com" size="xs" />
          <Logo showIn="light" icon="/trademarks/wordmark-light.svg" href="https://once-ui.com" size="xs" />
          <Line vert background="neutral-alpha-strong" />
          <Text marginX="4">
            <LetterFx trigger="instant">An ecosystem, not a UI kit</LetterFx>
          </Text>
        </Tag>
        <Heading textVariant="display-strong-xl" marginTop="24">
          Presence that doesn't beg for attention
        </Heading>
        <Text
          textVariant="heading-default-xl"
          onBackground="neutral-weak"
          wrap="balance"
          marginBottom="16"
        >
          Build with clarity, speed, and quiet confidence
        </Text>
        <Button
          id="docs"
          href="https://docs.once-ui.com/once-ui/quick-start"
          data-border="rounded"
          arrowIcon
        >
          Explore docs
        </Button>
      </Column>
    </Column>
  );
}
