import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());



app.post('/mail', async (req: any, res: any) => {
    const { to, subject, text, html } = req.body;
    // to, subject, 必填，text, html 二选一
    if (!to || !subject || (!text && !html)) {
        return res.status(400).send('Missing required parameters: to, subject and either text or html.');
    }
    console.log(`Sending email to ${to} with subject: ${subject}`);
    console.log('Email auth:', process.env.EMAIL_USER, process.env.EMAIL_PASS);
    // 创建邮件传输对象
    const transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 设置邮件内容
    const mailOptions = {
        from: 'luorogers@163.com',
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

