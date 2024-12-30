import nodemailer from 'nodemailer';

export async function sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
): Promise<void> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'muhammedsirajudeen29@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: 'muhammedsirajudeen29@gmail.com', 
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent successfully to', to);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email.');
    }
}

