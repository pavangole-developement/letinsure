const express = require('express');
const bcrypt = require('bcrypt');
const Docter = require('../models/docter');
const User = require('../models/user');
const Insurance = require('../models/insurance');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/info/docter', async (req, res) => {
    //return all docter info in json format
    try {
        const docter = await Docter.find();
        res.json(docter);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


router.post('/info/insurance', async (req, res) => {
    //return only name and address of insurance company field in json format
    try {
        const insurance = await Insurance.find();
        res.json(insurance);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;

