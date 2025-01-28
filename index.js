const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');

module.exports = async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });

        const page = await browser.newPage();
        const searchQuery = req.query.q || "story protocol"; // Allows dynamic query via ?q=param
        const url = `https://twitter.com/search?q=${encodeURIComponent(searchQuery)}&f=live`;

        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('article', { timeout: 10000 });

        const tweets = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('article div[lang]')).map(tweet => ({
                text: tweet.innerText,
            }));
        });

        await browser.close();
        res.status(200).json({ success: true, tweets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
