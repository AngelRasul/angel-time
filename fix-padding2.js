import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /px-6 pt-6 pb-2 transition-colors duration-300/g,
  'px-6 pt-6 pb-1 transition-colors duration-300'
);

content = content.replace(
  /pt-1/g,
  'pt-0'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced");
