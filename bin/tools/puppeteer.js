const puppeteer = require('puppeteer');
const xlsx = require('node-xlsx');
const fs = require('fs');

const sleep = timer => new Promise((resolve, reject) => {
    setTimeout(resolve, timer)
  })
  console.log('2222222222222222');

(async () => {
    console.log('0111')
    async function first () {
      console.log('开启第一次爬虫');
      const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        args: [            //启动 Chrome 的参数，详见上文中的介绍
            '--no-sandbox',
            '--window-size=1280,960'
        ],
      });
      let arr = []
      const page = await browser.newPage();
      for (let i = 1; i < 10; i++){
        console.log(`${i}/10`)
        try {// https://www.zhipin.com/web/geek/job?query=%E5%89%8D%E7%AB%AF&city=101280600&salary=405
          await page.goto(`https://www.zhipin.com/c101280600/y_6/?query=%E5%89%8D%E7%AB%AF&page=${i}&ka=page-${i}`,{
            timeout: 1200000,
            waitUntil: 'networkidle2'
          })
          const result = await page.evaluate(() => {
            let $ = window.$
            let li = $('.job-list li')
            let eles = []
            if (li?.length > 0) {
              li.map(async (i, v) => {
                let name = $(v).find('.job-name').text()
                let price = $(v).find('.job-limit .red').text()
                let limit = $(v).find('.job-limit p').text()
                let company = $(v).find('.company-text .name').text()
                let href = `https://www.zhipin.com` + $(v).find('.job-name a').attr('href')
                eles.push([
                  name,
                  price,
                  limit,
                  company,
                  href])
              })
            }
            return eles
          })
          arr.push(...result)
        } catch (error) {
          // await page.waitFor(40000)
        }
      }
      console.log('结束第一次爬虫');
      // 生成目录
      let name = new Date().getTime().valueOf()
      const buffer = xlsx.build([{name: 'mySheetName', data: arr}]);
      fs.writeFileSync(`${name}.csv`, buffer, 'binary');
      return new Promise((resolve) => {
        resolve(arr)
      })
    }
    first().then(async res => {
      console.log('开启第二次爬虫');
      const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        args: [            //启动 Chrome 的参数，详见上文中的介绍
            '--no-sandbox',
            '--window-size=1280,960'
        ],
      });
      const page = await browser.newPage();
      for (let i = 0; i < res.length; i++) {
        console.log(`${i}/${res.length}`);
        try {
          await page.goto(res[i][4],{
            timeout: 1200000,
            waitUntil: 'networkidle2'
          })
          const result = await page.evaluate(() => {
            let $ = window.$
            let job = $('.job-sec .text')[0].innerHTML ?? null
            return job
          })
          if (result) {
            console.log('完成爬取');
            res[i].push(result) 
          } else {
            // 懒得提取爬取方法，爬取失败后，停止20S，然后在爬，再失败，就去catch了
            console.log(`重新爬取${i}条`);
            await sleep(20000)
            await page.goto(arr1[i][4],{
              timeout: 1200000,
              waitUntil: 'networkidle2'
            })
            const result = await page.evaluate(() => {
              let $ = window.$
              let job = $('.job-sec .text')[0].innerHTML ?? null
              return job
            })
            if (result) {
              console.log('完成爬取');
              res[i].push(result)
            } else {
              throw new Error('123')
            }
          }
        } catch (error) {
          await sleep(30000)
          res[i].push('result') 
        }
      }
      console.log(res);
      const buffer = xlsx.build([{name: 'mySheetName', data: res}]);
      let name = new Date().getTime().valueOf()
      fs.writeFileSync(`${name}.csv`, buffer, 'binary');
      console.log('结束第二次爬虫');
    })
  })()
  