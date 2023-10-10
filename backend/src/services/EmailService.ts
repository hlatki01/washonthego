import nodemailer from 'nodemailer';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mailersend.net',
            port: 587, // You can use 587 for TLS or 465 for SSL
            secure: false, // Set to true if you're using port 465 (SSL)
            auth: {
                user: 'MS_6602O7@meubot.chat',
                pass: '7r1sXlBW2zn1fLJK',
            },
            ignoreTLS: false, // Set to true to ignore issues with TLS certificates
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        try {
            const mailOptions = {
                from: 'no-reply@meubot.chat',
                to: to,
                subject: subject,
                text: text,
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}

export default EmailService;
