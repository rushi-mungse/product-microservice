import express, { Request, RequestHandler, Response } from "express";
import { CategorController } from "../controllers";
import { createCategoryDataValidator } from "../validator";
import { NextFunction } from "express-serve-static-core";
import { ICreateCategoryRequest, IUpdateCategoryRequest } from "../types";
import { AppDataSource } from "../config";
import { Category } from "../entity";
import { CategoryService } from "../services";
const router = express.Router();

const categoryRepository = AppDataSource.getRepository(Category);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategorController(categoryService);

router.get(
    "/",
    (req, res, next) =>
        categoryController.get(req, res, next) as unknown as RequestHandler,
);

router.put(
    "/",
    createCategoryDataValidator,
    (req: ICreateCategoryRequest, res: Response, next: NextFunction) =>
        categoryController.create(req, res, next) as unknown as RequestHandler,
);

router.delete(
    "/:categoryId",
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.delete(req, res, next) as unknown as RequestHandler,
);

router.post(
    "/:categoryId",
    createCategoryDataValidator,
    (req: IUpdateCategoryRequest, res: Response, next: NextFunction) =>
        categoryController.update(req, res, next) as unknown as RequestHandler,
);

export default router;
