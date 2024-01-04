import { Repository } from "typeorm";
import { Product } from "../entity";
import { IProduct } from "../types";

class ProductService {
    constructor(private productRepository: Repository<Product>) {}

    async create(product: IProduct) {
        return await this.productRepository.save(product);
    }
}

export default ProductService;
