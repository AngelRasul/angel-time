import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /translation: translation\.ayahs \|\| \[\]/g,
  `translation: (translation && translation.ayahs) ? translation.ayahs : []`
);

fs.writeFileSync('src/App.tsx', content);
