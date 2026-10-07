import { tools } from "@/lib/toolDirectory";
import { baseURL, meta } from "@/resources/seo";
import {
  Badge,
  Button,
  Column,
  Heading,
  RevealFx,
  Schema,
  Text,
} from "@once-ui-system/core";
import InteractiveParticleLayer from "./InteractiveParticleLayer";
import SiteHeader from "./SiteHeader";

export default function Home() {
  return (
    <Column fillWidth minHeight="100vh" className="landing-page">
      <InteractiveParticleLayer />
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={meta.home.title}
        description={meta.home.description}
        path={meta.home.path}
      />
      <SiteHeader />

      <main id="home" className="landing-content">
        <Column maxWidth="m" gap="m" align="start">
          <RevealFx speed={1800} delay={180} translateY={0.5}>
            <Badge
              textVariant="code-default-s"
              border="neutral-alpha-medium"
              onBackground="neutral-medium"
              vertical="center"
              gap="12"
              className="brand-pill"
            >
              <span>Progression Developments</span>
              <span className="pill-divider" aria-hidden="true" />
              <span>
                Made with <span className="heart">♥</span>
              </span>
            </Badge>
          </RevealFx>
          <RevealFx speed={1900} delay={380} translateY={0.75}>
            <Heading variant="display-strong-xl" className="landing-title">
              Useful tools to help roblox developers
            </Heading>
          </RevealFx>
          <RevealFx speed={1900} delay={620} translateY={0.5}>
            <Text variant="heading-default-xl" onBackground="neutral-weak" wrap="balance">
              we create useful development tools that roblox creators can use for completly free to
              help productivity flourish.
            </Text>
          </RevealFx>
          <div className="tool-links-area">
            <div id="tools" className="tool-links" aria-label="Development tools">
              {tools.map(({ name, href, icon: Icon, color }, index) => (
                <RevealFx
                  className="tool-reveal"
                  speed={1800}
                  delay={850 + index * 180}
                  translateY={0.5}
                  key={name}
                >
                  <a
                    className="tool-link"
                    href={href}
                    style={
                      {
                        "--tool-color": color,
                        "--tool-label-width": `${name.length}ch`,
                      } as React.CSSProperties
                    }
                  >
                    <span className="tool-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="tool-label">{name}</span>
                  </a>
                </RevealFx>
              ))}
            </div>
          </div>
        </Column>
      </main>
    </Column>
  );
}
