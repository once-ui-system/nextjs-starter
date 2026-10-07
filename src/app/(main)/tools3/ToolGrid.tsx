"use client";

import { tools } from "@/lib/toolDirectory";
import { Button, Card, Column, Heading, Media, Row, Text } from "@once-ui-system/core";
import { useState } from "react";

export default function ToolGrid() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <section className="tool-directory-grid" aria-label="All tools">
      {tools.map((tool, index) => (
        <div
          className="directory-tool-hover"
          key={tool.name}
          style={{ "--tool-color": tool.color } as React.CSSProperties}
          onMouseEnter={() => setSelectedTool(tool.name)}
          onMouseLeave={() => setSelectedTool(null)}
          onFocusCapture={() => setSelectedTool(tool.name)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setSelectedTool(null);
            }
          }}
        >
          <Card
            className="directory-tool-card"
            selected={selectedTool === tool.name}
            fillHeight
            direction="column"
            gap="0"
            radius="s"
          >
            <Media
              className="directory-tool-image"
              src={tool.image}
              alt={`${tool.name} preview`}
              sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
              fillWidth
              aspectRatio="16 / 9"
              objectFit="cover"
              radius="s"
            />
            <Column fillWidth gap="16" padding="20" className="directory-tool-content">
              <Column fillWidth gap="8">
                <Row fillWidth horizontal="between" vertical="center">
                  <Text variant="label-default-xs" onBackground="brand-medium">
                    {tool.category}
                  </Text>
                  <span className="directory-tool-index">{String(index + 1).padStart(2, "0")}</span>
                </Row>
                <Heading as="h2" variant="heading-strong-m">
                  {tool.name}
                </Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {tool.description}
                </Text>
              </Column>
              <Button href={tool.href} variant="secondary" size="s" fillWidth>
                View tool
              </Button>
            </Column>
          </Card>
        </div>
      ))}
    </section>
  );
}
