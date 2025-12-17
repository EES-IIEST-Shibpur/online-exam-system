const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
    const { title, description, questions, duration, startTime, endTime } = req.body; 

    try {
        const newExam = new Exam({
            title,
            description,
            questions,
            duration,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            createdBy: req.userId,
        });
        await newExam.save();

        return res.status(201).json({ status: "success", message: 'Exam created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};

exports.getExams = async (req, res) => {
    const { page = 1, limit = 10, title, startTime, endTime } = req.query;

    try {
        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' };
        if (startTime) query.startTime = { $gte: new Date(startTime) };
        if (endTime) query.endTime = { ...query.endTime, $lte: new Date(endTime) };

        const skip = (page - 1) * limit;
        const exams = await Exam.find(query)
            .populate('questions')
            .skip(skip)
            .limit(limit);

        if (exams.length === 0) {
            return res.status(404).json({ status: "error", message: "Exams not found" });
        }

        const totalExams = await Exam.countDocuments(query);

        return res.status(200).json({
            status: "success",
            data: {
                exams,
                pagination: {
                    totalExams,
                    currentPage: page,
                    totalPages: Math.ceil(totalExams / limit),
                },
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: 'Something went wrong. Please try again later.' });
    }
};

exports.getExamById = async (req, res) => {
    const { id } = req.params;

    try {
        const exam = await Exam.findById(id).populate('questions');
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });
        return res.status(200).json({status: "success", data: {exam}});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.updateExam = async (req, res) => {
    const { id } = req.params;
    const { title, description, questions, duration, startTime, endTime } = req.body;

    try {
        const updateFields = {
            ...(title && { title }),
            ...(description && { description }),
            ...(questions && { questions }),
            ...(duration && { duration }),
            ...(startTime && { startTime }),
            ...(endTime && { endTime }),
        };

        const exam = await Exam.findByIdAndUpdate(id, updateFields, { new: true });
        if (!exam) {
            return res.status(404).json({ status: "error", message: "Exam not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Exam updated successfully",
            data: { exam },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};

exports.deleteExam = async (req, res) => {
    const { id } = req.params;

    try {
        const exam = await Exam.findByIdAndDelete(id);
        if (!exam) return res.status(404).json({ status: "error", message: "Exam not found" });
        return res.status(200).json({ status: "success", message: "Exam deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error",  message: "Something went wrong. Please try again later." });
    }
};

exports.upcomingExams = async (req, res) => {
  try {
    const currentTime = new Date();

    const exams = await Exam.find({
      startTime: { $gt: currentTime }
    }).sort({ startTime: 1 });

    if (exams.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No upcoming exams found"
      });
    }

    return res.status(200).json({
      status: "success",
      data: exams
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later"
    });
  }
};