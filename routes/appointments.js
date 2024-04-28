const express = require('express');
const bcrypt = require('bcrypt');
const Docter = require('../models/docter');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Importing interact module using dynamic import
const interactModule = require('../interact');

// Destructure the module's exports
const { storeMessage, getMessagesSentBySender, getMessagesReceivedByReceiver } = interactModule;
router.post('/start', async (req, res) => {
    try {
        const reciever = req.body.reciever;
        const content = "open";
        const cookies = req.cookies;
        const secret = process.env.JWT_SECRET;
        const token = cookies['token'];
        const decoded = jwt.verify(token, secret);
        //check the userId is in user database or not
        let user = await User.findOne({ _id: decoded.userId });
        if(user == null) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const sender = decoded.address;
        console.log('reciever:', reciever);
        console.log('sender:', sender);
        await storeMessage(sender, reciever, content);
        const msg = {
            message: "Appointment sent successfully",
        }
        res.json(msg);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// router.post('/closeappointment', async (req, res) => {
//     const { sender, receiver} = req.body;
//     const content = "closed";
//     await storeMessage(sender, receiver, content);
//     console.log('Message stored successfully.');
//     const msg = {
//         message: "Appointment Closed successfully",
//     }
//     res.json(msg);
// });

module.exports = router;