const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   await page.screenshot({path: 'example.png'});

//   await browser.close();
// })();

(
    async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.gongxuanwang.com/articlePdf/144125', { waitUntil: 'networkidle2'})
        await page.pdf({path:'hn.pdf', format: 'A4'})


        await browser.close()
    }
)()