import "reflect-metadata";
import express from "express";
import { errorHandlerMiddleware } from "./middlewares";
import { productRouter } from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

app.use("/api/product", productRouter);

app.use(errorHandlerMiddleware);

export default app;
