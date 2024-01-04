import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config";
import createJwtMock from "mock-jwks";
import { Role } from "../../src/constants";
import { Category } from "../../src/entity";

describe("[DELETE] /api/category/:categoryId", () => {
    let connection: DataSource;
    let jwt: ReturnType<typeof createJwtMock>;

    beforeAll(async () => {
        jwt = createJwtMock("http://localhost:5002");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwt.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwt.stop();
    });

    describe("Given all fields", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            const ct = await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .delete(`/api/category/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(200);
        });

        it("should returns the 400 status code if category not found", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .delete(`/api/category/3`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(400);
        });

        it("should persist product category in database", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            await request(app)
                .delete(`/api/category/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            const categories = await categoryRepository.find();
            // assert
            expect(categories).toHaveLength(0);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if categoryId is invalid", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .delete(`/api/category/erw`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(400);
        });
    });
});
