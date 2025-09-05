export const errorHandler = (err, req, res) => {
  console.error(err);

  const statusCode = err.status || 500;  // Eğer hata objesinde status yoksa 500
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: err.data || null,
  });
};
