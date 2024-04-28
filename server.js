const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const appointmentRoutes = require('./routes/appointments');
const session = require('express-session');
const axios = require('axios');
const jwt = require('jwt-simple');
const { authenticate } = require('./middleware/authenticate');
const verifyTokenFromCookie = require('./middleware/verifyToken');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const allowedOrigins = ['http://localhost:3000'];

// CORS middleware configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow sending cookies
};
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/list', listRoutes);
app.use('/api/appointment', appointmentRoutes);
// Start the server
app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Welcome to the server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
