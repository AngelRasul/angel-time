import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<Switch\s*checked=\{notifications\[prayer\.id\]\}\s*onChange=\{[^{}]*\{[^{}]*\}[^{}]*\}\s*activeTrackClass=\{prayer\.switchTrack\}\s*activeKnobClass=\{prayer\.switchKnob\}\s*\/>/g;
const alternativeRegex = /<Switch[^>]+notifications\[prayer\.id\][^>]+activeKnobClass=\{prayer\.switchKnob\}\s*\/>/g;

const replacement = `<button 
              onClick={() => {
                triggerHaptic();
                setNotifications(prev => ({ ...prev, [prayer.id]: !prev[prayer.id] }));
              }}
              className={\`p-3.5 rounded-[20px] transition-all duration-200 active:scale-95 \${notifications[prayer.id] ? prayer.colorClass : 'text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700'}\`}
            >
              {notifications[prayer.id] ? (
                 <Bell className="w-6 h-6" strokeWidth={2.5} />
              ) : (
                 <BellOff className="w-6 h-6" strokeWidth={2.5} />
              )}
            </button>`;

if (alternativeRegex.test(content)) {
  content = content.replace(alternativeRegex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced with alternativeRegex");
} else {
  console.log("Not matched");
}
