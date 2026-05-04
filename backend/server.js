const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Portfolio Backend is running!');
});

// Contact Form API Endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // In a real application, you would send an email here using nodemailer
    // or save the message to a database.
    console.log(`New message received from ${name} (${email}): ${message}`);

    res.status(200).json({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
