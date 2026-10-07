import type { Metadata } from "next";
import ComingSoonPage from "../ComingSoonPage";

export const metadata: Metadata = {
  title: "Converto | Coming Soon | ProgressionTools",
  description: "A home for file conversion utilities.",
};

export default function ConvertoPage() {
  return (
    <ComingSoonPage
      name="Converto"
      description="A home for file conversion utilities."
      path="/converto"
    />
  );
}
