import { IconType } from "react-icons";

import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineArrowPath,
  HiCheck,
  HiOutlineSun,
  HiOutlineMoon,
  HiMiniQuestionMarkCircle,
  HiMiniMinus,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiMiniPlus,
  HiMiniUser,
  HiMiniXMark,
  HiEyeDropper,
  HiOutlineClipboard,
  HiOutlineMagnifyingGlass,
  HiCalendar,
  HiOutlineLink,
  HiExclamationTriangle,
  HiArrowUpRight,
  HiInformationCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";

import { RiVisaLine } from "react-icons/ri";

import {FaAmazon, FaDiscord, FaGitAlt, FaGithub, FaGoogle} from "react-icons/fa6";

import { LuChevronsLeftRight } from "react-icons/lu";
import {FaJava} from "react-icons/fa";
import {
  SiAngular,
  SiDocker, SiGooglecloud, SiGraphql,
  SiHibernate,
  SiKubernetes,
  SiMongodb,
  SiMysql, SiNginx, SiNodedotjs,
  SiPostgresql, SiReact, SiRedis,
  SiSpring,
  SiTypescript, SiVuedotjs
} from "react-icons/si";

export const iconLibrary: Record<string, IconType> = {
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  chevronsLeftRight: LuChevronsLeftRight,
  refresh: HiOutlineArrowPath,
  check: HiCheck,
  light: HiOutlineSun,
  dark: HiOutlineMoon,
  helpCircle: HiMiniQuestionMarkCircle,
  infoCircle: HiInformationCircle,
  warningTriangle: HiExclamationTriangle,
  errorCircle: HiExclamationCircle,
  checkCircle: HiCheckCircle,
  eyeDropper: HiEyeDropper,
  clipboard: HiOutlineClipboard,
  person: HiMiniUser,
  close: HiMiniXMark,
  openLink: HiOutlineLink,
  discord: FaDiscord,
  google: FaGoogle,
  github: FaGithub,
  arrowUpRight: HiArrowUpRight,
  minus: HiMiniMinus,
  plus: HiMiniPlus,
  calendar: HiCalendar,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  search: HiOutlineMagnifyingGlass,
  visa: RiVisaLine,
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
