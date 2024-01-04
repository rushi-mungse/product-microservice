import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config";
import createJwtMock from "mock-jwks";
import { Role } from "../../src/constants";
import { Category } from "../../src/entity";

describe("[GET] /api/category", () => {
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
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .get(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.statusCode).toBe(200);
        });

        it("should returns the json data with categories", async () => {
            // arrange
            const categoryRepository = connection.getRepository(Category);
            await categoryRepository.save({ name: "pizza" });

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createCategoryResponse = await request(app)
                .get(`/api/category`)
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(createCategoryResponse.body.categories).toHaveLength(1);
        });
    });
});
