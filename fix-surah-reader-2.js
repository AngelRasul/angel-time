import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the closing brace with }); for React.memo
code = code.replace(
  '      </div>\n    </div>\n  );\n}\n\n// --- Location Search Screen ---',
  '      </div>\n    </div>\n  );\n});\n\n// --- Location Search Screen ---'
);

// We need to also memoize QuranScreen so it doesn't re-render its Surah list when not needed
code = code.replace(
  'function QuranScreen({ streak, onReadSurah, surahs, loading }: { streak: number; onReadSurah: () => void; surahs: SurahType[]; loading: boolean }) {',
  'const QuranScreen = React.memo(function QuranScreen({ streak, onReadSurah, surahs, loading }: { streak: number; onReadSurah: () => void; surahs: SurahType[]; loading: boolean }) {'
);

code = code.replace(
  '        />\n      )}\n    </div>\n  );\n}\n\n// --- Surah Reader Screen ---',
  '        />\n      )}\n    </div>\n  );\n});\n\n// --- Surah Reader Screen ---'
);

// We also need to fix the onClose prop passed to SurahReader so its reference doesn't change
code = code.replace(
  'onClose={() => setActiveSurah(null)}',
  'onClose={useCallback(() => setActiveSurah(null), [])}'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Memo applied");
