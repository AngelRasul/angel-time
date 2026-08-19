const https = require('https');
https.get('https://api.alquran.cloud/v1/surah/2/editions/quran-uthmani,ru.kuliev', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Status:", parsed.status);
      console.log("Data length:", parsed.data.length);
      console.log("Edition 0:", parsed.data[0].edition.identifier);
      console.log("Edition 1:", parsed.data[1].edition.identifier);
    } catch (e) {
      console.log("Error parsing:", e);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
