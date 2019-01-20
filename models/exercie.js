const mongoose = require ('mongoose');

const exerciseSchema = mongoose.Schema({
    userId: String,
    description: String,
    duration: {
        type: Number,
        default: 0,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const exercise = mongoose.model("exercise", exerciseSchema);

module.exports = exercise