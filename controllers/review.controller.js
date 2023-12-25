import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

//Create Review
export const createReview = async (req, res) => {
  if (req.isSeller)
    throw new UnauthenticatedError("Sellers can't create a review");

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  const review = await Review.findOne({
    gigId: req.body.gigId,
    userId: req.userId,
  });

  if (review)
    throw new UnauthenticatedError("You have already created a review");

  const savedReview = await newReview.save();

  await Gig.findByIdAndUpdate(req.body.gigId, {
    $inc: { totalStar: req.body.star, starNumber: 1 },
  });

  res.status(StatusCodes.CREATED).send(savedReview);
};

//Get Reviews
export const getReviews = async (req, res) => {

  const reviews = await Review.find({ gigId: req.params.gigId });

  res.status(StatusCodes.OK).send(reviews);
};

//Delete Review
export const deleteReview = async (req, res) => {};
