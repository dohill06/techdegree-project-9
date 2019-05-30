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
    const user = req.body;

    if (!user.emailAddress) {
        const err = new Error('All fields are required');
        err.status = 400;
        next(err);
    } else {
        User.findOne({
                where: {
                    emailAddress: user.emailAddress
                }
            })
            .then(email => {
                if (email) {
                    const err = new Error('Duplicate email');
                    err.status = 400;
                    next(err);
                } else {
                    if (user.password) {
                        user.password = bcryptjs.hashSync(user.password);
                    }                    
                    User.create(user).then(() => {
                        res.location('/');
                        res.status(201).end();
                    }).catch(err => {
                        if (err.name === 'SequelizeValidationError') {
                            err.message = err.message.slice(18,40);
                            err.status = 400;
                            next(err);
                        } else {
                            err.message = 'Server Error';
                            next(err);
                        }
                    });
                }
            });
    }
});



module.exports = router;