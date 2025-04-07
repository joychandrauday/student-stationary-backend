/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendEmail } from "../Utils/sendEmailFunc";
import { INewsLetter } from "./newsletter.interface";
import NewsLetter from "./newsletter.model";



const addNewsLetter = async (newsLetter: INewsLetter) => {
    return await NewsLetter.create(newsLetter);
};

const getNewsLetter = async () => {
    return await NewsLetter.find()
};
const getNewsLetterByEmail = async (email: string) => {
    return await NewsLetter.find({ email: email })
};
const deleteNewsLetter = async (email: string) => {
    return await NewsLetter.findOneAndDelete({ email });
};

const sendNewsletterToAll = async (subject: string, body: string) => {
    try {
        const subscribers = await NewsLetter.find({}, 'email'); // Fetch all emails

        if (!subscribers.length) {
            throw new Error("No subscribers found.");
        }

        const emailPromises = subscribers.map(subscriber => {
            const emailBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Newsletter</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .header img {
                        width: 150px;
                        margin: 0 auto;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: #FF6E61;
                        color: white;
                        text-align: center;
                        padding: 15px;
                        font-size: 22px;
                        font-weight: bold;
                        border-radius: 8px 8px 0 0;
                    }
                    .content {
                        padding: 20px;
                        text-align: left;
                        font-size: 16px;
                        color: #333;
                        line-height: 1.6;
                    }
                    .cta {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .cta a {
                        display: inline-block;
                        background: #007bff;
                        color: white;
                        padding: 12px 25px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    .cta a:hover {
                        background: #0056b3;
                    }
                    .footer {
                        text-align: center;
                        padding: 15px;
                        font-size: 14px;
                        color: #555;
                        background: #FF6E61;
                        border-radius: 0 0 8px 8px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><img src="https://student-stationary-frontend.vercel.app/assets/studentstationarylogowhite-B0c-H9zl.png" alt="Student Stationary Logo"> <br/> 📢 ${subject}</div>
                    <div class="content">
                        <p>Dear Subscriber,</p>
                        <p>${body}</p>
                        <div class="cta">
                            <a href="https://student-stationary-frontend.vercel.app/">Learn More</a>
                        </div>
                        <p>Thank you for being with us!</p>
                    </div>
                    <div class="footer">
                        &copy; 2025 YourCompany | <a href="https://student-stationary-frontend.vercel.app/unsubscribe?email=${subscriber.email}">Unsubscribe</a>
                    </div>
                </div>
            </body>
            </html>
            `;

            // Call sendEmail function to send the email to each subscriber
            return sendEmail(subscriber.email, subject, emailBody);
        });

        await Promise.all(emailPromises); // Send emails in parallel

        return { success: true, message: 'Newsletter sent successfully to all users' };
    } catch (error) {
        throw new Error('Failed to send newsletter: ');
    }
};


export const NewsLetterService = {
    addNewsLetter,
    getNewsLetter,
    getNewsLetterByEmail,
    deleteNewsLetter,
    sendNewsletterToAll
};
