import type { IconType } from "react-icons";

import {
  HiOutlineBookOpen,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";


export const iconLibrary: Record<string, IconType> = {
  rocket: HiOutlineRocketLaunch,
  books:HiOutlineBookOpen
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;