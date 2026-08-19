import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /<header className="sticky top-0 z-30 bg-\[\#F6F8F5\]\/80 dark:bg-\[\#1C1B1A\]\/80 backdrop-blur-xl flex items-center justify-between px-6 py-6 transition-colors duration-300">/g,
  '<header className="sticky top-0 z-30 bg-[#F6F8F5]/80 dark:bg-[#1C1B1A]/80 backdrop-blur-xl flex items-center justify-between px-6 pt-6 pb-2 transition-colors duration-300">'
);

content = content.replace(
  /<main className="max-w-2xl mx-auto px-4 pb-\[100px\] pt-2">/g,
  '<main className="max-w-2xl mx-auto px-4 pb-[100px] pt-1">'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced");
