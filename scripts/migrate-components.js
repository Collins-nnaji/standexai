const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../components/standex-digital');

function processDir(currentDir) {
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Inject "use client" if not present
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        content = '"use client";\n\n' + content;
      }
      
      // Fix imports like './About' missing extension if it fails, but Next.js usually resolves them.
      // Rename to .tsx
      const newPath = fullPath.replace(/\.jsx$/, '.tsx');
      fs.writeFileSync(fullPath, content);
      fs.renameSync(fullPath, newPath);
      console.log(`Processed and renamed: ${newPath}`);
    }
  }
}

processDir(dir);
console.log('Done processing components.');
