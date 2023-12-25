export const errorHandler = (err, req, res, next) => {
  const errorStatus = err.statusCode || 500;
  const errorMessage = err.message || "Something went worng";
  
  return res.status(errorStatus).send(errorMessage);
};
