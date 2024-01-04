import { NextFunction, Request, Response } from "express";
import { ICreateCategoryRequest, IUpdateCategoryRequest } from "../types";
import { validationResult } from "express-validator";
import { CategoryService } from "../services";
import createHttpError from "http-errors";

class CategorController {
    constructor(private categoryService: CategoryService) {}

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this.categoryService.getAll();
            return res.json({ categories });
        } catch (error) {
            return next(error);
        }
    }

    async create(
        req: ICreateCategoryRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const { name } = req.body;
        try {
            const category = await this.categoryService.save({ name });
            return res.status(201).json({
                category,
                message: "Product category created successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.categoryId;
        if (isNaN(Number(categoryId)))
            return next(createHttpError(400, "Invalid category id!"));

        try {
            const category = await this.categoryService.findById(
                Number(categoryId),
            );
            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );
            await this.categoryService.delete(Number(categoryId));
            return res.json({
                id: categoryId,
                message: "Product category deleted successfully",
            });
        } catch (error) {
            return next(error);
        }
    }

    async update(
        req: IUpdateCategoryRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const categoryId = req.params.categoryId;
        if (isNaN(Number(categoryId)))
            return next(createHttpError(400, "Invalid category id!"));

        const { name } = req.body;
        try {
            const category = await this.categoryService.findById(
                Number(categoryId),
            );

            if (!category)
                return next(
                    createHttpError(400, "Product category not found!"),
                );

            category.name = name;
            await this.categoryService.save(category);

            return res.json({
                category,
                message: "Product category updated successfully",
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default CategorController;
