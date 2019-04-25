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
        res.render('users/show.ejs', {
            user: foundUser
        });
    } catch (err) {
        res.send(err);
    }
});

 // edit route
 router.get('/:id/edit', async (req, res) => {
    try {
       const foundUser = await User.findById(req.params.id);
        res.render('users/edit.ejs', {
            user: foundUser
        });
    } catch (err) {
        res.send(err);
    }
});

 // update route
 router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log(updatedUser) 
        res.redirect('/users/' + req.params.id)   
    } catch (err) {
        res.send(err);
    }
 });

 // delete route

module.exports = router;