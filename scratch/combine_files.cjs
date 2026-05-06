const fs = require('fs');
const path = require('path');

const folders = ['src/data/', 'src/context/', 'src/hooks/', 'src/pages/', 'src/components/'];
const singleFiles = ['App.jsx', 'main.jsx', 'package.json'];
const outputFileName = 'combined_codebase.txt';

let output = '';

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) return;

  const ext = path.extname(filePath);
  if (ext !== '.js' && ext !== '.jsx' && path.basename(filePath) !== 'package.json') return;

  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  output += `=== FILE: ${relativePath} ===\n`;
  output += content;
  output += `\n=== END FILE ===\n\n`;
}

// Folders
folders.forEach(folder => {
  const dirPath = path.join(process.cwd(), folder);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath, { recursive: true });
  files.forEach(file => {
    processFile(path.join(dirPath, file));
  });
});

// Single files
singleFiles.forEach(file => {
  processFile(path.join(process.cwd(), file));
});

fs.writeFileSync(outputFileName, output);
console.log(`Combined codebase written to ${outputFileName}`);
