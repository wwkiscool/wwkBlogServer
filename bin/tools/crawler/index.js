const puppeteer = require('puppeteer');
const fs = require('fs');
const UserAgent = require('user-agents');
const HttpsProxyAgent = require('https-proxy-agent');

class BossCrawler {
    constructor() {
        // 存储结果的数组
        this.results = [];
        // 代理IP池 (需要自行添加有效的代理IP)
        this.proxyList = [
            'http://proxy1.example.com:8080',
            'http://proxy2.example.com:8080',
            // 添加更多代理IP
        ];
    }

    // 获取随机代理
    getRandomProxy() {
        return this.proxyList[Math.floor(Math.random() * this.proxyList.length)];
    }

    // 随机延迟函数
    async randomDelay() {
        const delay = Math.floor(Math.random() * (8000 - 3000) + 3000); // 3-8秒随机延迟
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async start(keyword, city) {
        try {
            const browser = await puppeteer.launch({
                headless: false, // 设置为true则不显示浏览器
                args: [
                    `--proxy-server=${this.getRandomProxy()}`,
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });

            const page = await browser.newPage();
            
            // 设置随机User-Agent
            const userAgent = new UserAgent();
            await page.setUserAgent(userAgent.toString());

            // 设置页面视窗大小
            await page.setViewport({
                width: 1920,
                height: 1080
            });

            // 访问BOSS直聘搜索页面
            await page.goto(`https://www.zhipin.com/${city}/?query=${encodeURIComponent(keyword)}`);
            
            // 等待页面加载
            await this.randomDelay();

            // 开始爬取数据
            let pageNum = 1;
            while (pageNum <= 3) { // 这里限制只爬取前3页
                const jobs = await page.evaluate(() => {
                    const items = document.querySelectorAll('.job-list ul li');
                    return Array.from(items).map(item => {
                        return {
                            title: item.querySelector('.job-name')?.innerText.trim(),
                            salary: item.querySelector('.salary')?.innerText.trim(),
                            company: item.querySelector('.company-text .name')?.innerText.trim(),
                            location: item.querySelector('.job-area')?.innerText.trim(),
                            requirements: item.querySelector('.job-limit')?.innerText.trim()
                        };
                    });
                });

                this.results = [...this.results, ...jobs];
                
                // 随机延迟后翻页
                await this.randomDelay();
                
                // 点击下一页
                const nextButton = await page.$('.page a.next');
                if (!nextButton) break;
                
                await nextButton.click();
                pageNum++;
            }

            // 保存结果到文件
            fs.writeFileSync(
                `boss_jobs_${keyword}_${new Date().getTime()}.json`,
                JSON.stringify(this.results, null, 2)
            );

            await browser.close();
            
        } catch (error) {
            console.error('爬取过程出错：', error);
        }
    }
}

// 使用示例
const crawler = new BossCrawler();
crawler.start('前端开发', '101020100'); // 101020100是上海的城市代码
