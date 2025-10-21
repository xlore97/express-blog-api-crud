module.exports = (req, res, next) => {
    res.status(404).json({
        error: "Endpoint non trovato",
        path: req.originalUrl,
        method: req.method,
    });
};
