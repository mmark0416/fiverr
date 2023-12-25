import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError, NotFoundError } from "../errors/customError.js";

export const register = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throw new BadRequestError("Email already exists");
  const hash = bcrypt.hashSync(req.body.password, 10);
  const newUser = new User({
    ...req.body,
    password: hash,
  });
  await newUser.save();
  res.status(201).send("User has been created");
};

export const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) throw new NotFoundError("User not found");

  const isCorrect = bcrypt.compareSync(req.body.password, user.password);
  if (!isCorrect) throw new BadRequestError("Wrong password or username");

  const token = jwt.sign(
    {
      id: user._id,
      isSeller: user.isSeller,
    },
    process.env.JWT_KEY
  );

  const { password, ...info } = user._doc;

  res
    .cookie("accessToken", token, {
      httpOnly: true,
    })
    .status(200)
    .send(info);
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      someSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
