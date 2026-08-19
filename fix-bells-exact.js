import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<Switch 
              checked={notifications[prayer.id]} 
              onChange={() => setNotifications(prev => ({ ...prev, [prayer.id]: !prev[prayer.id] }))} 
              activeTrackClass={prayer.switchTrack}
              activeKnobClass={prayer.switchKnob}
            />`;

const replacement = `<button 
              onClick={() => {
                triggerHaptic();
                setNotifications(prev => ({ ...prev, [prayer.id]: !prev[prayer.id] }));
              }}
              className={\`p-3 rounded-full transition-colors \${notifications[prayer.id] ? prayer.colorClass : 'text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700'}\`}
            >
              {notifications[prayer.id] ? (
                 <Bell className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                 <BellOff className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log("Replaced");
