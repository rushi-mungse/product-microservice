import { NextFunction, Request, Response } from "express";
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

            const product = await this.productService.save({
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

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await this.productService.getProducts();
            return res.json({
                products,
                message: "all product featched successfully.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product id!"));

        try {
            const product = await this.productService.findProductById(
                Number(productId),
            );
            if (!product)
                return next(createHttpError(400, "Product not found!"));
            await this.productService.deleteProduct(Number(productId));
        } catch (error) {
            return next(error);
        }
        res.json({ productId, message: "Product deleted successfully." });
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product Id"));

        try {
            const product = await this.productService.findProductById(
                Number(productId),
            );
            if (!product) next(createHttpError(400, "Product not found!"));

            return res.json({ product });
        } catch (error) {
            return next(error);
        }
    }

    async update(
        req: ICreateProductRequest,
        res: Response,
        next: NextFunction,
    ) {
        const productId = req.params.productId;
        if (isNaN(Number(productId)))
            return next(createHttpError(400, "Invalid product id!"));

        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: result.array() });

        const file = req.file;

        const {
            name,
            description,
            price,
            size,
            currency,
            availability,
            preparationTimeInMinute,
            discount,
            category,
            ingredients,
        } = req.body;

        try {
            const product = await this.productService.findProductById(
                Number(productId),
            );
            if (!product)
                return next(createHttpError(400, "Product not found!"));

            product.name = name;
            product.description = description;
            product.availability =
                String(availability) === "true" ? true : false;
            product.category = category;
            product.currency = currency;
            product.discount = discount;
            product.size = size;
            product.preparationTimeInMinute = preparationTimeInMinute;
            product.ingredients = ingredients;
            product.price = price;

            if (file) {
                const uploadFileResponse = await this.productService.uploadFile(
                    file.path,
                );
                product.imageUrl = uploadFileResponse.url;
            }

            await this.productService.save(product);
            return res.json({
                product,
                message: "Product updated successfully.",
            });
        } catch (error) {
            next(error);
        }

        return res.json({ ok: true });
    }
}

export default ProductController;
