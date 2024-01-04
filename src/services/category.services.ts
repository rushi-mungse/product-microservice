import { Repository } from "typeorm";
import { Category } from "../entity";
import { ICategory } from "../types";

class CategoryService {
    constructor(private categoryRepository: Repository<Category>) {}

    async save(category: ICategory) {
        return await this.categoryRepository.save(category);
    }

    async getAll() {
        return await this.categoryRepository.find();
    }

    async findById(categoryId: number) {
        return await this.categoryRepository.findOne({
            where: { id: categoryId },
        });
    }

    async delete(categoryId: number) {
        await this.categoryRepository.delete(categoryId);
    }
}

export default CategoryService;
