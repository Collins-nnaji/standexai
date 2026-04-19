const fs = require('fs');
const path = require('path');

const routes = {
  '': 'Home',
  'PowerPlatform': 'PowerPlatform',
  'PowerApps': 'PowerApps',
  'PowerAutomate': 'PowerAutomate',
  'PowerBi': 'PowerBi',
  'PowerPages': 'PowerPages',
  'CopilotStudio': 'CopilotStudio',
  'Services': 'Services',
  'Training': 'Training',
  'About': 'About',
  'Contact': 'Contact',
  'courses/ai-practitioner': 'Training/CloudAICourse',
  'courses/power-platform-bi': 'Training/PowerPlatformCourse',
  'TechElevate': 'TechElevatePage',
  'StandexAI': 'StandexAIPage'
};

const appDir = path.join(__dirname, '../app');

for (const [route, component] of Object.entries(routes)) {
  const routeDir = path.join(appDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  const pagePath = path.join(routeDir, 'page.tsx');
  
  // Calculate relative path to components
  const depth = route ? route.split('/').length : 0;
  const relativePrefix = depth === 0 ? '.' : '../'.repeat(depth);
  
  const content = `import ${component.split('/').pop()} from '@/components/standex-digital/${component}';

export default function Page() {
  return <${component.split('/').pop()} />;
}
`;

  fs.writeFileSync(pagePath, content);
  console.log(`Generated page for ${route || '/'}`);
}
