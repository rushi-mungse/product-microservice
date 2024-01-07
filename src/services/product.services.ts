import { Repository } from "typeorm";
import { Product } from "../entity";
import { IProduct } from "../types";
import { UploadApiResponse } from "cloudinary";

class ProductService {
    constructor(
        private productRepository: Repository<Product>,
        private uploadeOnCloudinary: (T: string) => Promise<UploadApiResponse>,
    ) {}

    async create(product: IProduct) {
        return await this.productRepository.save(product);
    }

    async uploadFile(localFilePath: string) {
        return await this.uploadeOnCloudinary(localFilePath);
    }

    async getProducts() {
        return await this.productRepository.find();
    }

    async deleteProduct(productId: number) {
        await this.productRepository.delete(productId);
    }

    async findProductById(productId: number) {
        return await this.productRepository.findOne({
            where: { id: productId },
        });
    }
}

export default ProductService;
