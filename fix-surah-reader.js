import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the loading effect in SurahReader
const originalEffect = `  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetchSurahContent(surahId, lang, controller.signal)
      .then(res => {
        if (isMounted) {
          // API returns an array of editions in data
          const dataArray = Array.isArray(res?.data) ? res.data : [];
          const arabic = dataArray.find((e: any) => e?.edition?.identifier === 'quran-uthmani');
          const translation = dataArray.find((e: any) => e?.edition?.identifier !== 'quran-uthmani') || arabic;
          
          if (arabic) {
            setData({
              arabic: arabic.ayahs || [],
              translation: (translation && translation.ayahs) ? translation.ayahs : [],
              metadata: arabic
            });
            setLoading(false);
            onReadSurah();
          } else {
            if (isMounted) setLoading(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; controller.abort(); };
  }, [surahId, onReadSurah, lang]);`;

const fixedEffect = `  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    setLoading(true);
    
    const fetchPromise = fetchSurahContent(surahId, lang, controller.signal);
    // Add artificial delay of 1.5 seconds for premium effect
    const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

    Promise.all([fetchPromise, delayPromise])
      .then(([res]) => {
        if (isMounted) {
          const dataArray = Array.isArray(res?.data) ? res.data : [];
          const arabic = dataArray.find((e: any) => e?.edition?.identifier === 'quran-uthmani');
          const translation = dataArray.find((e: any) => e?.edition?.identifier !== 'quran-uthmani') || arabic;
          
          if (arabic) {
            setData({
              arabic: arabic.ayahs || [],
              translation: (translation && translation.ayahs) ? translation.ayahs : [],
              metadata: arabic
            });
            setLoading(false);
            onReadSurah();
          } else {
            if (isMounted) setLoading(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; controller.abort(); };
  }, [surahId, onReadSurah, lang]);`;

code = code.replace(originalEffect, fixedEffect);

// 2. Replace the loading indicator
const originalLoader = `<div className="flex justify-center py-32 h-full items-center">
            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
          </div>`;

const newLoader = `<div className="flex flex-col justify-center items-center py-40 h-full gap-8">
            <div className="relative w-16 h-16">
              <svg className="animate-spin w-full h-full text-emerald-500" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeDasharray="90, 150"></circle>
              </svg>
            </div>
          </div>`;

code = code.replace(originalLoader, newLoader);

// 3. Optimize render - wrap SurahReader in React.memo
code = code.replace(
  'function SurahReader({ surahId, onClose, onReadSurah }: { surahId: number; onClose: () => void; onReadSurah: () => void }) {',
  'const SurahReader = React.memo(function SurahReader({ surahId, onClose, onReadSurah }: { surahId: number; onClose: () => void; onReadSurah: () => void }) {'
);
code = code.replace(
  '  return (\n    <div className="fixed inset-0',
  '  return (\n    <div className="fixed inset-0'
); // Just to verify replace, wait, we need to add '});' at the end of SurahReader.

fs.writeFileSync('src/App.tsx', code);
console.log("SurahReader fixed part 1");
