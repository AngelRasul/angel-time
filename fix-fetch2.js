import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const translation = dataArray.find\(\(e: any\) => e\?\.edition\?\.type === 'translation' \|\| e\?\.edition\?\.identifier !== 'quran-uthmani'\);/g,
  `const translation = dataArray.find((e: any) => e?.edition?.identifier !== 'quran-uthmani') || arabic;`
);

fs.writeFileSync('src/App.tsx', content);
