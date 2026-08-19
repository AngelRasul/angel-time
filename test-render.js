import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  'const QuranScreen = React.memo(function QuranScreen(',
  'const QuranScreen = React.memo(function QuranScreen('
);
// just checking
