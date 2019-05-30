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

router.post('/', authenticateUser, (req, res, next) => {
    const input = req.body;

    if (!input.title) {
        const err = new Error('All fields are required');
        err.status = 400;
        next(err);
    } else {
        Course.findOne({
            where: {
                title: input.title
            }
        }).then(course => {
            if (course) {
                const err = new Error('Duplicate course');
                err.status = 400;
                next(err);
            } else {
                input.userId = req.currentUser.id;

                Course.create(input)
                    .then(course => {
                        res.location(`/api/courses/${course.id}`);
                        res.status(201).end();
                    }).catch(err => {
                        if (err.name === 'SequelizeValidationError') {
                            err.message = err.message;
                            err.status = 400;
                            next(err);
                        } else {
                            err.message = 'Server Error';
                            next(err);
                        }
                    });
            }
        }).catch(err => {
            next(err);
        });
    }
});

router.put('/:id', authenticateUser, (req, res, next) => {
    const input = req.body;

    if (!input.id) {
        const err = new Error('All fields are required');
        err.status = 400;
        next(err);
    } else {
        Course.findOne({
            where: {
                id: input.id
            }
        }).then(course => {
            if (course.userId !== req.currentUser.id) {
                const err = new Error('User can only update their own courses');
                err.status = 403;
                next(err);
            } else if (!course) {
                const err = new Error('Sorry, no id found');
                err.status = 404;
                next(err);
            } else {
                course.update(input)
                    .then(() => {
                        res.status(204).end();
                    }).catch(err => {
                        if (err.name === 'SequelizeValidationError') {
                            err.message = err.message;
                            err.status = 400;
                            next(err);
                        } else {
                            err.message = 'Server Error';
                            next(err);
                        }
                    });
            }
        }).catch(err => {
            next(err);
        });
    }
});

router.delete('/:id', authenticateUser, (req, res, next) => {
    const input = req.body;

    Course.findOne({
        where: {
            id: input.id
        }
    }).then(course => {
        if (course.userId !== req.currentUser.id) {
            const err = new Error('User can only delete their own courses');
            err.status = 403;
            next(err);
        } else if (!course) {
            const err = new Error('Sorry, no id found');
            err.status = 404;
            next(err);
        } else {
            course.destroy()
                .then(() => {
                    res.status(204).end();
                }).catch(err => {
                    next(err);
                });
        }
    }).catch(err => {
        next(err);
    });
});

module.exports = router;