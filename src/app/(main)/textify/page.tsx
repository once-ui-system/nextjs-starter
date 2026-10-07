import type { Metadata } from "next";
import TextifyApp from "./TextifyApp";

export const metadata: Metadata = {
  title: "Textify | ProgressionTools",
  description: "Create, preview, and export custom 3D text as FBX.",
};

export default function TextifyPage() {
  return <TextifyApp />;
}