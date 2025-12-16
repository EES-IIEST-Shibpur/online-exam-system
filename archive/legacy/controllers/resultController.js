const Result = require("../models/Result");
const Exam = require("../models/Exam");
const { handleError } = require("../utils/handleError");

const getResult = async (req, res) => {
    const studentId = req.userId;

    try {
        const result = await Result.find({ studentId });

        if (!result || result.length === 0) {
            return res.status(404).json({ status: "error", message: "No result found" });
        }

        const examIds = result.map(r => r.examId);
        const exams = await Exam.find({ '_id': { $in: examIds } }).populate('questions');

        const detailedResults = result.map(r => {
            const exam = exams.find(exam => exam._id.toString() === r.examId.toString());

            const detailedAnswers = r.answers.map(answer => {
                const question = exam.questions.find(q => q._id.toString() === answer.questionId);
                
                return {
                    question: question ? {
                        _id: question._id,
                        text: question.text,
                        image: question.image,
                        options: question.options
                    } : null,
                    selectedOption: answer.selectedOption
                };
            });

            return {
                ...r.toObject(),
                answers: detailedAnswers
            };
        });

        return res.status(200).json({ status: "success", data: detailedResults });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getResult,
};