import { IconType } from "react-icons";

import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineArrowPath,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineClipboard,
  HiOutlineMagnifyingGlass,
  HiOutlineLink,
  HiArrowUpRight,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineComputerDesktop,
  HiOutlineQuestionMarkCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineExclamationCircle,
  HiOutlineCheckBadge,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineEyeDropper,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2";

import { RiVisaLine } from "react-icons/ri";

import { 
  FaAmazon, 
  FaDiscord, 
  FaGitAlt, 
  FaGithub,
  FaGoogle 
} from "react-icons/fa6";

import { LuChevronsLeftRight } from "react-icons/lu";
import { FaJava } from "react-icons/fa";
import { 
  SiAngular, 
  SiDocker, 
  SiGooglecloud, 
  SiGraphql, 
  SiHibernate,
  SiKubernetes,
  SiMongodb,
  SiMysql, 
  SiNginx,
  SiNodedotjs, 
  SiPostgresql, 
  SiReact, 
  SiRedis, 
  SiSpring, 
  SiTypescript, 
  SiVuedotjs 
} from "react-icons/si";

export const iconLibrary: Record<string, IconType> = {
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  refresh: HiOutlineArrowPath,
  light: HiOutlineSun,
  dark: HiOutlineMoon,
  help: HiOutlineQuestionMarkCircle,
  info: HiOutlineInformationCircle,
  warning: HiOutlineExclamationTriangle,
  danger: HiOutlineExclamationCircle,
  checkbox: HiOutlineCheckBadge,
  check: HiOutlineCheckCircle,
  copy: HiOutlineDocumentDuplicate,
  eyeDropper: HiOutlineEyeDropper,
  clipboard: HiOutlineClipboard,
  person: HiOutlineUser,
  close: HiOutlineXMark,
  openLink: HiOutlineLink,
  arrowUpRight: HiArrowUpRight,
  minus: HiOutlineMinus,
  plus: HiOutlinePlus,
  calendar: HiOutlineCalendar,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  search: HiOutlineMagnifyingGlass,
  security: HiOutlineShieldCheck,
  sparkle: HiOutlineSparkles,
  computer: HiOutlineComputerDesktop,
  java: FaJava,
  spring: SiSpring,
  hibernate: SiHibernate,
  typescript: SiTypescript,
  postgres: SiPostgresql,
  mysql: SiMysql,
  mongo: SiMongodb,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  aws: FaAmazon,
  gcp: SiGooglecloud,
  react: SiReact,
  angular: SiAngular,
  vue: SiVuedotjs,
  node: SiNodedotjs,
  graphql: SiGraphql,
  redis: SiRedis,
  nginx: SiNginx,
  git: FaGitAlt
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
