import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /if \(arabic && translation\) \{/g,
  `if (arabic) {`
);

fs.writeFileSync('src/App.tsx', content);
