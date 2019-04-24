const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Dream = require('../models/dreams');

// index route
router.get('/', async (req, res) => {
    try {
        const users = await User.find ({});
        res.render('users/index.ejs', {
            users: users,
        });
    } catch (err) {
        res.send(err);
    }
});


module.exports = router;