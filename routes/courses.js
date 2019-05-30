const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const authenticateUser = require('./authenticate');


router.get('/', (req, res, next) => {
    Course.findAll({
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        },
        include: [{
            model: User,
            attributes: {
                exclude: [
                    'password',
                    'createdAt',
                    'updatedAt'
                ]
            }
        }]
    }).then(courses => {
        res.json({
            courses
        });
        res.status(200);
    }).catch(err => {
        next(err);
    });
});

router.get('/:id', (req, res, next) => {

});

router.post('/', (req, res, next) => {

});

router.put('/:id', (req, res, next) => {

});

router.delete('/:id', (req, res, next) => {

});

module.exports = router;