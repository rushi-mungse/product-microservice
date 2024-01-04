import { NextFunction, Response } from "express";
import { ICreateProductRequest } from "../types";
import { validationResult } from "express-validator";
import { ProductService } from "../services";
import createHttpError from "http-errors";

class ProductController {
    constructor(private productService: ProductService) {}

    async create(
        req: ICreateProductRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const file = req.file;
        if (!file) return next(createHttpError(400, "Product image not found"));

        const {
            name,
            description,
            price,
            size,
            discount,
            currency,
            availability,
            ingredients,
            preparationTimeInMinute,
            category,
        } = req.body;

        try {
            const uploadFileResponse = await this.productService.uploadFile(
                file.path,
            );

            const product = await this.productService.create({
                name,
                description,
                size,
                currency,
                ingredients,
                category,
                imageUrl: uploadFileResponse.url,
                price: Number(price),
                discount: Number(discount),
                availability: Boolean(availability),
                preparationTimeInMinute: Number(preparationTimeInMinute),
            });

            res.status(201).json({
                product,
                message: "Product created successfully.",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ProductController;
