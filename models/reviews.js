const mongoose = require('mongoose');
const { Schema } = mongoose; //de-structuring
const reviewsSchema = Schema({
    body : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    rating : Number
});
module.exports = mongoose.model('Review',reviewsSchema);
