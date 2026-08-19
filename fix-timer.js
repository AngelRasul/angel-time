import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the timer delay in PrayerScreen
const timerOriginal = `  // Calculate Next Prayer and Countdown
  useEffect(() => {
    if (!timings) return;

    const interval = setInterval(() => {
      const now = new Date();
      let nextP = null;
      let minDiff = Infinity;

      for (const p of PRAYER_MAP) {
        if (p.id === 'Sunrise') continue; // Optional: skip sunrise as a prayer to count down to
        const timeStr = timings[p.id];
        if (!timeStr) continue;
        
        const [hours, mins] = timeStr.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, mins, 0, 0);
        
        let diff = prayerTime.getTime() - now.getTime();
        
        // If prayer is already passed today, look at tomorrow
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
        
        const formattedDiff = \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
        
        setNextPrayer({ id: nextP, diff: formattedDiff, hours: h, mins: m, secs: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);`;

const timerFixed = `  // Calculate Next Prayer and Countdown
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
        
        const formattedDiff = \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
        
        setNextPrayer({ id: nextP, diff: formattedDiff, hours: h, mins: m, secs: s });
      }
    };

    calculate(); // Initial call
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [timings]);`;

code = code.replace(timerOriginal, timerFixed);
fs.writeFileSync('src/App.tsx', code);
console.log("Timer fixed");
