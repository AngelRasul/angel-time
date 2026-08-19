import fetch from 'node-fetch';

async function t() {
  const res = await fetch('https://api.alquran.cloud/v1/surah/2/editions/quran-uthmani,ru.kuliev');
  const d = await res.json();
  console.log("Status:", res.status);
  console.log("Has data?", !!d.data);
  if (d.data) {
     console.log("Length of data array:", Array.isArray(d.data) ? d.data.length : 'not array');
  }
}
t();
