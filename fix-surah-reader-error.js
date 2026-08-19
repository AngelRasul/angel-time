import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add error state
code = code.replace(
  'const [loading, setLoading] = useState(true);',
  'const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(false);'
);

// Set error state on failure
code = code.replace(
  '          } else {\n            if (isMounted) setLoading(false);\n          }',
  '          } else {\n            if (isMounted) {\n              setLoading(false);\n              setError(true);\n            }\n          }'
);

code = code.replace(
  '      .catch(() => {\n        if (isMounted) setLoading(false);\n      });',
  '      .catch(() => {\n        if (isMounted) {\n          setLoading(false);\n          setError(true);\n        }\n      });'
);

// Show error state in UI
const originalLoadingUI = `{loading || !data ? (
          <div className="flex flex-col justify-center items-center py-40 h-full gap-8">
            <div className="relative w-16 h-16">
              <svg className="animate-spin w-full h-full text-emerald-500" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeDasharray="90, 150"></circle>
              </svg>
            </div>
          </div>
        ) : (`;

const newLoadingUI = `{loading ? (
          <div className="flex flex-col justify-center items-center py-40 h-full gap-8">
            <div className="relative w-16 h-16">
              <svg className="animate-spin w-full h-full text-emerald-500" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeDasharray="90, 150"></circle>
              </svg>
            </div>
          </div>
        ) : error || !data ? (
          <div className="flex flex-col justify-center items-center py-40 h-full gap-4 text-center px-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">{t('loadingError') || 'Failed to load'}</h3>
            <p className="text-stone-500 dark:text-stone-400">Could not load the Surah. Please check your connection and try again.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-stone-200 dark:bg-stone-800 rounded-full font-semibold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors">
              Close
            </button>
          </div>
        ) : (`;

code = code.replace(originalLoadingUI, newLoadingUI);

fs.writeFileSync('src/App.tsx', code);
console.log("Added error state to SurahReader");
