const fs = require("fs");
const path = require("path");

// Directory containing SVG files
const TECH_ICONS_DIR = path.join(__dirname, "../app/components/tech-icons");

// Get all SVG files
const svgFiles = fs
  .readdirSync(TECH_ICONS_DIR)
  .filter((file) => file.endsWith(".svg"));

// Process each SVG file
svgFiles.forEach((svgFile) => {
  const svgPath = path.join(TECH_ICONS_DIR, svgFile);
  const svgContent = fs.readFileSync(svgPath, "utf8");

  // Extract the name without extension
  const baseName = path.basename(svgFile, ".svg");
  const componentName = baseName.replace(/-ico/i, "") + "Icon";

  // Extract SVG attributes
  const svgMatch = svgContent.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);

  if (!svgMatch) {
    console.error(`Could not extract SVG content from ${svgFile}`);
    return;
  }

  const svgAttributes = svgMatch[1];
  const innerSvg = svgMatch[2].trim();

  // Extract width and height
  const widthMatch = svgAttributes.match(/width="([^"]*)"/);
  const heightMatch = svgAttributes.match(/height="([^"]*)"/);
  const viewBoxMatch = svgAttributes.match(/viewBox="([^"]*)"/);

  const width = widthMatch ? widthMatch[1] : "47";
  const height = heightMatch ? heightMatch[1] : "47";
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 47 47";

  // Create the component file content
  const componentContent = `import React from 'react';
import { TechIconProps } from './TechIcon';

const ${componentName}: React.FC<TechIconProps> = ({ width = ${width}, height = ${height}, ...props }) => {
  return (
    <svg width={width} height={height} viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      ${innerSvg}
    </svg>
  );
};

export default ${componentName};
`;

  // Write the component file
  const componentPath = path.join(TECH_ICONS_DIR, `${componentName}.tsx`);
  fs.writeFileSync(componentPath, componentContent);

  console.log(`Created ${componentName}.tsx`);
});

// Create index.ts file to export all components
const indexPath = path.join(TECH_ICONS_DIR, "index.ts");
const componentNames = svgFiles.map((file) => {
  const baseName = path.basename(file, ".svg");
  return baseName.replace(/-ico/i, "") + "Icon";
});

// Add TechIcon to the exports
componentNames.push("TechIcon");

const indexContent = `${componentNames.map((name) => `export { default as ${name} } from './${name}';`).join("\n")}
export * from './TechIcon';
`;

fs.writeFileSync(indexPath, indexContent);
console.log("Created index.ts");

console.log("Conversion complete!");
