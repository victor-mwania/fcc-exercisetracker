const mongoose = require('mongoose');
const shortid = require('shortid');

const userSchema = mongoose.Schema({
    username: String,
    _id: {
        'type': String,
        'default': shortid.generate
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User