const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam', required: true
    },
    score: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    answers: [{
        questionId: String,
        selectedOption: String
    }]
});

module.exports = mongoose.model('Result', resultSchema);