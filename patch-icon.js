import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const linkManifest = '<link rel="manifest" href="/manifest.json" />';
const appleIcon = '    <link rel="apple-touch-icon" href="/icon.png" />\n    <link rel="icon" type="image/png" href="/icon.png" />';

if (!html.includes('apple-touch-icon')) {
  html = html.replace(linkManifest, linkManifest + '\n' + appleIcon);
  fs.writeFileSync('index.html', html);
  console.log("Updated index.html with apple-touch-icon");
}
