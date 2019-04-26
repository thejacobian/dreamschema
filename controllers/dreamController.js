const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Dream = require('../models/dreams');

// add require login middleware


// INDEX ROUTE
router.get('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const myDbUser = await User.findById(thisUsersDbId)
        .populate('dreams');
        
        res.render('dreams/index.ejs', {
            dreams: myDbUser.dreams
        });
    }catch(err){
        res.send(err)
    };
});

// NEW ROUTE
router.get('/new', (req, res) => {
    res.render('dreams/new.ejs')
});

// SHOW ROUTE
router.get('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const myDbUser = await User.findById(thisUsersDbId).populate('dreams');
        myDbUser.dreams.forEach((myDream) => {
            if (myDream._id.toString() === req.params.id) {
                res.render('dreams/show.ejs', {
                    dream: myDream
                });
            } else {
                req.session.message('You dont have access to this dream');
            }
        })
    }catch(err){
        res.send(err)
    }
});

// CREATE ROUTE
router.post('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const newDream = await Dream.create(req.body);
        const newDreamsUser = await User.findById(thisUsersDbId);
        newDreamsUser.dreams.push(newDream._id);
        newDreamsUser.save();
        res.redirect('/dreams');
    } catch (err){
        res.send(err);
    }
});

// EDIT ROUTE
// if trying to go to someone else's edit dream page, it gives empty object instead of res.session.message
router.get('/:id/edit', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const myDbUser = await User.findById(thisUsersDbId).populate('dreams');
        myDbUser.dreams.forEach((myDream) => {
            if (myDream._id.toString() === req.params.id) {
                res.render('dreams/edit.ejs', {
                    dream: myDream
                });
            } else {
                req.session.message('You dont have access to this dream');
                console.log(req.session.message);
            }
        })
    }catch(err){
        res.send(err)
    }
});

// UPDATE ROUTE
router.put('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;

        // await Dream.findById(req.params.id, req.body);
        const foundUser = await User.findOne({'dreams': req.params.id});
        if (foundUser._id.toString() === thisUsersDbId) {
            const updatedDream = await Dream.findByIdAndUpdate(req.params.id, req.body, {new: true});
            console.log(updatedDream);
            res.redirect('/dreams/' + req.params.id);
        } else {
            req.session.message('You dont have access to this dream');
            console.log(req.session.message);
        }    
    } catch (err) {
        res.send(err);
    }
});

// DELETE ROUTE
router.delete('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const deletedDream = await Dream.findByIdAndDelete(req.params.id);
        const foundUser = await User.findOne({'dreams': req.params.id});
            if (thisUsersDbId.toString() === foundUser._id.toString()) {
                foundUser.dreams.remove(req.params.id);
                foundUser.save();
                console.log(foundUser);
                res.redirect('/dreams');
            } else {
                req.session.message('You dont have access to this dream');
                console.log(req.session.message);
            }
        } catch(err) {
        res.send(err)
    }
});

module.exports = router;