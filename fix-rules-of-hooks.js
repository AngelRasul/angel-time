import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add handleCloseSurah inside QuranScreen
code = code.replace(
  "const handleOpenSurah = (surahNumber: number) => {",
  "const handleCloseSurah = useCallback(() => setActiveSurah(null), []);\n  const handleOpenSurah = (surahNumber: number) => {"
);

// 2. Fix onClose prop
code = code.replace(
  'onClose={useCallback(() => setActiveSurah(null), [])}',
  'onClose={handleCloseSurah}'
);

// 3. Fix the missing premium loader in SurahReader from my previous replacement mistake
const originalEffect = `    fetchSurahContent(surahId, lang, controller.signal)
      .then(res => {
        if (isMounted) {`;

const fixedEffect = `    setLoading(true);
    
    const fetchPromise = fetchSurahContent(surahId, lang, controller.signal);
    // Add artificial delay of 1.5 seconds for premium effect
    const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

    Promise.all([fetchPromise, delayPromise])
      .then(([res]) => {
        if (isMounted) {`;

if (code.includes('fetchSurahContent(surahId, lang, controller.signal)') && !code.includes('Promise.all([fetchPromise, delayPromise])')) {
    code = code.replace(originalEffect, fixedEffect);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed Rules of Hooks violation and missing premium loader");
