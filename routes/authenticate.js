const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;


module.exports = (req, res, next) => {
    let message = null;
    const credentials = auth(req);

    if (credentials) {
        User.findOne({
                where: {
                    emailAddress: credentials.name
                }
            })
            .then(user => {
                if (user) {
                    const authenticated = bcryptjs
                        .compareSync(credentials.pass, user.password);
                    if (authenticated) {
                        req.currentUser = user;
                    } else {
                        message = 'Authentication Failure';
                    }
                } else {
                    message = 'User Not Found';
                }
            });
    } else {
        message = 'Please Log In';
    }

    if (message) {
        const err = new Error(message);
        err.status = 401;
        next(err);
    } else {
        next();
    }
};