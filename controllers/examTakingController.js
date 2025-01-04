const Exam = require('../models/Exam');
const Result = require('../models/Result');

exports.startExam = async (req, res) => {
    const {examId} = req.params;

    try {
        const exam = await Exam.findById(examId).populate('questions');        
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });

        const currentTime = new Date();

        if (currentTime < exam.startTime) {
            return res.status(403).json({ status: "error", message: "The exam has not started yet." });
        }

        if (currentTime > exam.endTime) {
            return res.status(403).json({ status: "error", message: "The exam has already ended." });
        }

        return res.status(200).json({ status: "success", data: {exam} });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: "error", message: "kya lauda panti chal rha hai Something went wrong. Please try again later." });
    }
};

exports.submitExam = async (req, res) => {
    const { examId, answers } = req.body;
    const studentId = req.userId;

    try {
        const alreadySubmitted = await Result.findOne({examId, studentId});
        if(alreadySubmitted){
            return res.status(409).json({status: "error", message: "You have already submitted exam"});
        }

        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });
        
        let score = 0;
        exam.questions.forEach(question => {
            const correctAnswer = question.options.find(option => option.isCorrect);
        
            const selectedAnswer = answers.find(answer => answer.questionId === question._id.toString());
        
            if (selectedAnswer) {
                const selectedOptionText = question.options.find(
                    option => option._id.toString() === selectedAnswer.selectedOption
                )?.text;
                        
                if (selectedOptionText === correctAnswer.text) {
                    score++;
                }
            }
        });

        const result = new Result({
            studentId,
            examId,
            score,
            answers: answers.map(answer => ({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption
            }))
        });

        await result.save();

        return res.status(200).json({ status: "success", message: "Exam submitted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};