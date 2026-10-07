import type { Metadata } from "next";
import ImageifyApp from "./ImageifyApp";

export const metadata: Metadata = {
  title: "Imageify | ProgressionTools",
  description: "Turn images into colored 3D models and export them as FBX or OBJ.",
};

export default function ImageifyPage() {
  return <ImageifyApp />;
}