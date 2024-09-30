import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import express from 'express';

const app = express();
const port = 3000;

let browser: any;
app.use(express.json());

// 在服务器启动时初始化 Puppeteer 浏览器实例
const initBrowser = async () => {
    console.log('Initializing browser...');
    browser = await puppeteer.launch({
        executablePath: './chrome-linux/chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Browser initialized.');
};

// 关闭浏览器实例（可选，用于服务停止时）
const closeBrowser = async () => {
    if (browser) {
        await browser.close();
        console.log('Browser closed.');
    }
};

// 设置路由
app.get('/screenshot', async (req: any, res: any) => {
    const url = req.query.url as string;
    const width = parseInt(req.query.width as string) || 1920; // 默认宽度
    const height = parseInt(req.query.height as string) || 1080; // 默认高度
    const waitTime = parseInt(req.query.waitTime as string) || 0; // 默认等待时间

    if (!url) {
        return res.status(400).send('Missing required parameter: url.');
    }

    const filePath = path.join(__dirname, 'screenshot.png');
    console.log(`Request received for URL: ${url} with width: ${width}, height: ${height}, waitTime: ${waitTime}`);

    try {
        const page = await browser!.newPage();
        await page.setViewport({ width, height });

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('Waiting for specified time...');
        await new Promise(resolve => setTimeout(resolve, waitTime));

        console.log('Taking screenshot...');
        await page.screenshot({ path: filePath });
        await page.close(); // 关闭当前页面
        console.log('Screenshot taken.');

        // 将截图返回给客户端
        res.sendFile(filePath, (err: any) => {
            if (err) {
                res.status(500).send('Error sending file: ' + err.message);
                console.error('Error sending file:', err.message);
            }
            // 删除截图文件
            fs.unlink(filePath, (unlinkErr: any) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr.message);
                else console.log('Screenshot file deleted successfully.');
            });
        });
    } catch (error: any) {
        console.error('Error capturing screenshot:', error.message);
        return res.status(500).send('Error capturing screenshot: ' + error.message);
    }
});


app.post('mail', async (req: any, res: any) => {
    const { to, subject, text, html } = req.body;
    // to, subject, 必填，text, html 二选一
    if (!to || !subject || (!text && !html)) {
        return res.status(400).send('Missing required parameters: to, subject and either text or html.');
    }
    // 创建邮件传输对象
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 设置邮件内容
    const mailOptions = {
        from: 'Rogers',
        to,
        subject,
        text,
        html,
    };

    // 发送邮件
    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).send('Error sending email: ' + error.message);
        }
        console.log('Email sent:', info.response);
        res.send('Email sent: ' + info.response);
    });
});


// 启动服务器
app.listen(port, async () => {
    await initBrowser();
    console.log(`Screenshot API listening at http://localhost:${port}`);
});

// 关闭浏览器实例（可选）
process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit(0);
});
