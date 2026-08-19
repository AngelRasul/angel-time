import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  '    </div>\n  );\n}\n\n// --- Colorized Arabic Helper ---',
  '    </div>\n  );\n});\n\n// --- Colorized Arabic Helper ---'
);
fs.writeFileSync('src/App.tsx', code);
