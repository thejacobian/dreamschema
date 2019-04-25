const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Dream = require('../models/dreams');


// INDEX ROUTE
router.get('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        console.log(thisUsersDbId, '<---- thisUserId');
        const myDbUser = await User.findById(thisUsersDbId).populate('dreams');
        console.log(myDbUser, '<---- myDbUsers');
        const allDreams = await Dream.find();
        console.log(allDreams, '<----- allDreams'),
        res.render('dreams/index.ejs', {
            dreams: allDreams
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
        console.log(myDbUser, '<---- myDbUsers');
        // const oneDream = await Dream.findById(req.params.id);
        if (myDbUser.dreams.includes(oneDream._id)) {
            res.render('dreams/show.ejs', {
                dream: myDbUser.dreams[req.params.id]
            });
        } else {
            req.session.message('You dont have access to this dream');
        }
    }catch(err){
        res.send(err)
    }
});

// CREATE ROUTE
router.post('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const newDream = await Dream.create(req.body);
        console.log(newDream, 'newDream');
        const newDreamsUser = await User.findById(thisUsersDbId);
        console.log(newDreamsUser, 'newDreamsUser');
        newDreamsUser.dreams.push(newDream._id);
        newDreamsUser.save();
        console.log(newDreamsUser, 'newDreamsUser after pushing to dreams array');
        res.redirect('/dreams')
    } catch (err){
        res.send(err);
    }
});

// EDIT ROUTE
router.get('/:id/edit', async (req, res) => {
    try {
        const editDream = await Dream.findById(req.params.id);
        res.render('dreams/edit.ejs', {
            dream: editDream
        })
    } catch(err){
        res.send(err)
    }
});

// UPDATE ROUTE
router.put('/:id', async (req, res) => {
    try {
        const updatedDream = await Dream.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/dreams/' + req.params.id);
    } catch (err) {
        res.send(err)
    }
});

// DELETE ROUTE
router.delete('/:id', async (req, res) => {
    try {
        const deletedDream = await Dream.findByIdAndDelete(req.params.id);
        res.redirect('/dreams');
    } catch(err) {
        res.send(err)
    }
});

module.exports = router;