import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Professional CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'https://portfolio-gules-zeta-y02i8pzeux.vercel.app',
    'https://portfolio-h721-83j45bv4t-ahsankhanofficial314-cmds-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

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
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        console.log(`New message saved from ${name} (${email})`);
        res.status(200).json({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

