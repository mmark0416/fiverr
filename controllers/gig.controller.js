import { StatusCodes } from "http-status-codes";
import { NotFoundError, UnauthenticatedError } from "../errors/customError.js";
import Gig from "../models/gig.model.js";

export const createGig = async (req, res) => {
  if (!req.isSeller)
    throw new UnauthenticatedError("Only sellers can create a gig!");

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  const savedGig = await newGig.save();

  res.status(StatusCodes.CREATED).json(savedGig);
};
export const deleteGig = async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (gig.userId !== req.userId)
    throw new UnauthenticatedError("You can delete only your gig!");

  await Gig.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).send("Gig has been deleted!");
};
export const getGig = async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) throw new NotFoundError("Gig not found!");

  res.status(StatusCodes.OK).send(gig);
};
export const getGigs = async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
  res.status(StatusCodes.OK).send(gigs);
};
