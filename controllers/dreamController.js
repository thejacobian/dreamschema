const express = require('express');
const router = express.Router();
// const User = require('../models/users');
const Dream = require('../models/dreams');


// INDEX ROUTE
router.get('/', async (req, res) => {
    try {
        const allDreams = await Dream.find();
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
        const oneDream = await Dream.findById(req.params.id);
        res.render('dreams/show.ejs', {
            dream: oneDream
        })
    }catch(err){
        res.send(err)
    }
});

// CREATE ROUTE
router.post('/', (req, res) => {
    Dream.create(req.body, (err, newDream) => {
        if(err){
            res.send(err)
        }else{
            console.log(newDream);
            res.redirect('/dreams')
        }
    }); 
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