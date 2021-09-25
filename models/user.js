const mongoose = require('mongoose');
const passportLocalMongooose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true,'Email is required..!']
    }
});
userSchema.plugin(passportLocalMongooose);
module.exports = mongoose.model('User',userSchema);