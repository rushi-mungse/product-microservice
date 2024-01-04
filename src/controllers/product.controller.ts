import { NextFunction, Response } from "express";
import { ICreateProductRequest } from "../types";
import { validationResult } from "express-validator";
import { ProductService } from "../services";

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

        // const file = req.file;
        // if (!file) return next(createHttpError(400, "Product image not found"));

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
            const product = await this.productService.create({
                name,
                description,
                imageUrl: "product-image-url",
                price: Number(price),
                size,
                discount: Number(discount),
                currency,
                availability: Boolean(availability),
                ingredients,
                preparationTimeInMinute: Number(preparationTimeInMinute),
                category,
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
