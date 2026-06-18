import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

const aliases = {
  '@ui/': 'src/components/ui/',
  '@features/': 'src/components/features/',
  '@components/': 'src/components/',
  '@layouts/': 'src/layouts/',
  '@utils/': 'src/utils/',
  '@services/': 'src/services/',
  '@assets/': 'src/assets/'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.astro') || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /(from\s+['"]|import\s+['"]|import\(['"])(\.\.[^'"]+)(['"]\)?)/g;
  
  content = content.replace(importRegex, (match, p1, relPath, p3) => {
    const absolutePath = path.resolve(path.dirname(file), relPath);
    const relativeToRoot = path.relative(rootDir, absolutePath).replace(/\\/g, '/');
    
    let newImport = relPath;
    for (const [alias, prefix] of Object.entries(aliases)) {
      if (relativeToRoot.startsWith(prefix)) {
        newImport = relativeToRoot.replace(prefix, alias);
        changed = true;
        break;
      }
    }
    return `${p1}${newImport}${p3}`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Refactored ${changedFiles} files.`);