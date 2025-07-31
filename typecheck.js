// Quick type check for common errors
const fs = require('fs');
const path = require('path');

function checkTypescriptFiles() {
  const srcDir = path.join(__dirname, 'src');
  const files = getAllTsxFiles(srcDir);
  
  let errors = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for common import issues
    if (content.includes('TrendingUpIcon') && !content.includes('ArrowTrendingUpIcon')) {
      errors.push(`${file}: Uses TrendingUpIcon instead of ArrowTrendingUpIcon`);
    }
    
    if (content.includes('TrendingDownIcon') && !content.includes('ArrowTrendingDownIcon')) {
      errors.push(`${file}: Uses TrendingDownIcon instead of ArrowTrendingDownIcon`);
    }
    
    // Check for unsafe property access
    const unsafeAccessPattern = /\.\w+(?!\?)\.\w+(?!\?)\./g;
    const matches = content.match(unsafeAccessPattern);
    if (matches) {
      matches.forEach(match => {
        if (match.includes('.enabled.') || match.includes('.apiKey.')) {
          errors.push(`${file}: Potentially unsafe property access: ${match}`);
        }
      });
    }
  });
  
  return errors;
}

function getAllTsxFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

const errors = checkTypescriptFiles();
if (errors.length > 0) {
  console.log('Found potential issues:');
  errors.forEach(error => console.log('- ' + error));
} else {
  console.log('No obvious type issues found');
}