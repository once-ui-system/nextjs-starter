import { tools } from "@/lib/toolDirectory";
import { baseURL } from "@/resources/seo";
import { Heading, ParticleFx, RevealFx, Schema, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";
import ToolGrid from "./ToolGrid";

export const metadata: Metadata = {
  title: "All Tools | ProgressionTools",
  description: "Browse tools built for Roblox creators and developers.",
};

export default function ToolsPage() {
  return (
    <div className="landing-page tools-directory-page">
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
        title="All Tools | ProgressionTools"
        description="Browse tools built for Roblox creators and developers."
        path="/tools"
      />
      <SiteHeader />
      <main className="tools-directory-content">
        <RevealFx speed={1800} translateY={0.5}>
          <div className="tools-directory-heading">
            <div>
              <Text variant="label-default-s" onBackground="brand-medium">
                PROGRESSIONTOOLS / DIRECTORY
              </Text>
              <Heading as="h1" variant="display-strong-s">
                All tools
              </Heading>
            </div>
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
              className="tools-directory-count"
            >
              {tools.length.toString().padStart(2, "0")} tools
            </Text>
          </div>
        </RevealFx>
        <ToolGrid />
      </main>
    </div>
  );
}
