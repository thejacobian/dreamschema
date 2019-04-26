const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Dream = require('../models/dreams');
const Keyword = require('../models/keywords');

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
router.get('/new', async (req, res) => {
    try{
        const keywords = await Keyword.find();
    res.render('dreams/new.ejs', {
        keywords: keywords
    })}catch(err){
        res.send(err)
    }
});

// SHOW ROUTE
router.get('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        console.log(thisUsersDbId);
        const myDbUser = await User.findById(thisUsersDbId).populate('dreams');

        console.log(myDbUser, '<----myDbUser');
        // const populateKeywords = await Keyword.findById(myDbUser.keywords).populate('keywords');
        // console.log(populateKeywords, '<---- populateKeywords');
        // console.log(myDbUser, '<---- myDbUser');

        myDbUser.dreams.forEach((myDream) => {
            if (myDream._id.toString() === req.params.id) {
                // const myDreamKeywords = []
                // console.log(myDreamKeywords, 'outside of for loop');
                // for (let i =0; i < myDream.keywords.length; i++) {
                //     myDreamKeywords.push(Keyword.findById(myDream.keywords[i]));
                //     console.log(myDreamKeywords, 'inside for loop');
                // };
                res.render('dreams/show.ejs', {
                    dream: myDream
                });
            } else {
                req.session.message('You dont have access to this dream');
                console.log(req.session.message);
                res.send(req.session.message);
            }
        })
    } catch(err) {
        res.send(err)
    }
});

// CREATE ROUTE
router.post('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const newDream = await Dream.create(req.body);
        console.log(newDream, 'before keyword push!!!!');
        newDream.keywords.push(req.body.keywordId);
        newDream.save();
        console.log(newDream, 'after keyword push!!!');
        const newDreamsUser = await User.findById(thisUsersDbId);
        newDreamsUser.dreams.push(newDream._id);
        newDreamsUser.save();
        res.redirect('/users');
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
                res.send(req.session.message);
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
                res.send(req.session.message);
            }
        } catch(err) {
        res.send(err)
    }
});

module.exports = router;