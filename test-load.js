import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  console.log("Page loaded. Clicking Al-Baqarah...");
  
  await page.evaluate(() => {
    localStorage.setItem('angelTimeLastReadSurah', '2');
  });
  
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.fixed.bottom-6 button');
    if (tabs.length > 1) {
       tabs[1].click();
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
     const button = document.querySelector('.bg-\\[\\#D0E8D7\\].text-\\[\\#0F381D\\]');
     if (button) button.click();
  });
  
  await new Promise(r => setTimeout(r, 5000));
  
  const ok = await page.evaluate(() => {
     return document.querySelector('h1').textContent;
  });
  console.log("Current header title:", ok);
  
  await browser.close();
})();
