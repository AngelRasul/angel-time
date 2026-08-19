import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /import \{ Globe, Moon, Sunrise, Sun, Sunset, MoonStar, Settings, Search, ChevronLeft, Flame, BookOpen, Clock, MapPin, Loader2, Check, SunMedium, CloudSun, Compass, BookText, CloudMoon, Eclipse, Aperture \} from 'lucide-react';/,
  "import { Globe, Moon, Sunrise, Sun, Sunset, MoonStar, Settings, Search, ChevronLeft, Flame, BookOpen, Clock, MapPin, Loader2, Check, SunMedium, CloudSun, Compass, BookText, CloudMoon, Eclipse, Aperture, Bell, BellOff } from 'lucide-react';"
);
fs.writeFileSync('src/App.tsx', content);
