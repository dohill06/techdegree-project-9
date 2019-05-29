const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;


module.exports = (req, res, next) => {

    const credentials = auth(req);

    if (credentials) {
        User.findOne({where: {emailAddress: credentials.name}})
        .then(user => {
            if (user) {
                const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);
                if (authenticated) {
                    req.currentUser = user;
                    next();
                }
            }
        });
    }

    
};