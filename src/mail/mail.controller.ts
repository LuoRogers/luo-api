import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(@Body() body: { to: string; subject: string; text?: string; html?: string }, @Res() res) {
    const { to, subject, text, html } = body;
    if (!to || !subject || (!text && !html)) {
      return res.status(HttpStatus.BAD_REQUEST).send('Missing required parameters: to, subject and either text or html.');
    }

    try {
      const response = await this.mailService.sendMail(to, subject, text, html);
      return res.send('Email sent: ' + response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error sending email: ' + error);
    }
  }
}
