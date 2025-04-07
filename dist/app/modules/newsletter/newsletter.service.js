"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmailFunc_1 = require("../Utils/sendEmailFunc");
const newsletter_model_1 = __importDefault(require("./newsletter.model"));
const addNewsLetter = (newsLetter) => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.create(newsLetter);
});
const getNewsLetter = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.find();
});
const getNewsLetterByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.find({ email: email });
});
const deleteNewsLetter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.findOneAndDelete({ email });
});
const sendNewsletterToAll = (subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield newsletter_model_1.default.find({}, 'email'); // Fetch all emails
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
            return (0, sendEmailFunc_1.sendEmail)(subscriber.email, subject, emailBody);
        });
        yield Promise.all(emailPromises); // Send emails in parallel
        return { success: true, message: 'Newsletter sent successfully to all users' };
    }
    catch (error) {
        throw new Error('Failed to send newsletter: ');
    }
});
exports.NewsLetterService = {
    addNewsLetter,
    getNewsLetter,
    getNewsLetterByEmail,
    deleteNewsLetter,
    sendNewsletterToAll
};
