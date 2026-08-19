import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const TEXTS = {
  Fajr: "Намаз лучше сна",
  Sunrise: "Время восхода солнца",
  Dhuhr: "Время полуденной молитвы. Пусть Аллах примет ваш намаз",
  Asr: "Время послеполуденной молитвы. Отвлекитесь от мирского",
  Maghrib: "Время вечерней молитвы. Завершите день с благодарностью",
  Isha: "Время ночной молитвы. Мир вам и покой"
};

// 1. Add toggle function
const originalToggle = `setNotifications(prev => ({ ...prev, [prayer.id]: !prev[prayer.id] }));`;
const newToggle = `if ('Notification' in window) {
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
                  }`;
code = code.replace(originalToggle, newToggle);

// 2. Add last notified ref to useEffect
const originalCalculateRef = `  // Calculate Next Prayer and Countdown
  useEffect(() => {
    if (!timings) return;`;
const newCalculateRef = `  const lastNotified = useRef<Record<string, number>>({});
  
  // Calculate Next Prayer and Countdown
  useEffect(() => {
    if (!timings) return;`;
code = code.replace(originalCalculateRef, newCalculateRef);

// 3. Add firing logic in calculate interval
const originalInterval = `    calculate(); // Initial call
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [timings]);`;

const newInterval = `    calculate(); // Initial call
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
  }, [timings, notifications]);`;

code = code.replace(originalInterval, newInterval);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched notifications in App.tsx");
