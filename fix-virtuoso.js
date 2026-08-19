import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('react-virtuoso')) {
   content = content.replace(/from 'lucide-react';/, "from 'lucide-react';\nimport { Virtuoso } from 'react-virtuoso';");
}

const oldRender = `      <div className="flex-1 overflow-y-auto">
        {loading || !data ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-6 space-y-12 pb-32">
            <div className="text-center mb-16 pt-8">
              <h2 className="text-5xl font-bold mb-4 leading-tight text-emerald-950 dark:text-emerald-50">{data.metadata.name}</h2>
              <div className="text-xl font-semibold text-stone-500 dark:text-stone-400">
                {data.metadata.englishNameTranslation}
              </div>
              <div className="mt-8 py-2.5 px-6 bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] rounded-full inline-block font-bold text-sm tracking-widest uppercase shadow-sm">
                {t('ayahs')} {data.metadata.numberOfAyahs}
              </div>
            </div>

            <div className="space-y-0">
              {(data?.arabic || []).map((ayah, idx) => (
                <div key={ayah?.number || idx} className="pt-10 pb-6">
                  <div className="flex flex-col gap-10 items-center text-center">
                    <div 
                      className="text-4xl md:text-[44px] leading-[3.5rem] md:leading-[4.5rem] font-medium font-arabic text-emerald-950 dark:text-emerald-50 px-4 md:px-12" 
                      dir="rtl"
                    >
                      <ColorizedArabic text={ayah?.text} />
                    </div>
                    
                    <div className="text-xl md:text-2xl font-medium text-stone-500 dark:text-stone-400 leading-relaxed max-w-3xl px-6 md:px-12">
                      {data?.translation?.[idx]?.text}
                    </div>
                  </div>
                  
                  {idx < (data?.arabic?.length || 0) - 1 && (
                    <div className="flex items-center justify-center gap-6 mt-16 mb-4 opacity-80">
                      <div className="h-[1px] flex-1 max-w-[80px] bg-stone-200 dark:bg-stone-800 rounded-full" />
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-stone-100 dark:bg-[#2A2928] rounded-full font-bold text-lg text-emerald-800 dark:text-emerald-200">
                        {ayah?.numberInSurah}
                      </div>
                      <div className="h-[1px] flex-1 max-w-[80px] bg-stone-200 dark:bg-stone-800 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>`;

const regex = /<div className="flex-1 overflow-y-auto">[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/;

const newRender = `      <div className="flex-1">
        {loading || !data ? (
          <div className="flex justify-center py-32 h-full items-center">
            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
          </div>
        ) : (
          <Virtuoso
            style={{ height: '100%', width: '100%' }}
            totalCount={data?.arabic?.length || 0}
            overscan={400}
            components={{
              Header: () => (
                <div className="max-w-2xl mx-auto p-6 pt-8 mb-4">
                  <div className="text-center">
                    <h2 className="text-5xl font-bold mb-4 leading-tight text-emerald-950 dark:text-emerald-50">{data.metadata.name}</h2>
                    <div className="text-xl font-semibold text-stone-500 dark:text-stone-400">
                      {data.metadata.englishNameTranslation}
                    </div>
                    <div className="mt-8 py-2.5 px-6 bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] rounded-full inline-block font-bold text-sm tracking-widest uppercase shadow-sm">
                      {t('ayahs')} {data.metadata.numberOfAyahs}
                    </div>
                  </div>
                </div>
              ),
              Footer: () => (
                <div className="h-32 w-full" />
              )
            }}
            itemContent={(idx) => {
              const ayah = data.arabic[idx];
              return (
                <div className="max-w-2xl mx-auto px-6">
                  <div className="pt-10 pb-6">
                    <div className="flex flex-col gap-10 items-center text-center">
                      <div 
                        className="text-4xl md:text-[44px] leading-[3.5rem] md:leading-[4.5rem] font-medium font-arabic text-emerald-950 dark:text-emerald-50 px-4 md:px-12" 
                        dir="rtl"
                      >
                        <ColorizedArabic text={ayah?.text} />
                      </div>
                      
                      <div className="text-xl md:text-2xl font-medium text-stone-500 dark:text-stone-400 leading-relaxed max-w-3xl px-6 md:px-12">
                        {data?.translation?.[idx]?.text}
                      </div>
                    </div>
                    
                    {idx < (data.arabic.length) - 1 && (
                      <div className="flex items-center justify-center gap-6 mt-16 mb-4 opacity-80">
                        <div className="h-[1px] flex-1 max-w-[80px] bg-stone-200 dark:bg-stone-800 rounded-full" />
                        <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-stone-100 dark:bg-[#2A2928] rounded-full font-bold text-lg text-emerald-800 dark:text-emerald-200">
                          {ayah?.numberInSurah}
                        </div>
                        <div className="h-[1px] flex-1 max-w-[80px] bg-stone-200 dark:bg-stone-800 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}`;

content = content.replace(regex, newRender);
fs.writeFileSync('src/App.tsx', content);
