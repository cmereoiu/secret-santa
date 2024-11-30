import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import translations from './translations';

export const sendPairingEmail = async (recipient, pairing, language = 'en', customMessage = '') => {

    // Get translations for the selected language
    const currentLanguage = translations[language] || translations.en; // Default fallback to English

    // Set up the email transporter using environment variables
    const transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,  // SMTP host from .env.local
        port: process.env.SMTP_PORT,  // SMTP port from .env.local (587 for STARTTLS) fa
        secure: false,             // Use STARTTLS (false for port 587)
        auth: {
            user: process.env.USER_L,    // Email user from .env.local
            pass: process.env.EMAIL_P, // Email password from .env.local
        },
        tls: { rejectUnauthorized: false},
        logger: true, // Log all communication for debugging
    });

    // Construct the email content
    const emailSubject = currentLanguage.email.subject;  // Subject from translations
    const emailText = `${currentLanguage.email.greeting},\n\n${currentLanguage.email.body.replace('{pairing}', pairing.name)}\n\n${customMessage ? `${currentLanguage.email.customMessage}: ${customMessage}` : ''}\n\n${currentLanguage.email.signature}`;

    const mailOptions = {
        from: process.env.USER_L, // Sender address from .env.local
        to: recipient,                // Recipient address passed in function
        subject: emailSubject,        // Email subject
        text: emailText,              // Email body text
    };

    try
    {
        // Send email using nodemailer transport
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    }
    catch (error)
    {
        console.error('Error sending email:', error);
    }
};
