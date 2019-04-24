const mongoose = require('mongoose');

const dreamSchema = mongoose.Schema({
    title: String,
    body: String,
    // keywords: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Keyword'
    //}]This will be added once we have this whole thing figured out
});

const Dream = mongoose.model('Dream', dreamSchema);

module.exports = Dream;