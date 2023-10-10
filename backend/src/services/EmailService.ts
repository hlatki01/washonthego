import nodemailer from 'nodemailer';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587, // You can use 587 for TLS or 465 for SSL
            secure: false, // Set to true if you're using port 465 (SSL)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            ignoreTLS: false, // Set to true to ignore issues with TLS certificates
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM,
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
