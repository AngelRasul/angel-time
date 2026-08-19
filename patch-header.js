import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<h1 className="text-2xl font-bold tracking-tight">Angel Time</h1>',
  `<div>
                <h1 className="text-2xl font-bold tracking-tight">Angel Time</h1>
                <span className="text-xs text-white/70 block mt-0.5">by Ataev Rasul</span>
              </div>`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
