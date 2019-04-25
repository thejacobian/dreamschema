const mongoose = require('mongoose');

const dreamSchema = mongoose.Schema({
    title: String,
    body: String,
    date: Date,
    keywords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Keyword'
    }]
});

const Dream = mongoose.model('Dream', dreamSchema);

module.exports = Dream;