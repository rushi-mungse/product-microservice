import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { ProductController } from "../controllers";
import { createProductDataValidator } from "../validator";
import { ICreateProductRequest } from "../types";
import { ProductService } from "../services";
import { AppDataSource } from "../config";
import { Product } from "../entity";
import { checkAccessToken, hasPermission, upload } from "../middlewares";
import { Role } from "../constants";
import { uploadOnCloudinary } from "../config";

const router = express.Router();

const productRepository = AppDataSource.getRepository(Product);
const productService = new ProductService(
    productRepository,
    uploadOnCloudinary,
);
const productController = new ProductController(productService);

router.post(
    "/create",
    [
        checkAccessToken,
        upload.single("image"),
        hasPermission([Role.ADMIN]),
        createProductDataValidator as unknown as RequestHandler,
    ],
    (req: Request, res: Response, next: NextFunction) =>
        productController.create(
            req as ICreateProductRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) =>
        productController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/:productId",
    (req: Request, res: Response, next: NextFunction) =>
        productController.get(req, res, next) as unknown as RequestHandler,
);

router.delete(
    "/:productId",
    [checkAccessToken, hasPermission([Role.ADMIN])],
    (req: Request, res: Response, next: NextFunction) =>
        productController.delete(req, res, next) as unknown as RequestHandler,
);

export default router;
