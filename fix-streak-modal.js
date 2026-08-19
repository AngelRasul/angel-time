import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state to QuranScreen
code = code.replace(
  "const [lastReadSurah, setLastReadSurah] = useState<number | null>(() => {",
  "const [showStreakModal, setShowStreakModal] = useState(false);\n  const [lastReadSurah, setLastReadSurah] = useState<number | null>(() => {"
);

// 2. Make the streak widget clickable
code = code.replace(
  '<div className="flex items-center justify-between bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] rounded-3xl px-5 py-4 mb-2 shadow-sm">',
  '<div \n        onClick={() => { triggerHaptic(); setShowStreakModal(true); }}\n        className="flex items-center justify-between bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] rounded-3xl px-5 py-4 mb-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"\n      >'
);

// 3. Add the modal rendering logic
const modalCode = `

      {showStreakModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStreakModal(false)} />
          <div className="relative bg-[#F6F8F5] dark:bg-[#1C1B1A] w-full max-w-xs rounded-[40px] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-stone-200/50 dark:border-stone-800/50">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 mx-auto rounded-[32px] flex items-center justify-center mb-6">
              <Flame className="w-10 h-10 text-orange-500" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">{t('streakTitle')}</h3>
            <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-8">
              {t('streakDesc')}
            </p>
            <button
              onClick={() => { triggerHaptic(); setShowStreakModal(false); }}
              className="w-full py-4 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 rounded-[24px] font-bold shadow-sm active:scale-95 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
`;

code = code.replace(
  '  return (\n    <div className="animate-in fade-in duration-500 pb-[22px]">',
  '  return (\n    <div className="animate-in fade-in duration-500 pb-[22px]">' + modalCode
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated');
