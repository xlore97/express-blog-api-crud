module.exports = (err, req, res, next) => {
    console.error("💥 Errore catturato dal middleware:", err);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const message = err.message || "Errore interno del server";

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
    });
};