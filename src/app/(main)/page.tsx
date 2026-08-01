import {
  Text,
  Button,
  Column,
  Badge,
  Logo,
  Line,
  LetterFx,
  BlobFx,
  FadingLettersFx,
  TypeFx,
  Row,
  Schema,
} from "@once-ui-system/core";
import { baseURL, meta } from "@/resources/seo";

export default function Home() {
  return (
    <Column
      fillWidth
      minHeight="100vh"
      center
      padding="l"
      overflow="hidden"
      position="relative"
    >
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={meta.home.title}
        description={meta.home.description}
        path={meta.home.path}
      />
      <Column
        maxWidth="m"
        horizontal="center"
        gap="l"
        align="center"
        zIndex={2}
      >
        <Badge
          textVariant="code-default-s"
          border="neutral-alpha-medium"
          onBackground="neutral-medium"
          vertical="center"
          gap="16"
        >
          <Logo
            dark
            icon="/trademarks/wordmark-dark.svg"
            href="https://once-ui.com"
            size="xs"
          />
          <Logo
            light
            icon="/trademarks/wordmark-light.svg"
            href="https://once-ui.com"
            size="xs"
          />
          <Line vert background="neutral-alpha-strong" />
          <Text marginX="4">
            <LetterFx trigger="instant">An ecosystem, not a UI kit</LetterFx>
          </Text>
        </Badge>
        <Column top="24" center>
          <Row>
            <FadingLettersFx
              align="center"
              text="Presence that doesn't"
              animationState="entering"
              variant="display-strong-xl"
            />
          </Row>
          <Row>
            <FadingLettersFx
              align="center"
              text="beg for attention"
              animationState="entering"
              variant="display-strong-xl"
            />
          </Row>
        </Column>
        <Row gap="8" vertical="center" marginBottom="16">
          <Text variant="heading-default-xl" onBackground="neutral-weak">
            Build
          </Text>
          <TypeFx
            words={["with clarity and speed", "with quiet confidence"]}
            speed={80}
            hold={2000}
            trigger="instant"
            variant="heading-default-xl"
            onBackground="neutral-weak"
          />
        </Row>
        <Button
          id="docs"
          href="https://docs.once-ui.com/once-ui/quick-start"
          data-border="rounded"
          arrowIcon
          prefixIcon="books"
        >
          <Text weight="medium">Explore docs</Text>
        </Button>
      </Column>
      <BlobFx
        position="absolute"
        fill
        seed={7}
        translateY="50%"
        zIndex={1}
        opacity={80}
      />
    </Column>
  );
}
