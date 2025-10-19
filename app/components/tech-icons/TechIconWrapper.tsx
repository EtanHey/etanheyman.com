import React from "react";
import TechWrapper from "../TechWrapper";
import * as TechIcons from "./index";
import { TechIconProps } from "./TechIcon";

// Define all available tech icons
export type TechIconName =
  | "AWS"
  | "Axios"
  | "Bubble"
  | "CSS3"
  | "Cloudinary"
  | "Cypress"
  | "Dart"
  | "Dndkit"
  | "Docker"
  | "Expo"
  | "FastAPI"
  | "Figma"
  | "Github"
  | "Go"
  | "Google"
  | "HTML5"
  | "HuggingFace"
  | "Jest"
  | "Jira"
  | "Make"
  | "MaterialUI"
  | "MongoDB"
  | "Mongoose"
  | "Motion"
  | "NPM"
  | "NextJS"
  | "Next.js"
  | "Node"
  | "Postman"
  | "Prettier"
  | "Python"
  | "PyTorch"
  | "React"
  | "ReactLeaflet"
  | "Redux"
  | "Socket"
  | "Svelte"
  | "Tailwind"
  | "VanillaJS"
  | "Vue"
  | "Yarn"
  | "YOLOv8";

interface TechIconWrapperProps extends Omit<TechIconProps, "className"> {
  name: TechIconName;
  wrapperClassName?: string;
  iconClassName?: string;
}

// Map of tech names to their respective components
export const techIconMap: Record<TechIconName, React.FC<TechIconProps>> = {
  Mongoose: TechIcons.MongooseIcon,
  Figma: TechIcons.FigmaIcon,
  AWS: TechIcons.AWSIcon,
  NPM: TechIcons.NPMIcon,
  Prettier: TechIcons.PrettierIcon,
  Jira: TechIcons.JiraIcon,
  Github: TechIcons.GithubIcon,
  Postman: TechIcons.PostmanIcon,
  Cypress: TechIcons.CypressIcon,
  Docker: TechIcons.DockerIcon,
  Expo: TechIcons.ExpoIcon,
  FastAPI: TechIcons.FastAPIIcon,
  Bubble: TechIcons.BubbleIcon,
  HuggingFace: TechIcons.HuggingFaceIcon,
  Make: TechIcons.MakeIcon,
  Node: TechIcons.NodeIcon,
  Axios: TechIcons.AxiosIcon,
  NextJS: TechIcons.NextJSIcon,
  "Next.js": TechIcons.NextJSIcon, // Alias for NextJS
  Python: TechIcons.PythonIcon,
  PyTorch: TechIcons.PyTorchIcon,
  Go: TechIcons.GoIcon,
  Socket: TechIcons.SocketIcon,
  Google: TechIcons.GoogleIcon,
  VanillaJS: TechIcons.VanillaJSIcon,
  Tailwind: TechIcons.TailwindIcon,
  React: TechIcons.ReactIcon,
  ReactLeaflet: TechIcons.ReactLeafletIcon,
  Redux: TechIcons.ReduxIcon,
  Dndkit: TechIcons.DndkitIcon,
  Jest: TechIcons.JestIcon,
  HTML5: TechIcons.HTML5Icon,
  CSS3: TechIcons.CSS3Icon,
  Svelte: TechIcons.SvelteIcon,
  Vue: TechIcons.VueIcon,
  Yarn: TechIcons.YarnIcon,
  YOLOv8: TechIcons.YOLOv8Icon,
  Dart: TechIcons.DartIcon,
  MaterialUI: TechIcons.MaterialUIIcon,
  Motion: TechIcons.MotionIcon,
  MongoDB: TechIcons.MongoDBIcon,
  Cloudinary: TechIcons.CloudinaryIcon,
};

export const TechIconWrapper: React.FC<TechIconWrapperProps> = ({
  name,
  wrapperClassName = "",
  iconClassName = "",
  ...iconProps
}) => {
  // Handle alternative names
  const mappedName = name === "Next.js" ? "NextJS" : name;
  const IconComponent = techIconMap[mappedName as TechIconName];

  if (!IconComponent) {
    console.warn(`Tech icon "${name}" not found`);
    return null;
  }

  return (
    <TechWrapper className={wrapperClassName} name={name}>
      <IconComponent className={iconClassName} {...iconProps} />
    </TechWrapper>
  );
};

export default TechIconWrapper;
