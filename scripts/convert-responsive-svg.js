const fs = require('fs');
const path = require('path');

// Directories containing SVG files
const TECH_ICONS_DIR = path.join(__dirname, '../app/components/tech-icons');
const DESKTOP_SVG_DIR = path.join(TECH_ICONS_DIR, 'desktop-svgs');
const MOBILE_SVG_DIR = path.join(TECH_ICONS_DIR, 'mobile-svgs');

// Get all SVG files from mobile directory
const mobileSvgFiles = fs.readdirSync(MOBILE_SVG_DIR).filter((file) => file.endsWith('.svg'));

// Process each SVG file
mobileSvgFiles.forEach((svgFile) => {
  const mobileSvgPath = path.join(MOBILE_SVG_DIR, svgFile);
  const desktopSvgPath = path.join(DESKTOP_SVG_DIR, svgFile);

  // Check if desktop version exists
  if (!fs.existsSync(desktopSvgPath)) {
    console.warn(`Desktop version for ${svgFile} not found, skipping...`);
    return;
  }

  const mobileSvgContent = fs.readFileSync(mobileSvgPath, 'utf8');
  const desktopSvgContent = fs.readFileSync(desktopSvgPath, 'utf8');

  // Extract the name without extension
  const baseName = path.basename(svgFile, '.svg');
  const componentName = baseName.replace(/-ico/i, '') + 'Icon';

  // Extract SVG attributes and content for mobile
  const mobileSvgMatch = mobileSvgContent.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!mobileSvgMatch) {
    console.error(`Could not extract SVG content from mobile ${svgFile}`);
    return;
  }

  // Extract SVG attributes and content for desktop
  const desktopSvgMatch = desktopSvgContent.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!desktopSvgMatch) {
    console.error(`Could not extract SVG content from desktop ${svgFile}`);
    return;
  }

  const mobileSvgAttributes = mobileSvgMatch[1];
  const mobileSvgInner = mobileSvgMatch[2].trim();

  const desktopSvgAttributes = desktopSvgMatch[1];
  const desktopSvgInner = desktopSvgMatch[2].trim();

  // Extract width, height and viewBox
  const mobileWidthMatch = mobileSvgAttributes.match(/width="([^"]*)"/);
  const mobileHeightMatch = mobileSvgAttributes.match(/height="([^"]*)"/);
  const mobileViewBoxMatch = mobileSvgAttributes.match(/viewBox="([^"]*)"/);

  const desktopWidthMatch = desktopSvgAttributes.match(/width="([^"]*)"/);
  const desktopHeightMatch = desktopSvgAttributes.match(/height="([^"]*)"/);
  const desktopViewBoxMatch = desktopSvgAttributes.match(/viewBox="([^"]*)"/);

  const mobileWidth = mobileWidthMatch ? mobileWidthMatch[1] : '47';
  const mobileHeight = mobileHeightMatch ? mobileHeightMatch[1] : '47';
  const mobileViewBox = mobileViewBoxMatch ? mobileViewBoxMatch[1] : '0 0 47 47';

  const desktopWidth = desktopWidthMatch ? desktopWidthMatch[1] : '47';
  const desktopHeight = desktopHeightMatch ? desktopHeightMatch[1] : '47';
  const desktopViewBox = desktopViewBoxMatch ? desktopViewBoxMatch[1] : '0 0 47 47';

  // Create the component file content
  const componentContent = `import React from 'react';
import { TechIconProps } from './TechIcon';

const ${componentName}: React.FC<TechIconProps> = ({ className = '', ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg 
        className={\`hidden md:block \${className}\`}
        width={${desktopWidth}} 
        height={${desktopHeight}} 
        viewBox="${desktopViewBox}" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
      >
        ${desktopSvgInner}
      </svg>
      
      {/* Mobile version */}
      <svg 
        className={\`md:hidden \${className}\`}
        width={${mobileWidth}} 
        height={${mobileHeight}} 
        viewBox="${mobileViewBox}" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
      >
        ${mobileSvgInner}
      </svg>
    </>
  );
};

export default ${componentName};
`;

  // Write the component file
  const componentPath = path.join(TECH_ICONS_DIR, `${componentName}.tsx`);
  fs.writeFileSync(componentPath, componentContent);

  console.log(`Created responsive ${componentName}.tsx`);
});

// Create index.ts file to export all components
const indexPath = path.join(TECH_ICONS_DIR, 'index.ts');
const componentNames = mobileSvgFiles.map((file) => {
  const baseName = path.basename(file, '.svg');
  return baseName.replace(/-ico/i, '') + 'Icon';
});

// Add TechIcon to the exports
componentNames.push('TechIcon');
componentNames.push('TechIconWrapper');

const indexContent = `${componentNames.map((name) => `export { default as ${name} } from './${name}';`).join('\n')}
export * from './TechIcon';
export * from './TechIconWrapper';
`;

fs.writeFileSync(indexPath, indexContent);
console.log('Created index.ts');

console.log('Conversion complete!');
