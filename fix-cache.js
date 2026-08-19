import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const originalCache = `    if ('caches' in window && data && data.data) {
       const cache = await caches.open('angeltime-quran-cache');
       cache.put(url, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));
    }
    return data;
  } catch (error) {`;

const newCache = `    if ('caches' in window && data && data.data) {
       try {
         const cache = await caches.open('angeltime-quran-cache');
         cache.put(url, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));
       } catch (e) {
         console.warn('Cache error:', e);
       }
    }
    return data;
  } catch (error) {`;

code = code.replace(originalCache, newCache);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed cache catch");
