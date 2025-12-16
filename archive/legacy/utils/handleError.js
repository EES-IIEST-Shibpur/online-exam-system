const handleError = (res, error, message = 'Something went wrong') => {
    console.error(error);
    res.status(500).json({ status: "error", message, error: error.message});
};

module.exports = {
    handleError
};