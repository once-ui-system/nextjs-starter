import { Heading, Text, Button, Column, Badge, Logo, Line, LetterFx, Background, Particle, Mask } from "@/once-ui/components";

export default function Home() {
  return (
    <Column fill center padding="l">
      <Background fill position="fixed" />
      <Particle 
        position="fixed" 
        fill
        display={true}
        density={10}
        color="brand-solid-strong"
        size="8"
        speed={1}
        interactive={false}
        interactionRadius={10}
        opacity={80}
      />
      <Mask 
        position="fixed" 
        fill 
        useCursor={true} 
        maskRadius={50}
      />
      <Column maxWidth="s" horizontal="center" gap="l" align="center">
        <Badge
          textVariant="code-default-s"
          border="neutral-alpha-medium"
          onBackground="neutral-medium"
          vertical="center"
          gap="16"
        >
          <Logo icon={false} href="https://once-ui.com" size="xs" />
          <Line vert background="neutral-alpha-strong" />
          <Text marginX="4">
            <LetterFx trigger="instant">An ecosystem, not a UI kit</LetterFx>
          </Text>
        </Badge>
        <Heading variant="display-strong-xl" marginTop="24">
          Presence that doesn't beg for attention
        </Heading>
        <Text
          variant="heading-default-xl"
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
          weight="default"
          prefixIcon="copy"
          arrowIcon
        >
          Explore docs
        </Button>
      </Column>
    </Column>
  );
}
