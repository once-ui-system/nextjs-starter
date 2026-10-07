import type { Metadata } from "next";
import ComingSoonPage from "../ComingSoonPage";

export const metadata: Metadata = {
  title: "Studio Plugins | Coming Soon | ProgressionTools",
  description: "Tools and plugins for Roblox Studio workflows.",
};

export default function StudioPage() {
  return (
    <ComingSoonPage
      name="Studio Plugins"
      description="Tools and plugins for Roblox Studio workflows."
      path="/studio"
    />
  );
}
