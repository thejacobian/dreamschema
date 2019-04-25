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
 // show route
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id)
        .populate('dreams');
        console.log(foundUser);
        res.render('users/show.ejs', {
            user: foundUser
        });
    } catch (err) {
        res.send(err);
    }
});

 // edit route
 // update route
 // delete route

module.exports = router;