const puppeteer = require('puppeteer-core');

const CHROME = 'C:\\Users\\twn\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://127.0.0.1:3301/';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--disable-gpu', '--no-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 }
  });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

  // wait for docsify ready
  await page.waitForFunction(() => document.body.classList.contains('ready'), { timeout: 15000 });

  const info = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const st = (el) => el ? getComputedStyle(el) : null;
    const cover = q('section.cover');
    const md = q('.markdown-section');
    return {
      scrollHeight: document.documentElement.scrollHeight,
      bodyScrollHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
      coverExists: !!cover,
      coverClass: cover ? cover.className : null,
      coverPos: cover ? st(cover).position : null,
      coverDisplay: cover ? st(cover).display : null,
      mdExists: !!md,
      contentPos: st(q('.content')) ? st(q('.content')).position : null,
      sidebarW: q('.sidebar') ? q('.sidebar').getBoundingClientRect().width : 0,
      markdownHTML: md ? md.innerHTML.slice(0, 300) : null
    };
  });
  console.log('=== BASELINE / ===');
  console.log(JSON.stringify(info, null, 2));

  // scroll down test on cover page
  const scrollResult = await page.evaluate(async () => {
    window.scrollTo(0, 600);
    await new Promise(r => setTimeout(r, 400));
    return { scrollY: window.scrollY, scrollHeight: document.documentElement.scrollHeight };
  });
  console.log('=== AFTER SCROLL 600 on / ===');
  console.log(JSON.stringify(scrollResult, null, 2));

  await page.screenshot({ path: 'shot_baseline_cover.png' });

  // now go to a content page
  await page.goto(URL + '#/README', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(() => document.querySelector('.markdown-section'), { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  const info2 = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      bodyScrollHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
      mdExists: !!document.querySelector('.markdown-section'),
      mdH2count: document.querySelectorAll('.markdown-section h2').length,
      coverExists: !!document.querySelector('section.cover'),
      contentLeft: document.querySelector('.content') ? getComputedStyle(document.querySelector('.content')).left : null,
      contentPos: document.querySelector('.content') ? getComputedStyle(document.querySelector('.content')).position : null
    };
  });
  console.log('=== README page ===');
  console.log(JSON.stringify(info2, null, 2));

  const scrollResult2 = await page.evaluate(async () => {
    window.scrollTo(0, 1200);
    await new Promise(r => setTimeout(r, 400));
    return { scrollY: window.scrollY, scrollHeight: document.documentElement.scrollHeight };
  });
  console.log('=== AFTER SCROLL 1200 on README ===');
  console.log(JSON.stringify(scrollResult2, null, 2));

  await page.screenshot({ path: 'shot_baseline_readme.png' });

  await browser.close();
  console.log('DONE');
})().catch(e => { console.error('ERR', e); process.exit(1); });
