const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
    meaning: { type: String, required: true },
    count: String,
});

// keywordSchema.index({ word: 'text', meaning: 'text' });

const Keyword = mongoose.model('Keyword', keywordSchema);

module.exports = Keyword;
