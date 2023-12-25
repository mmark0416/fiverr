import { UnauthorizedError } from "../errors/customError.js";
import User from "../models/user.model.js";

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    throw new UnauthorizedError("You can delete only your account");
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted");
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};