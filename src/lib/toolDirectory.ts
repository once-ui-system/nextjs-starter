import { HiFingerPrint, HiPhotograph } from "react-icons/hi";
import { HiOutlineCube, HiOutlineDocumentText } from "react-icons/hi2";
import { SiRoblox } from "react-icons/si";

export const tools = [
  {
    name: "Textify",
    href: "/textify",
    image: "/images/tools/textify.png",
    icon: HiOutlineDocumentText,
    color: "#1b42ec",
    category: "3D CREATION",
    description: "Turn text into a custom 3D model.",
  },
  {
    name: "Imageify",
    href: "/imageify",
    image: "/images/tools/imageify.png",
    icon: HiPhotograph,
    color: "#27f320",
    category: "3D CREATION",
    description: "Extrude artwork into a colored 3D relief.",
  },
  {
    name: "Converto",
    href: "/converto",
    image: "/images/tools/converto.png",
    icon: HiOutlineCube,
    color: "#f59e0b",
    category: "CONVERSION",
    description: "A home for file conversion utilities.",
  },
  {
    name: "Access",
    href: "/access",
    image: "/images/tools/access.png",
    icon: HiFingerPrint,
    color: "#be0bf5",
    category: "UTILITY",
    description: "Quick access to creator resources and utilities.",
  },
  {
    name: "Studio Plugins",
    href: "/studio",
    image: "/images/tools/studio-plugins.png",
    icon: SiRoblox,
    color: "#e62121",
    category: "ROBLOX STUDIO",
    description: "Tools and plugins for Roblox Studio workflows.",
  },
];
