const express = require('express');
const router = express.Router();
const User = require('../models').User;
const authenticateUser = require('./authenticate');
const bcryptjs = require('bcryptjs');

router.get('/', authenticateUser, (req, res) => {
    res.json({
        id: req.currentUser.id,
        firstName: req.currentUser.firstName,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    });
    res.status(200);
});

router.post('/', (req, res, next) => {
    
});



module.exports = router;