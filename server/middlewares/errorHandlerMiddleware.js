module.exports = (err, req, res, next) => {
    console.error("Error: ", err);

    if(res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || err || "Something went wrong, please try again later.";

    res.status(statusCode).json({
        status: 'fail',
        error: message
    });
};