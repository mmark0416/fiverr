import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";
import 'express-async-errors';
import cors from "cors"

//Routes
import userRouter from "./routes/user.router.js";
import conversationRouter from "./routes/conversation.router.js";
import MessageRouter from "./routes/message.router.js";
import gigRouter from "./routes/gig.router.js";
import reviewRouter from "./routes/review.router.js";
import orderRouter from "./routes/order.router.js";
import authRouter from "./routes/auth.router.js";

//Middleware
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/messages", MessageRouter);

app.use(errorHandler)

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Server is listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
