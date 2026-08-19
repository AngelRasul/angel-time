import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /if \(diffDays === 1\) \{[\s\S]*?newStreak \+= 1;[\s\S]*?\} else if \(diffDays > 1\) \{[\s\S]*?newStreak = 1;[\s\S]*?\} else \{[\s\S]*?newStreak \+= 1;[\s\S]*?\}/,
  `if (diffDays === 1) {\n               newStreak += 1;\n            } else if (diffDays > 1) {\n               newStreak = 1;\n            }`
);

fs.writeFileSync('src/App.tsx', content);
