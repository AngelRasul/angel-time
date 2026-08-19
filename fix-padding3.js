import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /pt-00/g,
  'pt-10'
);
content = content.replace(
  /pt-0 pb-3/g,
  'pt-1 pb-3'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced");
