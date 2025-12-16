const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    options: [
        {
            text: String,
            isCorrect: Boolean,
        },
    ],
    type: {
        type: String,
        enum: ['multi-correct', 'single-correct'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: String,
        enum: ["easy", "moderate", "tough"],
        required: true,
        default: 'moderate'
    },
    image: {
        type: String
    },
});

questionSchema.path('options').validate(function (options) {
    return options.length <= 4;
}, 'A question can have a maximum of 4 options.');

module.exports = mongoose.model('Question', questionSchema);