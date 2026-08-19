import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<span className="text-xs text-white/70 block mt-0.5">by Ataev Rasul</span>',
  '<span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5 font-medium">by Ataev Rasul</span>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx text color");
