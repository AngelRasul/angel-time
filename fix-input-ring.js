import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Location search input (enterCity)
content = content.replace(
  /className="w-full pl-16 pr-6 py-5 bg-white dark:bg-\[\#2A2928\] border border-stone-100 dark:border-\[\#3A3938\] rounded-full font-semibold outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow text-lg placeholder:text-stone-400 shadow-sm"/g,
  'className="w-full pl-16 pr-6 py-5 bg-white dark:bg-[#2A2928] border border-stone-100 dark:border-[#3A3938] rounded-full font-semibold outline-none text-lg placeholder:text-stone-400 shadow-sm"'
);

// Surah search input (searchSurahDesc) - doing it for consistency
content = content.replace(
  /className="w-full pl-12 pr-5 py-3.5 bg-stone-100 dark:bg-\[\#2A2928\] rounded-full font-semibold outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow text-base placeholder:text-stone-400"/g,
  'className="w-full pl-12 pr-5 py-3.5 bg-stone-100 dark:bg-[#2A2928] rounded-full font-semibold outline-none text-base placeholder:text-stone-400"'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced");
