import jwt from "jsonwebtoken";
import { NotFoundError, UnauthenticatedError } from "../errors/customError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) throw new UnauthenticatedError("You are not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err)  throw new NotFoundError("Token is not valid!")
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
  });
  next()
};
