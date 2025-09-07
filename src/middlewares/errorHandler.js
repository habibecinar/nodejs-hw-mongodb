
export default function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
}

