import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const cleanupCode = `useEffect(() => {
    // Cleanup legacy localStorage cache to free up quota
    setTimeout(() => {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('angelTime_surah_')) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {}
    }, 1000);
  }, []);`;

content = content.replace(/const incrementStreak = useCallback\(\(\) => \{/g, cleanupCode + '\n\n  const incrementStreak = useCallback(() => {');
fs.writeFileSync('src/App.tsx', content);
console.log("Replaced");
