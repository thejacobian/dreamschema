/* eslint-disable prefer-template */
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Dream = require('../models/dreams');
const Keyword = require('../models/keywords');

// index route
router.get('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const users = await User.find({});
        res.render('users/index.ejs', {
            users: users,
            currentUser: thisUsersDbId,
        });
    } catch (err) {
        res.send(err);
    }
});

// show route
router.get('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const foundUser = await User.findById(req.params.id)
            .populate({ path: 'dreams', populate: { path: 'keywords' } });
        const keywords = await Keyword.find();
        res.render('users/show.ejs', {
            user: foundUser,
            currentUser: thisUsersDbId,
            keywords: keywords
        });
    } catch (err) {
        res.send(err);
    }
});

 // edit route
 router.get('/:id/edit', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const foundUser = await User.findById(req.params.id);
        res.render('users/edit.ejs', {
            user: foundUser,
            currentUser: thisUsersDbId,
        });
    } catch (err) {
        res.send(err);
    }
});

 // update route
 router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log(updatedUser);
        res.redirect('/users/' + req.params.id);
    } catch (err) {
        res.send(err);
    }
 });

 // delete route
 router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id);
        console.log(deletedUser);
        await Dream.deleteMany({
            _id: {
                $in: deletedUser.dreams,
            },
        });
        res.redirect('/users');
    } catch (err) {
        res.send(err);
    }
 });

module.exports = router;
