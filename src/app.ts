import "reflect-metadata";
import express from "express";
import { errorHandlerMiddleware } from "./middlewares";
import { productRouter, categoryRouter } from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);

app.use(errorHandlerMiddleware);

export default app;
