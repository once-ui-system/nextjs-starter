import type { IconType } from "react-icons";
import { HiOutlineRocketLaunch, HiOutlineHeart, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export const iconLibrary: Record<string, IconType> = {
  rocket: HiOutlineRocketLaunch,
  like: HiOutlineHeart,
  chat: HiOutlineChatBubbleLeftRight,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;

export default iconLibrary;
