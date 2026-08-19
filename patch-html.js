import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const headEnd = '</head>';
const newHead = `    <title>Angel Time</title>
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Angel Time" />
  </head>`;

html = html.replace('<title>My Google AI Studio App</title>', '');
html = html.replace(headEnd, newHead);

fs.writeFileSync('index.html', html);
console.log("Updated index.html");
