import React from 'react';
import TechWrapper from '../TechWrapper';
import * as TechIcons from './index';
import {TechIconProps} from './TechIcon';

// Define all available tech icons
export type TechIconName = 'AWS' | 'Axios' | 'Bubble' | 'CSS3' | 'Cloudinary' | 'Cypress' | 'Dart' | 'Dndkit' | 'Expo' | 'Figma' | 'Github' | 'Go' | 'Google' | 'HTML5' | 'Jest' | 'Jira' | 'Make' | 'MaterialUI' | 'MongoDB' | 'Mongoose' | 'Motion' | 'NPM' | 'NextJS' | 'Node' | 'Postman' | 'Prettier' | 'React' | 'ReactLeaflet' | 'Redux' | 'Socket' | 'Svelte' | 'Tailwind' | 'VanillaJS' | 'Vue' | 'Yarn';

interface TechIconWrapperProps extends Omit<TechIconProps, 'className'> {
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
  Expo: TechIcons.ExpoIcon,
  Bubble: TechIcons.BubbleIcon,
  Make: TechIcons.MakeIcon,
  Node: TechIcons.NodeIcon,
  Axios: TechIcons.AxiosIcon,
  NextJS: TechIcons.NextJSIcon,
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
  Dart: TechIcons.DartIcon,
  MaterialUI: TechIcons.MaterialUIIcon,
  Motion: TechIcons.MotionIcon,
  MongoDB: TechIcons.MongoDBIcon,
  Cloudinary: TechIcons.CloudinaryIcon
};

export const TechIconWrapper: React.FC<TechIconWrapperProps> = ({name, wrapperClassName = '', iconClassName = '', ...iconProps}) => {
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
