const express = require('express');
const bcrypt = require('bcrypt');
const Docter = require('../models/docter');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { readFirstLine, removeFirstLine } = require('../utils/reader');
const path = require('path');
const filePath = path.join(__dirname,'../','utils', 'private_keys.txt');
// Register College Route
router.post('/register/docter', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        var keyy = '';
        var valuee = '';
        await readFirstLine(filePath)
            .then(({ key, value }) => {
                keyy = key;
                valuee = value;
                console.log('Key:', key);
                console.log('Value:', value);
                return removeFirstLine(filePath);
            })
            .then(() => {
                console.log('First line removed from the file.');
            })
            .catch((error) => {
                console.error(error);
            });
        const docter = await Docter.create({ name, email, password: hashedPassword , address: keyy, key: valuee});

        res.status(201).json(docter);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/register/user', async (req, res) => {
    try {
        const { name, email, password, collegeName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        var keyy = '';
        var valuee = '';
        await readFirstLine(filePath)
            .then(({ key, value }) => {
                keyy = key;
                valuee = value;
                console.log('Key:', key);
                console.log('Value:', value);
                return removeFirstLine(filePath);
            })
            .then(() => {
                console.log('First line removed from the file.');
            })
            .catch((error) => {
                console.error(error);
            });
        const user = await User.create({ name, email, password: hashedPassword, address: keyy, key: valuee});
        res.status(201).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Register Alumni Route
router.post('/register/insurance', async (req, res) => {
    try {
        const { name, email, password, collegeName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        var keyy = '';
        var valuee = '';
        await readFirstLine(filePath)
            .then(({ key, value }) => {
                keyy = key;
                valuee = value;
                console.log('Key:', key);
                console.log('Value:', value);
                return removeFirstLine(filePath);
            })
            .then(() => {
                console.log('First line removed from the file.');
            })
            .catch((error) => {
                console.error(error);
            });
        
        const insurance = await Insurance.create({ name, email, password: hashedPassword, address: keyy, key: valuee});
        res.status(201).json(insurance);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email })
        let userType = 'user';
        if (!user) {
            user = await Docter.findOne({ email });
            userType = 'docter';
        }
        if (!user) {
            user = await Insurance.findOne({ email });
            userType = 'insurance';
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const payload = {
            userId: user._id,
            userType: userType,
            address: user.address,
            key: user.key,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration as needed
        res.cookie('token', token, {
            sameSite: 'lax',
            secure: true,
        });
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;