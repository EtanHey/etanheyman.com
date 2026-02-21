import React from "react";
import TechWrapper from "../TechWrapper";
import * as TechIcons from "./index";
import { TechIconProps } from "./TechIcon";

// Define all available tech icons
export type TechIconName =
  | "AWS"
  | "Axiom"
  | "Axios"
  | "Bubble"
  | "CSS3"
  | "Cloudinary"
  | "Cypress"
  | "Dart"
  | "Dndkit"
  | "Docker"
  | "EdgeTTS"
  | "edge-tts"
  | "Expo"
  | "FastAPI"
  | "Figma"
  | "Gemini"
  | "Github"
  | "Go"
  | "Google"
  | "Grammy"
  | "HTML5"
  | "HuggingFace"
  | "Ink"
  | "Jest"
  | "Jira"
  | "Make"
  | "MaterialUI"
  | "MCP"
  | "MLX"
  | "MongoDB"
  | "Mongoose"
  | "Motion"
  | "NPM"
  | "NextJS"
  | "Next.js"
  | "Node"
  | "Ollama"
  | "Postman"
  | "Prettier"
  | "Python"
  | "PyTorch"
  | "Railway"
  | "React"
  | "ReactLeaflet"
  | "Redux"
  | "SentenceTransformers"
  | "sentence-transformers"
  | "Socket"
  | "SqliteVec"
  | "sqlite-vec"
  | "Svelte"
  | "Tailwind"
  | "VanillaJS"
  | "Vue"
  | "WhisperCpp"
  | "whisper.cpp"
  | "Yarn"
  | "YOLOv8";

interface TechIconWrapperProps extends Omit<TechIconProps, "className"> {
  name: TechIconName;
  wrapperClassName?: string;
  iconClassName?: string;
}

// Map of tech names to their respective components
export const techIconMap: Record<TechIconName, React.FC<TechIconProps>> = {
  AWS: TechIcons.AWSIcon,
  Axiom: TechIcons.AxiomIcon,
  Axios: TechIcons.AxiosIcon,
  Bubble: TechIcons.BubbleIcon,
  CSS3: TechIcons.CSS3Icon,
  Cloudinary: TechIcons.CloudinaryIcon,
  Cypress: TechIcons.CypressIcon,
  Dart: TechIcons.DartIcon,
  Dndkit: TechIcons.DndkitIcon,
  Docker: TechIcons.DockerIcon,
  EdgeTTS: TechIcons.EdgeTTSIcon,
  "edge-tts": TechIcons.EdgeTTSIcon,
  Expo: TechIcons.ExpoIcon,
  FastAPI: TechIcons.FastAPIIcon,
  Figma: TechIcons.FigmaIcon,
  Gemini: TechIcons.GeminiIcon,
  Github: TechIcons.GithubIcon,
  Go: TechIcons.GoIcon,
  Google: TechIcons.GoogleIcon,
  Grammy: TechIcons.GrammyIcon,
  HTML5: TechIcons.HTML5Icon,
  HuggingFace: TechIcons.HuggingFaceIcon,
  Ink: TechIcons.InkIcon,
  Jest: TechIcons.JestIcon,
  Jira: TechIcons.JiraIcon,
  Make: TechIcons.MakeIcon,
  MaterialUI: TechIcons.MaterialUIIcon,
  MCP: TechIcons.MCPIcon,
  MLX: TechIcons.MLXIcon,
  MongoDB: TechIcons.MongoDBIcon,
  Mongoose: TechIcons.MongooseIcon,
  Motion: TechIcons.MotionIcon,
  NPM: TechIcons.NPMIcon,
  NextJS: TechIcons.NextJSIcon,
  "Next.js": TechIcons.NextJSIcon,
  Node: TechIcons.NodeIcon,
  Ollama: TechIcons.OllamaIcon,
  Postman: TechIcons.PostmanIcon,
  Prettier: TechIcons.PrettierIcon,
  Python: TechIcons.PythonIcon,
  PyTorch: TechIcons.PyTorchIcon,
  Railway: TechIcons.RailwayIcon,
  React: TechIcons.ReactIcon,
  ReactLeaflet: TechIcons.ReactLeafletIcon,
  Redux: TechIcons.ReduxIcon,
  SentenceTransformers: TechIcons.SentenceTransformersIcon,
  "sentence-transformers": TechIcons.SentenceTransformersIcon,
  Socket: TechIcons.SocketIcon,
  SqliteVec: TechIcons.SqliteVecIcon,
  "sqlite-vec": TechIcons.SqliteVecIcon,
  Svelte: TechIcons.SvelteIcon,
  Tailwind: TechIcons.TailwindIcon,
  VanillaJS: TechIcons.VanillaJSIcon,
  Vue: TechIcons.VueIcon,
  WhisperCpp: TechIcons.WhisperCppIcon,
  "whisper.cpp": TechIcons.WhisperCppIcon,
  Yarn: TechIcons.YarnIcon,
  YOLOv8: TechIcons.YOLOv8Icon,
};

export const TechIconWrapper: React.FC<TechIconWrapperProps> = ({
  name,
  wrapperClassName = "",
  iconClassName = "",
  ...iconProps
}) => {
  const IconComponent = techIconMap[name];

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
