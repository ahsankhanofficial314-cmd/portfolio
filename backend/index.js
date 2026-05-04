import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Flexible for production and development
const allowedOrigins = [
    // Development
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://127.0.0.1:5173',
    // Production - Your specific Vercel domains
    'https://portfolio-gules-zeta-y02i8pzeux.vercel.app',
    'https://portfolio-h721-83j45bv4t-ahsankhanofficial314-cmds-projects.vercel.app',
    'https://portfolio-lilac-alpha-48.vercel.app',
    'https://portfolio-qd63.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Vercel serverless)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowlist
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        // Also allow any vercel.app domain as fallback
        else if (origin.includes('vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        }
        else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('CORS policy: This origin is not allowed.'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((err) => console.log('MongoDB Connection Error: ', err));

// Message Schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio Backend is running!', status: 'Professional Connection Established' });
});

// Contact Form API Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Save to MongoDB
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        console.log(`New message saved from ${name} (${email})`);

        // Send email notification to admin (wait for it to finish on serverless)
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: `New Portfolio Message from ${name}`,
                html: `
                    <h2>New Message Received!</h2>
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <p><small>Time: ${new Date().toLocaleString()}</small></p>
                `
            });
            console.log('Email notification sent successfully');
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            // Optionally, you might not want to fail the whole request if email fails, 
            // but for serverless it's better to await it.
        }

        res.status(200).json({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
