const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  /return saved \? JSON\.parse\(saved\) : \{/g,
  `if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('angelTimeNotifications');
      }
    }
    return {`
);
fs.writeFileSync('src/App.tsx', code);
