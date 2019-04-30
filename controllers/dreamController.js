/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const User = require('../models/users');
const Dream = require('../models/dreams');
const Keyword = require('../models/keywords');

const maxTextKeywords = 3; //max num keywords to display


// add require login middleware

// helper function to randomize array from Stack Overflow
/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

// INDEX ROUTE
router.get('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const myDbUser = await User.findById(thisUsersDbId)
            .populate('dreams');

        res.render('dreams/index.ejs', {
            dreams: myDbUser.dreams,
            currentUser: thisUsersDbId,
        });
    } catch (err) {
        res.send(err);
    }
});

// NEW ROUTE
router.get('/new', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const keywords = await Keyword.find().sort('word');
        res.render('dreams/new.ejs', {
            keywords,
            currentUser: thisUsersDbId,
        });
    } catch (err) {
        res.send(err);
    }
});

// SHOW ROUTE
router.get('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const thisDream = await Dream.findById(req.params.id);
        shuffleArray(thisDream.keywords); // randomly shuffle displayed keyword
        const myKeyword = await Keyword.findById(thisDream.keywords[0]);
        console.log(myKeyword);
        const myDbUser = await User.findOne({ dreams: req.params.id });
        console.log(myDbUser);
        if ((myDbUser._id.toString() === thisUsersDbId.toString()) || (thisDream.public === true)) {
            res.render('dreams/show.ejs', {
                dream: thisDream,
                currentUser: thisUsersDbId,
                keywords: myKeyword,
            });
        } else {
            req.session.message = 'You dont have access to this dream';
            console.log(req.session.message);
            res.send(req.session.message);
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// helper function to match up dream content with keywords
const findAllKeywordsInDream = async (reqBody) => {
    try {
        const dreamText = reqBody.body.toLocaleLowerCase();
        const dreamTitle = reqBody.title.toLocaleLowerCase();
        const allKeywords = await Keyword.find({});
        const allMatchingKeywords = [];
        allKeywords.forEach((keyword) => {
            if (dreamText.includes(` ${keyword.word} `) || dreamTitle.includes(` ${keyword.word} `)) {
                allMatchingKeywords.push(keyword._id);
            }
        });
        console.log(allMatchingKeywords);
        return (allMatchingKeywords);
    } catch (err) {
        console.log(err);
        return (err);
    }
};

// CREATE ROUTE
router.post('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        if (req.body.public === 'on') {
            req.body.public = true;
        } else {
            req.body.public = false;
        }

        // create new dream
        const newDream = await Dream.create(req.body);
        
        // add drop-down keyword/theme user chose
        newDream.keywords.push(req.body.keywordId);
        // save the dream
        await newDream.save();

        // add a few random keywords from req.body into dream.keywords array
        const keywordsInText = await findAllKeywordsInDream(req.body);

        if (keywordsInText.length > 0) {
            shuffleArray(keywordsInText); // shuffle keywords in place for random population
            for (let i = 0; i < keywordsInText.length && i < maxTextKeywords; i++) {
                // add keyword if not already present from dropdown
                if (newDream.keywords.includes(keywordsInText[i]) === false) {
                    newDream.keywords.push(keywordsInText[i]);
                }
            }
            // save the dream
            await newDream.save();
        }

        // save the dream
        newDream.save();
        if (req.body.keywordId) {
            const keywordCount = await Keyword.findById(req.body.keywordId);
            keywordCount.count++;
            keywordCount.save();
        }
        console.log(newDream, 'after keyword push!!!');

        // save the user
        const newDreamsUser = await User.findById(thisUsersDbId);
        newDreamsUser.dreams.push(newDream._id);
        await newDreamsUser.save();
        res.redirect('/dreams');
    } catch (err) {
        res.send(err);
    }
});

// EDIT ROUTE
router.get('/:id/edit', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const myDbUser = await User.findById(thisUsersDbId).populate('dreams');
        myDbUser.dreams.forEach((myDream) => {
            if (myDream._id.toString() === req.params.id.toString()) {
                // if (req.body.keywordId != myDream._id) {
                //     const keywordChange = Keyword.findById(req.body.keywordId);
                //     myDream.keywordId = req.body.keywordId;
                //     keywordChange.count++;
                //     keywordChange.save();
                //     console.log(keywordChange)
                // }
                res.render('dreams/edit.ejs', {
                    dream: myDream,
                    currentUser: thisUsersDbId,
                });
            } else {
                req.session.message = 'You dont have access to this dream';
                res.send(req.session.message);
            }
        });
    } catch (err) {
        res.send(err);
    }
});

// UPDATE ROUTE
router.put('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;

        // await Dream.findById(req.params.id, req.body);
        const foundUser = await User.findOne({ dreams: req.params.id });
        if (foundUser._id.toString() === thisUsersDbId.toString()) {
            const updatedDream = await Dream.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.redirect(`/dreams/${req.params.id}`);
        } else {
            req.session.message = 'You dont have access to this dream';
        }
    } catch (err) {
        res.send(err);
    }
});

// DELETE ROUTE
router.delete('/:id', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        if (thisUsersDbId.toString() === foundUser._id.toString()) {
            const deletedDream = await Dream.findByIdAndDelete(req.params.id);
            console.log(deletedDream);
            const foundUser = await User.findOne({ dreams: req.params.id });
            foundUser.dreams.remove(req.params.id);
            await foundUser.save();
            if (req.body.keywordId) {
                const keywordCount = await Keyword.findById(req.body.keywordId);
                keywordCount.count--;
                keywordCount.save();
            }
            console.log(foundUser);
            res.redirect('/dreams');
        } else {
            req.session.message = 'You dont have access to this dream';
            console.log(req.session.message);
            res.send(req.session.message);
        }
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
