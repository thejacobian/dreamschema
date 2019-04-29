const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const Keyword = require('../models/keywords');

router.get('/register', (req, res) => {
    const thisUsersDbId = req.session.usersDbId;
    res.render('auth/register.ejs', {
      currentUser : thisUsersDbId
    });
});

router.post('/register', async (req, res) => {
    const password = req.body.password;
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const userDbEntry = {};
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash;
    try {
      const createdUser = await User.create(userDbEntry);
      req.session.logged = true;
      req.session.usersDbId = createdUser._id;
      res.redirect('/users');
    } catch(err){
      res.send(err)
    }
  });

router.get('/login', async (req, res) => {
  try {

    const allKeywords = await Keyword.find({}); // find all keywords to fix leaderboard login bug

    const thisUsersDbId = req.session.usersDbId;
    res.render('auth/login.ejs', {
      currentUser : thisUsersDbId,
      keywords: allKeywords,
    });
  } catch (err) {
    res.send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({username: req.body.username});
    if (foundUser){
      if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
        console.log(req.body.password);
        req.session.message = '';
        req.session.logged = true;
        req.session.username = req.body.username;
        req.session.usersDbId = foundUser._id;
        console.log(req.session, 'successful login');
        res.redirect('/users');
      } else {
        req.session.message = 'password incorrect'; //change this for implementation
        console.log(req.session.message);
        res.redirect('/auth/login');
      } 
    } else {
      req.session.message = 'username is incorrect';
      console.log(req.session.message);
      res.redirect('/auth/login');
    }
  } catch (err) {
    res.send(err);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/auth/login');
    }
  })
});

module.exports = router;