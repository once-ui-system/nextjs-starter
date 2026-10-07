import type { Metadata } from "next";
import ComingSoonPage from "../ComingSoonPage";

export const metadata: Metadata = {
  title: "Access | Coming Soon | ProgressionTools",
  description: "Quick access to creator resources and utilities.",
};

export default function AccessPage() {
  return (
    <ComingSoonPage
      name="Access"
      description="Quick access to creator resources and utilities."
      path="/access"
    />
  );
}
