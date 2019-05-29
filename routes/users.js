const express = require('express');
const router = express.Router();
const User = require('../models').User;
const authenticateUser = require('./authenticate');
const bcryptjs = require('bcryptjs');

router.get('/', authenticateUser, (req, res) => {

});



module.exports = router;