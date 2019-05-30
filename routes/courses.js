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
    Course.findOne({
        where: {
            id: req.params.id
        },
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
    }).then(course => {
        if (course) {
            res.json({
                course
            });
            res.status(200);
        } else {
            const err = new Error('Sorry, no id found');
            err.status = 404;
            next(err);
        }
    }).catch(err => {
        next(err);
    });
});

router.post('/', (req, res, next) => {

});

router.put('/:id', (req, res, next) => {

});

router.delete('/:id', (req, res, next) => {

});

module.exports = router;