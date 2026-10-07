import { baseURL } from "@/resources/seo";
import { Badge, Column, Heading, ParticleFx, RevealFx, Schema, Text } from "@once-ui-system/core";
import SiteHeader from "./SiteHeader";

type ComingSoonPageProps = {
  name: string;
  description: string;
  path: string;
};

export default function ComingSoonPage({ name, description, path }: ComingSoonPageProps) {
  const title = `${name} | Coming Soon | ProgressionTools`;

  return (
    <div className="landing-page coming-soon-page">
      <div className="particle-layer" aria-hidden="true">
        <ParticleFx
          className="particle-field"
          fill
          interactive
          color="particle-color"
          opacity={90}
          density={450}
          speed={1.5}
          intensity={30}
        />
      </div>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path={path}
      />
      <SiteHeader />
      <main className="coming-soon-content">
        <RevealFx speed={1800} translateY={0.5}>
          <Column align="center" gap="m" className="coming-soon-message">
            <Badge
              textVariant="code-default-s"
              border="neutral-alpha-medium"
              onBackground="neutral-medium"
              vertical="center"
            >
              IN DEVELOPMENT
            </Badge>
            <Text variant="label-default-s" onBackground="brand-medium">
              {name}
            </Text>
            <Heading as="h1" variant="display-strong-l" className="coming-soon-title">
              Coming soon
            </Heading>
            <Text
              variant="heading-default-m"
              onBackground="neutral-weak"
              className="coming-soon-description"
              wrap="balance"
            >
              {description}
            </Text>
            <a className="coming-soon-link" href="/tools">
              Explore all tools
            </a>
          </Column>
        </RevealFx>
      </main>
    </div>
  );
}
