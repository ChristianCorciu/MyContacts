export default function errorHandler(err, req, res, next) {
  console.error("Erreur:", err);

  if (res.headersSent) {
    return next(err); 
  }

  const statusCode = err.status || 500;
  const message = err.message || "Erreur serveur interne";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
