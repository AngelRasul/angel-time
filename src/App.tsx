import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Globe, Moon, Sunrise, Sun, Sunset, MoonStar, Settings, Search, ChevronLeft, Flame, BookOpen, Clock, MapPin, Loader2, Check, SunMedium, CloudSun, Compass, BookText, CloudMoon, Eclipse, Aperture, Bell, BellOff } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';


// --- Utils ---
const triggerHaptic = () => { 
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(40);
  }
};

// --- API Helpers ---

const fetchGeocoding = async (query: string) => {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ru`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
};

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPrayerMethod = (country: string) => {
  const c = country.toLowerCase();
  if (c.includes('россия') || c.includes('russia')) return 14; // DUM RF
  if (c.includes('turkey') || c.includes('турция')) return 13;
  if (c.includes('egypt') || c.includes('египет')) return 5;
  if (c.includes('saudi') || c.includes('саудовская')) return 4;
  if (c.includes('united arab emirates') || c.includes('оаэ')) return 8;
  if (c.includes('kuwait') || c.includes('кувейт')) return 9;
  if (c.includes('qatar') || c.includes('катар')) return 10;
  if (c.includes('singapore') || c.includes('сингапур')) return 11;
  if (c.includes('france') || c.includes('франция')) return 12;
  if (c.includes('malaysia') || c.includes('малайзия')) return 17;
  // CIS Countries (MWL)
  if (c.includes('казахстан') || c.includes('kazakhstan') || c.includes('узбекистан') || c.includes('uzbekistan') || c.includes('киргизия') || c.includes('kyrgyzstan') || c.includes('таджикистан') || c.includes('tajikistan') || c.includes('туркменистан') || c.includes('turkmenistan') || c.includes('азербайджан') || c.includes('azerbaijan')) return 3;
  // North America (ISNA)
  if (c.includes('usa') || c.includes('сша') || c.includes('canada') || c.includes('канада')) return 2;
  return 3; // MWL as default for Europe/others
};

const fetchPrayerTimes = async (lat: number, lng: number, country: string) => {
  try {
    const method = getPrayerMethod(country);
    const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return { data: json?.data };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchSurahsList = async () => {
  const url = 'https://api.alquran.cloud/v1/surah';
  try {
    if ('caches' in window) {
       const cache = await caches.open('angeltime-quran-cache');
       const cachedRes = await cache.match(url);
       if (cachedRes) return await cachedRes.json();
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if ('caches' in window) {
       const cache = await caches.open('angeltime-quran-cache');
       cache.put(url, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));
    }
    return data;
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
};

import { I18N, LangType, LANGUAGES } from './i18n';

const fetchSurahContent = async (id: number, lang: LangType, signal?: AbortSignal) => {
  const editionMap: Record<string, string> = {
    ru: 'ru.kuliev', en: 'en.asad', es: 'es.cortes', fr: 'fr.hamidullah', de: 'de.aburida',
    zh: 'zh.jian', ja: 'ja.japanese', pt: 'pt.elhayek', it: 'it.piccardo', tr: 'tr.yazir',
    ko: 'ko.korean', hi: 'hi.farooq', nl: 'nl.keyzer', pl: 'pl.bielawskiego', id: 'id.indonesian',
    th: 'th.thai', vi: 'vi.hassan', fa: 'fa.makarem',
  };
  const edition = editionMap[lang] || 'en.asad';
  const url = `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,${edition}`;
  
  try {
    if ('caches' in window) {
       const cache = await caches.open('angeltime-quran-cache');
       const cachedRes = await cache.match(url);
       if (cachedRes) return await cachedRes.json();
    }
    
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    
    if ('caches' in window && data && data.data) {
       try {
         const cache = await caches.open('angeltime-quran-cache');
         cache.put(url, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));
       } catch (e) {
         console.warn('Cache error:', e);
       }
    }
    return data;
  } catch (error) {
    if (error.name !== 'AbortError') console.error(error);
    return { data: [] };
  }
};

// --- Translations & I18n ---

const LanguageContext = React.createContext<{ 
  t: (key: keyof typeof I18N.en) => string, 
  lang: LangType,
  appLang: string, 
  setAppLang: (l: string) => void 
}>({ 
  t: (k) => I18N.en[k], 
  lang: 'en',
  appLang: 'auto',
  setAppLang: () => {} 
});

function useTranslation() {
  return React.useContext(LanguageContext);
}

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<any, any> {
  public state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-black dark:text-white p-4 transition-colors duration-300">
          <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Что-то пошло не так</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{(this.state.error as any)?.message || 'Произошла непредвиденная ошибка.'}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm tracking-wide transition-opacity hover:opacity-80">
              Перезагрузить приложение
            </button>
          </div>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

// --- Components ---

const Switch = ({ checked, onChange, activeTrackClass = 'bg-emerald-100 border-emerald-100 dark:bg-emerald-500/20 dark:border-transparent', activeKnobClass = 'bg-emerald-500 dark:bg-emerald-400' }: { checked: boolean; onChange: (v: boolean) => void; activeTrackClass?: string; activeKnobClass?: string }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      triggerHaptic();
      onChange(!checked);
    }}
    className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 border-2 shrink-0 ${
      checked 
        ? activeTrackClass 
        : 'bg-stone-200 border-stone-200 dark:bg-stone-700 dark:border-stone-700'
    }`}
  >
    <div
      className={`w-5 h-5 rounded-full shadow-sm transition-all duration-300 ${
        checked 
          ? `translate-x-6 ${activeKnobClass}` 
          : 'translate-x-0.5 bg-white dark:bg-stone-400'
      }`}
    />
  </button>
);

export default function App() {
  const [appLang, setAppLang] = useState('auto');

  useEffect(() => {
    const savedLang = localStorage.getItem('angelTimeAppLanguage');
    if (savedLang) setAppLang(savedLang);
  }, []);

  const handleSetAppLang = (l: string) => {
    setAppLang(l);
    localStorage.setItem('angelTimeAppLanguage', l);
  };

  const getActiveLanguage = (): LangType => {
    if (appLang !== 'auto' && LANGUAGES.includes(appLang as LangType)) {
      return appLang as LangType;
    }
    const sysLang = (navigator?.language?.split('-')[0] || 'ru').toLowerCase();
    return LANGUAGES.includes(sysLang as LangType) ? (sysLang as LangType) : 'en';
  };

  const activeLang = getActiveLanguage();
  const t = (key: keyof typeof I18N.en) => (I18N as any)[activeLang]?.[key] || I18N.en[key] || key;

  return (
    <ErrorBoundary>
      <LanguageContext.Provider value={{ t, lang: activeLang, appLang, setAppLang: handleSetAppLang }}>
        <AppContent />
      </LanguageContext.Provider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { t } = useTranslation();
  // Global State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [timeFormat, setTimeFormat] = useState<'24h' | '12h'>('24h');
  const [location, setLocation] = useState<{city: string, country: string, lat: number, lng: number} | null>(null);
  const [tab, setTab] = useState<'prayers' | 'quran'>('prayers');
  const [screen, setScreen] = useState<'main' | 'location' | 'settings'>('main');
  const [streak, setStreak] = useState(0);
  const [lastReadDate, setLastReadDate] = useState('');

  // Quran Global State
  const [surahs, setSurahs] = useState<any[]>([]);
  const [surahsLoading, setSurahsLoading] = useState(true);

  // Prayer Timings Global State
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [timingsLoading, setTimingsLoading] = useState(true);
  const [timingsError, setTimingsError] = useState<string | null>(null);

  // Initialize from LocalStorage and Fetch Surahs
  useEffect(() => {
    const savedTheme = localStorage.getItem('angelTimeTheme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
    
    const savedTimeFormat = localStorage.getItem('angelTimeFormat') as '12h' | '24h' | null;
    if (savedTimeFormat) setTimeFormat(savedTimeFormat);
    
    const savedLocation = localStorage.getItem('angelTimeLocation');
    if (savedLocation) { try { setLocation(JSON.parse(savedLocation)); } catch (e) { localStorage.removeItem("angelTimeLocation"); } }

    const savedStreak = parseInt(localStorage.getItem('angelTimeStreak') || '0', 10);
    const savedLastDate = localStorage.getItem('angelTimeLastReadDate') || '';
    
    let currentStreak = savedStreak;
    let currentLastDate = savedLastDate;
    
    if (!currentLastDate) {
      const oldDataStr = localStorage.getItem('angelTimeStreakData');
      if (oldDataStr) {
        try {
          const oldData = JSON.parse(oldDataStr);
          currentStreak = oldData.count || 0;
          currentLastDate = oldData.lastDate || '';
          localStorage.setItem('angelTimeStreak', currentStreak.toString());
          localStorage.setItem('angelTimeLastReadDate', currentLastDate);
          localStorage.removeItem('angelTimeStreakData');
        } catch(e) {}
      }
    }

    const today = getLocalDateString();
    
    if (currentLastDate) {
       const lastDateObj = new Date(currentLastDate);
       const todayObj = new Date(today);
       const diffTime = todayObj.getTime() - lastDateObj.getTime();
       const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
       
       if (diffDays > 1) {
          currentStreak = 0;
          localStorage.setItem('angelTimeStreak', '0');
       }
    }
    
    setStreak(currentStreak);
    setLastReadDate(currentLastDate);

    fetchSurahsList()
      .then(res => {
        setSurahs(res.data);
        setSurahsLoading(false);
      })
      .catch(() => setSurahsLoading(false));
  }, []);

  // Fetch Timings when location changes
  useEffect(() => {
    let isMounted = true;
    if (!location) {
      setTimingsLoading(false);
      return;
    }
    setTimingsLoading(true);
    setTimingsError(null);
    fetchPrayerTimes(location.lat, location.lng, location.country)
      .then(res => {
        if (isMounted) {
          if (res && res.data && res.data.timings) {
             const cleanTimings: Record<string, string> = {};
             for (const [k, v] of Object.entries(res.data.timings)) {
                cleanTimings[k] = (v as string).split(' ')[0];
             }
             setTimings(cleanTimings);
          } else {
             setTimingsError(t('loadingError'));
          }
          setTimingsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setTimingsError(t('loadingError'));
          setTimingsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [location?.lat, location?.lng, location?.country]);

  // Update Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('angelTimeTheme', theme);
  }, [theme]);

  // Update Streak
  useEffect(() => {
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
  }, []);

  const incrementStreak = useCallback(() => {
    setLastReadDate(prevLastDate => {
      setStreak(prevStreak => {
         const today = getLocalDateString();
         if (prevLastDate === today) return prevStreak;
         
         let newStreak = prevStreak;
         if (prevLastDate) {
            const lastDateObj = new Date(prevLastDate);
            const todayObj = new Date(today);
            const diffTime = todayObj.getTime() - lastDateObj.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
               newStreak += 1;
            } else if (diffDays > 1) {
               newStreak = 1;
            }
         } else {
            newStreak = 1;
         }
         
         localStorage.setItem('angelTimeStreak', newStreak.toString());
         localStorage.setItem('angelTimeLastReadDate', today);
         return newStreak;
      });
      return getLocalDateString();
    });
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#F6F8F5] dark:bg-[#1C1B1A] text-[#1C1B1A] dark:text-[#E8E6E3] transition-colors duration-300 font-sans selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100">
        {screen === 'main' && (
          <>
            <header className="sticky top-0 z-30 bg-[#F6F8F5]/80 dark:bg-[#1C1B1A]/80 backdrop-blur-xl flex items-center justify-between px-6 pt-6 pb-1 transition-colors duration-300">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Angel Time</h1>
                <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5 font-medium">by Ataev Rasul</span>
              </div>
              <button 
                onClick={() => setScreen('settings')} 
                className="p-3 bg-white dark:bg-[#2A2928] rounded-[20px] hover:shadow-md active:scale-95 transition-all duration-200 border border-stone-100 dark:border-stone-800 shadow-sm"
              >
                <Settings className="w-6 h-6 text-[#2A5934] dark:text-[#A8E5BA]" strokeWidth={2} />
              </button>
            </header>

            <main className="max-w-2xl mx-auto px-4 pb-[100px] pt-0">
              {tab === 'prayers' && (
                <PrayerScreen 
                  location={location} 
                  timings={timings}
                  timingsLoading={timingsLoading}
                  timingsError={timingsError}
                  timeFormat={timeFormat}
                  onOpenLocation={() => setScreen('location')} 
                />
              )}
              {tab === 'quran' && (
                <QuranScreen streak={streak} onReadSurah={incrementStreak} surahs={surahs} loading={surahsLoading} />
              )}
            </main>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[300px] px-4">
              <div className="bg-white/90 dark:bg-[#1E1E1E]/90 rounded-full p-2 flex justify-between shadow-sm border border-stone-100 dark:border-[#3A3938] backdrop-blur-2xl">
                <button 
                  onClick={() => {
                    triggerHaptic();
                    setTab('prayers');
                  }} 
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-full transition-all duration-300 ${
                    tab === 'prayers' 
                      ? 'bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] font-semibold' 
                      : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 bg-transparent font-medium'
                  }`}
                >
                  <Clock className="w-5 h-5" strokeWidth={tab === 'prayers' ? 2.5 : 2} />
                  <span className="text-sm tracking-wide">{t('prayers')}</span>
                </button>
                <button 
                  onClick={() => {
                    triggerHaptic();
                    setTab('quran');
                  }} 
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-full transition-all duration-300 ${
                    tab === 'quran' 
                      ? 'bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] font-semibold' 
                      : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 bg-transparent font-medium'
                  }`}
                >
                  <BookOpen className="w-5 h-5" strokeWidth={tab === 'quran' ? 2.5 : 2} />
                  <span className="text-sm tracking-wide">{t('quran')}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {screen === 'location' && (
          <LocationSearch 
            onClose={() => setScreen('main')} 
            onSelect={(loc) => {
              setLocation(loc);
              localStorage.setItem('angelTimeLocation', JSON.stringify(loc));
              setScreen('main');
            }} 
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen 
            theme={theme} 
            setTheme={setTheme} 
            timeFormat={timeFormat}
            setTimeFormat={(format) => {
              setTimeFormat(format);
              localStorage.setItem('angelTimeFormat', format);
            }}
            onClose={() => setScreen('main')} 
          />
        )}
      </div>
    </div>
  );
}

// --- Prayer Screen ---

const PRAYER_MAP = [
  { id: 'Fajr', name: 'Фаджр', icon: Moon, colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300', switchTrack: 'bg-blue-100 border-blue-100 dark:bg-blue-500/20 dark:border-transparent', switchKnob: 'bg-blue-500 dark:bg-blue-400' },
  { id: 'Sunrise', name: 'Восход', icon: Sunrise, colorClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300', switchTrack: 'bg-orange-100 border-orange-100 dark:bg-orange-500/20 dark:border-transparent', switchKnob: 'bg-orange-500 dark:bg-orange-400' },
  { id: 'Dhuhr', name: 'Зухр', icon: Sun, colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300', switchTrack: 'bg-amber-100 border-amber-100 dark:bg-amber-500/20 dark:border-transparent', switchKnob: 'bg-amber-500 dark:bg-amber-400' },
  { id: 'Asr', name: 'Аср', icon: CloudSun, colorClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300', switchTrack: 'bg-cyan-100 border-cyan-100 dark:bg-cyan-500/20 dark:border-transparent', switchKnob: 'bg-cyan-500 dark:bg-cyan-400' },
  { id: 'Maghrib', name: 'Магриб', icon: Sunset, colorClass: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300', switchTrack: 'bg-rose-100 border-rose-100 dark:bg-rose-500/20 dark:border-transparent', switchKnob: 'bg-rose-500 dark:bg-rose-400' },
  { id: 'Isha', name: 'Иша', icon: MoonStar, colorClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300', switchTrack: 'bg-indigo-100 border-indigo-100 dark:bg-indigo-500/20 dark:border-transparent', switchKnob: 'bg-indigo-500 dark:bg-indigo-400' },
];

function PrayerScreen({ location, timings, timingsLoading, timingsError, timeFormat, onOpenLocation }: { 
  location: { city: string, country: string, lat: number, lng: number } | null, 
  timings: Record<string, string> | null,
  timingsLoading: boolean,
  timingsError: string | null,
  timeFormat: '12h' | '24h',
  onOpenLocation: () => void 
}) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('angelTimeNotifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('angelTimeNotifications');
      }
    }
    return {
      Fajr: false, Sunrise: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false
    };
  });

  useEffect(() => {
    localStorage.setItem('angelTimeNotifications', JSON.stringify(notifications));
  }, [notifications]);
  
  const [nextPrayer, setNextPrayer] = useState<{id: string, diff: string, hours: number, mins: number, secs: number} | null>(null);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    if (timeFormat === '24h') return timeStr;
    
    const [hours, mins] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  const lastNotified = useRef<Record<string, number>>({});
  
  // Calculate Next Prayer and Countdown
  useEffect(() => {
    if (!timings) return;

    const calculate = () => {
      const now = new Date();
      let nextP = null;
      let minDiff = Infinity;

      for (const p of PRAYER_MAP) {
        if (p.id === 'Sunrise') continue;
        const timeStr = timings[p.id];
        if (!timeStr) continue;
        
        const [hours, mins] = timeStr.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, mins, 0, 0);
        
        let diff = prayerTime.getTime() - now.getTime();
        
        if (diff < 0) {
          prayerTime.setDate(prayerTime.getDate() + 1);
          diff = prayerTime.getTime() - now.getTime();
        }

        if (diff < minDiff) {
          minDiff = diff;
          nextP = p.id;
        }
      }

      if (nextP) {
        const h = Math.floor((minDiff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((minDiff / 1000 / 60) % 60);
        const s = Math.floor((minDiff / 1000) % 60);
        
        const formattedDiff = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        setNextPrayer({ id: nextP, diff: formattedDiff, hours: h, mins: m, secs: s });
      }
    };

    calculate(); // Initial call
    const interval = setInterval(() => {
      calculate();
      
      // Notification trigger logic
      if ('Notification' in window && Notification.permission === 'granted') {
        const now = new Date();
        const PRAYER_TEXTS: Record<string, string> = {
          Fajr: "Намаз лучше сна",
          Sunrise: "Время восхода солнца",
          Dhuhr: "Время полуденной молитвы. Пусть Аллах примет ваш намаз",
          Asr: "Время послеполуденной молитвы. Отвлекитесь от мирского",
          Maghrib: "Время вечерней молитвы. Завершите день с благодарностью",
          Isha: "Время ночной молитвы. Мир вам и покой"
        };
        
        PRAYER_MAP.forEach(p => {
          if (notifications[p.id]) {
            const timeStr = timings[p.id];
            if (!timeStr) return;
            const [hours, mins] = timeStr.split(':').map(Number);
            
            // If current time exactly matches prayer minute
            if (now.getHours() === hours && now.getMinutes() === mins) {
              const dayStr = now.toDateString();
              const key = p.id + '-' + dayStr;
              
              if (!lastNotified.current[key]) {
                lastNotified.current[key] = now.getTime();
                
                // Show notification
                const title = p.label;
                const body = PRAYER_TEXTS[p.id] || "Время намаза";
                
                try {
                  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(registration => {
                      registration.showNotification(title, {
                        body,
                        icon: '/vite.svg',
                        badge: '/vite.svg',
                        vibrate: [200, 100, 200]
                      });
                    });
                  } else {
                    new Notification(title, { body, icon: '/vite.svg' });
                  }
                } catch (e) {
                  new Notification(title, { body, icon: '/vite.svg' });
                }
              }
            }
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timings, notifications]);

  if (!location) {
    return (
      <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
        <div className="w-24 h-24 bg-[#E8F3E8] dark:bg-[#1C3A27] text-[#2A5934] dark:text-[#A8E5BA] rounded-[32px] flex items-center justify-center mb-6 shadow-sm">
          <MapPin className="w-10 h-10" strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl font-bold mb-6 tracking-tight">{t('welcome')}</h2>
        <button 
          onClick={() => {
            triggerHaptic();
            onOpenLocation();
          }}
          className="px-8 py-4 bg-[#E8F3E8] dark:bg-[#1C3A27] text-[#2A5934] dark:text-[#A8E5BA] rounded-[28px] font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          {t('chooseCity')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <button 
        onClick={() => {
          triggerHaptic();
          onOpenLocation();
        }}
        className="w-full flex items-center gap-4 bg-white dark:bg-[#1E1E1E] shadow-sm border border-stone-100 dark:border-[#3A3938] rounded-[32px] p-4 mb-4 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
      >
        <div className="p-3 bg-[#E8F3E8] dark:bg-[#1C3A27] rounded-2xl shrink-0">
          <MapPin className="w-5 h-5 text-[#2A5934] dark:text-[#A8E5BA]" strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-left min-w-0 pr-4">
          <div className="font-bold text-lg tracking-tight truncate text-[#1C1B1A] dark:text-[#E8E6E3]">
            {location.city}
          </div>
          <div className="text-sm font-semibold text-stone-500 dark:text-stone-400 truncate">
            {location.country}
          </div>
        </div>
      </button>

      {timingsError ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl p-6 mb-6 text-center font-medium">
          {timingsError}
        </div>
      ) : (
        <div className="bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7] shadow-sm rounded-[40px] p-8 mb-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] mb-6 opacity-60">
            {t('untilNextPrayer')}
          </h2>
          <div className="text-3xl font-bold mb-3 tracking-tight h-9 flex items-center justify-center">
            {nextPrayer ? t(nextPrayer.id as any) : timings ? '...' : <div className="h-8 w-24 bg-emerald-200 dark:bg-emerald-800 rounded-lg animate-pulse" />}
          </div>
          <div className="text-7xl sm:text-[5rem] leading-none font-bold tracking-tighter tabular-nums mb-4 h-[72px] sm:h-[80px] flex items-center justify-center">
            {nextPrayer ? nextPrayer.diff : timings ? '00:00:00' : <div className="h-16 w-48 bg-emerald-200 dark:bg-emerald-800 rounded-xl animate-pulse" />}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-60">
            {t('timeLeft')}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {PRAYER_MAP.map(prayer => (
          <div key={prayer.id} className="flex items-center justify-between p-5 bg-white dark:bg-[#1E1E1E] shadow-sm border border-stone-100 dark:border-[#3A3938] rounded-[32px] transition-all duration-200 active:scale-[0.98]">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-[24px] ${prayer.colorClass}`}>
                <prayer.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-bold text-xl tracking-tight mb-1">{t(prayer.id as any)}</div>
                <div className="font-semibold text-base text-stone-500 dark:text-stone-400">
                  {timingsError ? '--:--' : timings ? formatTime(timings[prayer.id]) : <div className="h-5 w-14 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />}
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                triggerHaptic();
                if ('Notification' in window) {
                    if (Notification.permission === 'default') {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          setNotifications(prev => ({ ...prev, [prayer.id]: !prev[prayer.id] }));
                        }
                      });
                    } else if (Notification.permission === 'granted') {
                      setNotifications(prev => ({ ...prev, [prayer.id]: !prev[prayer.id] }));
                    } else {
                      alert(t('notificationBlocked') || "Пожалуйста, разрешите уведомления в настройках браузера.");
                    }
                  } else {
                    alert("Уведомления не поддерживаются вашим устройством/браузером.");
                  }
              }}
              className={`p-3 rounded-full transition-colors ${notifications[prayer.id] ? prayer.colorClass : 'text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              {notifications[prayer.id] ? (
                 <Bell className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                 <BellOff className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Quran Screen ---

interface SurahType {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

const RU_SURAH_NAMES = [
  "Открывающая Коран", "Корова", "Семейство Имрана", "Женщины", "Трапеза",
  "Скот", "Преграды", "Трофеи", "Покаяние", "Иона", "Худ", "Иосиф", "Гром",
  "Авраам", "Хиджр", "Пчелы", "Ночной перенос", "Пещера", "Мария", "Та Ха",
  "Пророки", "Паломничество", "Верующие", "Свет", "Различение", "Поэты", "Муравьи",
  "Рассказ", "Паук", "Римляне", "Лукман", "Поклон", "Сонмы", "Сава", "Творец",
  "Йа Син", "Выстроившиеся в ряды", "Сад", "Толпы", "Прощающий", "Разъяснены",
  "Совет", "Украшения", "Дым", "Коленопреклоненные", "Барханы", "Мухаммад", "Победа",
  "Комнаты", "Каф", "Рассеивающие", "Гора", "Звезда", "Месяц", "Милостивый", "Падающее",
  "Железо", "Препирающаяся", "Сбор", "Испытуемая", "Ряды", "Собрание", "Лицемеры",
  "Взаимное обделение", "Развод", "Запрещение", "Власть", "Письменная трость", "Неминуемое",
  "Ступени", "Ной", "Джинны", "Закутавшийся", "Завернувшийся", "Воскресение", "Человек",
  "Посылаемые", "Весть", "Исторгающие", "Нахмурился", "Скручивание", "Раскалывание",
  "Обвешивающие", "Разверзнется", "Созвездия", "Ночной путник", "Всевышний", "Покрывающее",
  "Заря", "Город", "Солнце", "Ночь", "Утро", "Раскрытие", "Смоковница", "Сгусток",
  "Предопределение", "Ясное знамение", "Землетрясение", "Мчащиеся", "Великое бедствие",
  "Приумножение", "Предвечернее время", "Хулитель", "Слон", "Курайшиты", "Подаяние",
  "Обилие", "Неверующие", "Помощь", "Пальмовые волокна", "Очищение веры", "Рассвет", "Люди"
];

const QuranScreen = React.memo(function QuranScreen({ streak, onReadSurah, surahs, loading }: { streak: number; onReadSurah: () => void; surahs: SurahType[]; loading: boolean }) {
  const { t, lang } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [lastReadSurah, setLastReadSurah] = useState<number | null>(() => {
    const saved = localStorage.getItem('lastReadSurah');
    return saved ? parseInt(saved, 10) : null;
  });

  const handleCloseSurah = useCallback(() => setActiveSurah(null), []);
  const handleOpenSurah = (surahNumber: number) => {
    triggerHaptic();
    setActiveSurah(surahNumber);
    setLastReadSurah(surahNumber);
    localStorage.setItem('lastReadSurah', surahNumber.toString());
  };

  const isRu = lang === 'ru';
  const safeSurahs = Array.isArray(surahs) ? surahs : [];

  const filteredSurahs = safeSurahs.filter(s => {
    if (!s || !s.number) return false;
    const ruName = RU_SURAH_NAMES[s.number - 1] || '';
    return s.englishNameTranslation?.toLowerCase().includes(search.toLowerCase()) || 
           s.englishName?.toLowerCase().includes(search.toLowerCase()) ||
           (isRu && ruName.toLowerCase().includes(search.toLowerCase())) ||
           s.number.toString() === search;
  });

  const SURAH_COLOR = 'bg-[#D0E8D7] text-[#0F381D] dark:bg-[#204E2F] dark:text-[#D0E8D7]';

  return (
    <div className="animate-in fade-in duration-500 pb-[22px]">

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

      <div 
        onClick={() => { triggerHaptic(); setShowStreakModal(true); }}
        className="flex items-center justify-between bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-100 rounded-3xl px-5 py-4 mb-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
      >
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">{t('streakTitle')}</span>
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'opacity-30'}`} strokeWidth={2.5} /> 
          {streak} {streak === 1 ? t('streakDay1') : streak > 1 && streak < 5 ? t('streakDay2') : t('streakDay5')}
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-[#F6F8F5] dark:bg-[#1C1B1A] pt-1 pb-3 -mx-4 px-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder={t('searchSurahDesc')} 
            className="w-full pl-12 pr-5 py-3.5 bg-stone-100 dark:bg-[#2A2928] rounded-full font-semibold outline-none text-base placeholder:text-stone-400"
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {lastReadSurah && safeSurahs.length > 0 && !loading && !search && (
        <button 
          onClick={() => handleOpenSurah(lastReadSurah)}
          className={`w-full mb-4 flex items-center justify-between rounded-[32px] p-5 text-left active:scale-[0.98] transition-all duration-200 shadow-sm hover:opacity-80 ${SURAH_COLOR}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-white/40 dark:bg-black/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{t('continueReading')}</div>
              <div className="font-bold text-lg leading-tight">
                {safeSurahs.find(s => s.number === lastReadSurah)?.englishName || `${t('surahPrefix')} ${lastReadSurah}`}
              </div>
            </div>
          </div>
          <ChevronLeft className="w-6 h-6 opacity-50 rotate-180 shrink-0" />
        </button>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#2A2928] rounded-[32px] overflow-hidden shadow-sm border border-stone-100 dark:border-stone-800/50">
          {filteredSurahs.map((surah, index) => {
            const colorClass = SURAH_COLOR;
            return (
            <button 
              key={surah.number} 
              onClick={() => handleOpenSurah(surah.number)} 
              className={`w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 dark:hover:bg-[#302F2E] transition-colors duration-200 active:bg-stone-100 dark:active:bg-stone-800 ${
                index !== filteredSurahs.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-sm font-bold ${colorClass}`}>
                  {surah.number}
                </div>
                <div>
                  <div className="font-bold text-base tracking-tight mb-0.5">{surah.englishName}</div>
                  <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {isRu && RU_SURAH_NAMES[surah.number - 1] ? RU_SURAH_NAMES[surah.number - 1] : surah.englishNameTranslation}
                  </div>
                </div>
              </div>
              <div className="font-bold text-xl text-right leading-relaxed font-arabic" dir="rtl">{surah.name}</div>
            </button>
            );
          })}
        </div>
      )}

      {activeSurah && (
        <SurahReader 
          surahId={activeSurah} 
          onClose={handleCloseSurah} 
          onReadSurah={onReadSurah}
        />
      )}
    </div>
  );
});

// --- Colorized Arabic Helper ---

function ColorizedArabic({ text }: { text: string }) {
  // Split the text to isolate Arabic diacritics (harakat/tashkeel)
  const parts = text.split(/([\u064B-\u065F\u0670\u06D6-\u06ED]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(part)) {
          return <span key={i} className="text-amber-600 dark:text-amber-400 opacity-90">{part}</span>;
        }
        return <span key={i} className="text-[#0F381D] dark:text-emerald-50">{part}</span>;
      })}
    </>
  );
}

// --- Surah Reader Screen ---

const SurahReader = React.memo(function SurahReader({ surahId, onClose, onReadSurah }: { surahId: number; onClose: () => void; onReadSurah: () => void }) {
  const { t, lang } = useTranslation();
  const [data, setData] = useState<{arabic: any[], translation: any[], metadata: any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setLoading(true);
    
    const fetchPromise = fetchSurahContent(surahId, lang, controller.signal);
    // Add artificial delay of 1.5 seconds for premium effect
    const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

    Promise.all([fetchPromise, delayPromise])
      .then(([res]) => {
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
            if (isMounted) {
              setLoading(false);
              setError(true);
            }
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
          setError(true);
        }
      });
    return () => { isMounted = false; controller.abort(); };
  }, [surahId, onReadSurah, lang]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F8F5] dark:bg-[#1C1B1A] text-[#1C1B1A] dark:text-[#E8E6E3] flex flex-col animate-in slide-in-from-bottom duration-300">
      <header className="sticky top-0 z-10 bg-[#F6F8F5]/90 dark:bg-[#1C1B1A]/90 backdrop-blur-xl flex items-center justify-between p-4 px-6 border-b border-stone-100 dark:border-[#3A3938] shrink-0">
        <button onClick={onClose} className="p-3 bg-stone-100 dark:bg-[#2A2928] rounded-full hover:bg-stone-200 dark:hover:bg-[#302F2E] transition-colors">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold tracking-tight ml-4 flex-1">
          {data ? data.metadata.englishName : t('loading')}
        </h1>
      </header>
      
            <div className="flex-1">
        {loading ? (
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
});

// --- Location Search Screen ---

function LocationSearch({ onClose, onSelect }: { onClose: () => void; onSelect: (loc: {city: string, country: string, lat: number, lng: number}) => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
        fetchGeocoding(query)
          .then(res => {
            const rawResults = Array.isArray(res?.results) ? res.results : [];
            const seen = new Set();
            const deduped = [];
            const invalidKeywords = ['улица', 'ул.', 'проспект', 'пер.', 'шоссе', 'дом'];

            for (const item of rawResults) {
              if (!item) continue;

              // Filter out streets and precise addresses
              if (item.road || item.house_number || item.pedestrian) continue;
              const nameLower = (item.name || '').toLowerCase();
              if (invalidKeywords.some(kw => nameLower.includes(kw))) continue;

              const key = `${item.name}-${item.admin1}-${item.country}`;
              if (!seen.has(key)) {
                seen.add(key);
                deduped.push(item);
              }
            }
            setResults(deduped);
            setLoading(false);
          })
        .catch(() => {
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F8F5] dark:bg-[#1C1B1A] text-[#1C1B1A] dark:text-[#E8E6E3] flex flex-col animate-in slide-in-from-bottom duration-300">
      <header className="flex items-center p-4 px-6 border-b border-stone-100 dark:border-[#3A3938] shrink-0 bg-white/50 dark:bg-[#2A2928]/50 backdrop-blur-md">
        <button onClick={onClose} className="p-3 bg-stone-100 dark:bg-[#2A2928] rounded-full hover:bg-stone-200 dark:hover:bg-[#302F2E] transition-colors">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold tracking-tight ml-4">{t('searchLocation')}</h1>
      </header>
      
      <div className="p-6 shrink-0">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" strokeWidth={2.5} />
          <input 
            type="text" 
            autoFocus
            placeholder={t('enterCity')} 
            className="w-full pl-16 pr-6 py-5 bg-white dark:bg-[#2A2928] border border-stone-100 dark:border-[#3A3938] rounded-full font-semibold outline-none text-lg placeholder:text-stone-400 shadow-sm"
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        {loading && (
          <div className="flex justify-center py-10">
             <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
          </div>
        )}
        
        {!loading && results.length === 0 && query.trim().length >= 2 && (
          <div className="text-center py-10 text-stone-500 font-medium">{t('nothingFound')}</div>
        )}

        {!loading && results.map((item: any) => (
          <button 
            key={item.id} 
            onClick={() => {
              triggerHaptic();
              onSelect({
                city: item.name, 
                country: item.admin1 ? `${item.admin1}, ${item.country}` : item.country || '',
                lat: item.latitude,
                lng: item.longitude
              });
            }}
            className="w-full text-left p-6 bg-white dark:bg-[#2A2928] border border-stone-100 dark:border-[#3A3938] rounded-3xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors duration-200 flex flex-col shadow-sm active:scale-[0.98]"
          >
            <span className="font-bold text-xl tracking-tight mb-1">{item.name}</span>
            <span className="font-semibold text-stone-500 dark:text-stone-400">{item.admin1 ? item.admin1 : item.country}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Settings Screen ---

const getLanguageName = (code: string, displayLang: string) => {
  try {
    const displayName = new Intl.DisplayNames([displayLang], { type: 'language' }).of(code);
    return `${code} — ${displayName ? displayName.charAt(0).toUpperCase() + displayName.slice(1) : code.toUpperCase()}`;
  } catch (e) {
    return code.toUpperCase();
  }
};

function SettingsScreen({ theme, setTheme, timeFormat, setTimeFormat, onClose }: { theme: 'light' | 'dark', setTheme: (t: 'light' | 'dark') => void, timeFormat: '12h' | '24h', setTimeFormat: (f: '12h' | '24h') => void, onClose: () => void }) {
  const { t, lang, appLang, setAppLang } = useTranslation();
  const [showLang, setShowLang] = useState(false);

  const displayCode = appLang === 'auto' ? 'AUTO' : lang.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F8F5] dark:bg-[#1C1B1A] text-[#1C1B1A] dark:text-[#E8E6E3] flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center p-4 px-6 border-b border-stone-200 dark:border-stone-800 shrink-0 bg-white/50 dark:bg-black/50 backdrop-blur-md">
        <button onClick={onClose} className="p-3 bg-stone-100 dark:bg-[#2A2928] rounded-full hover:bg-stone-200 dark:hover:bg-[#302F2E] transition-colors">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold tracking-tight ml-4">{t('settings')}</h1>
      </header>
      
      <div className="p-6 max-w-2xl mx-auto w-full space-y-4 mt-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-5 p-5 bg-white dark:bg-[#2A2928] rounded-[32px] shadow-sm transition-all duration-200">
          <div className="p-4 bg-[#E8F3E8] dark:bg-[#1C3A27] rounded-[24px] text-[#2A5934] dark:text-[#A8E5BA] shrink-0">
            {theme === 'dark' ? <MoonStar className="w-7 h-7" strokeWidth={2} /> : <Sun className="w-7 h-7" strokeWidth={2} />}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-xl tracking-tight block mb-0.5 text-stone-800 dark:text-stone-100">{t('darkTheme')}</span>
            <span className="font-medium text-stone-500 dark:text-stone-400 text-sm block leading-snug">{theme === 'dark' ? t('turnOff') : t('turnOn')}</span>
          </div>
          <Switch checked={theme === 'dark'} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
        </div>

        <div className="flex items-center gap-5 p-5 bg-white dark:bg-[#2A2928] rounded-[32px] shadow-sm transition-all duration-200">
          <div className="p-4 bg-[#E8F3E8] dark:bg-[#1C3A27] rounded-[24px] text-[#2A5934] dark:text-[#A8E5BA] shrink-0">
            <Clock className="w-7 h-7" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-xl tracking-tight block mb-0.5 text-stone-800 dark:text-stone-100">{t('timeFormat') || '12-hour Format'}</span>
            <span className="font-medium text-stone-500 dark:text-stone-400 text-sm block leading-snug">{t('enable12hFormat') || 'Use AM/PM time format'}</span>
          </div>
          <Switch checked={timeFormat === '12h'} onChange={() => setTimeFormat(timeFormat === '24h' ? '12h' : '24h')} />
        </div>
        
        <button 
          onClick={() => {
            triggerHaptic();
            setShowLang(true);
          }}
          className="w-full flex items-center gap-5 p-5 bg-white dark:bg-[#2A2928] rounded-[32px] shadow-sm hover:bg-stone-50 dark:hover:bg-[#302F2E] transition-colors active:scale-[0.98] text-left"
        >
          <div className="p-4 bg-[#E8F3E8] dark:bg-[#1C3A27] rounded-[24px] text-[#2A5934] dark:text-[#A8E5BA] shrink-0">
            <Globe className="w-7 h-7" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-xl tracking-tight block mb-0.5 text-stone-800 dark:text-stone-100">{t('appLanguage')}</span>
            <span className="font-medium text-stone-500 dark:text-stone-400 text-sm block truncate">
              {appLang === 'auto' ? t('autoSelected') : t('manualSelected')}
            </span>
          </div>
          <div className="px-5 py-2.5 bg-[#F6F8F5] dark:bg-[#3A3938] rounded-[16px] font-bold tracking-widest text-stone-600 dark:text-stone-300 shadow-sm shrink-0">
            {displayCode}
          </div>
        </button>
      </div>

      {showLang && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowLang(false)} />
          <div className="relative bg-[#F6F8F5] dark:bg-[#1C1B1A] rounded-t-[40px] p-6 pb-6 animate-in slide-in-from-bottom border-t border-stone-200 dark:border-stone-800">
            <div className="w-12 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full mx-auto mb-8" />
            <h2 className="text-2xl font-bold mb-6 text-center">{t('chooseLang')}</h2>
            
            <div className="space-y-3 max-w-md mx-auto h-[60vh] overflow-y-auto pb-10">
              <button 
                onClick={() => {
                  triggerHaptic();
                  setAppLang('auto');
                  setShowLang(false);
                }}
                className={`w-full p-5 rounded-3xl font-bold text-lg flex items-center justify-between transition-colors border-2 ${appLang === 'auto' ? 'bg-emerald-100 text-emerald-900 border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-100' : 'bg-white dark:bg-[#2A2928] border-transparent'}`}
              >
                {t('resetAuto')}
                {appLang === 'auto' && <Check className="w-6 h-6" strokeWidth={3} />}
              </button>
              
              {LANGUAGES.map(lcode => (
                <button 
                  key={lcode}
                  onClick={() => {
                    triggerHaptic();
                    setAppLang(lcode);
                    setShowLang(false);
                  }}
                  className={`w-full p-5 rounded-3xl font-bold text-lg flex items-center justify-between transition-colors border-2 ${appLang === lcode ? 'bg-emerald-100 text-emerald-900 border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-100' : 'bg-white dark:bg-[#2A2928] border-transparent'}`}
                >
                  {getLanguageName(lcode, lang)}
                  {appLang === lcode && <Check className="w-6 h-6" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




