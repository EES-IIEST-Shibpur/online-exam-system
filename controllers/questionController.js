const cloudinary = require('../config/cloudinary');
const Question = require('../models/Question');
const logger = require('../utils/logger');

exports.createQuestion = async (req, res) => {
    const { text, type, category, difficultyLevel } = req.body;
    const options = JSON.parse(req.body.options);
    const imageFile = req.file;

    try {
        if (options.length > 4) {
            return res.status(400).json({ status: "error", message: "Options should not exceed 4 choices." });
        }
        
        const correctOption = options.find(option => option.isCorrect === true);
        if (!correctOption) {
            return res.status(400).json({ status: "error", message: 'Correct answer must be one of the options.' });
        }

        let imageUrl = null;

        if (imageFile) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'questions'
            });
            imageUrl = uploadResult.secure_url;
        }


        const question = new Question({
            text,
            options,
            type,
            category,
            difficultyLevel,
            image: imageUrl
        });

        await question.save();
        return res.status(201).json({ status: "sucess", message: "Question created successfully", question });
    } catch (error) {
        if (error.name === "ValidationError") {
            console.error("Validation Error:", error);
            return res.status(400).json({ status: "error", message: "Invalid input. Please check your data." });
        }        
        logger.error("Error creating question:", error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const { difficultyLevel, type, category, keyword } = req.query;

        const filter = {};

        if (difficultyLevel && ['easy', 'moderate', 'tough'].includes(difficultyLevel)) {
            filter.difficultyLevel = difficultyLevel;
        }

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (keyword) {
            filter.text = { $regex: keyword, $options: 'i' };
        }

        const questions = await Question.find(filter);

        if (questions.length === 0) {
            return res.status(404).json({ status: "error", message: "No questions found matching the criteria." });
        }

        return res.status(200).json({ status: "success", data: questions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ status: "error", message: 'Question not found' });
        return res.status(200).json({status: "success", data: question});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { questionText, type, category, difficultyLevel } = req.body;
    console.log(questionText, type, category, difficultyLevel)
    if (difficultyLevel && !['easy', 'moderate', 'tough'].includes(difficultyLevel)) {
        return res.status(400).json({ status: "error", message: 'Invalid difficulty level. Use "easy", "moderate", or "tough".' });
    }

    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ status: "error", message: 'Question not found' });

        const updateFields = {
            ...(questionText && {text: questionText}),
            ...(type && {type}),
            ...(category && {category}),
            ...(difficultyLevel && {difficultyLevel}),
        };

        const updatedQuestion = await Question.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ status: "error", message: 'Failed to update the question.' });
        }

        return res.status(200).json({ status: "success", message: 'Question updated successfully', updatedQuestion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) return res.status(404).json({ status: "error", message: 'Question not found' });
        res.status(200).json({ status: "success", message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};