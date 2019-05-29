const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;


module.exports = (req, res, next) => {

    const credentials = auth(req);

    if (credentials) {
        User.findOne({
                where: {
                    emailAddress: credentials.name
                }
            })
            .then(function (user) {
                if (user) {
                    const authenticated = bcryptjs
                        .compareSync(credentials.pass, user.password);
                    if (authenticated) {
                        req.currentUser = user;
                        next();
                    } else {
                        const err = new Error('Authentication Failure');
                        err.status = 401;
                        next(err);
                    }
                } else {
                    const err = new Error('User Not Found');
                    err.status = 401;
                    next(err);
                }
            });
    } else {
        const err = new Error('Please Log In');
        err.status = 401;
        next(err);
    }
};