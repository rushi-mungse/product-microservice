import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config";
import createJwtMock from "mock-jwks";
import { Role } from "../../src/constants";
import { Product } from "../../src/entity";

describe("[GET] /api/product", () => {
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

    const product = {
        name: "Margarita",
        description: "This is very healthy pizza.",
        price: 200,
        size: "small",
        currency: "IND",
        imageUrl: "ewerwer",
        availability: true,
        preparationTimeInMinute: 30,
        discount: 40,
        category: "pizza",
        ingredients: "protein",
    };

    describe("Given all fields", () => {
        it("should returns the 200 status code if all ok", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const getAllProductsResponse = await request(app)
                .get("/api/product")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(getAllProductsResponse.statusCode).toBe(200);
        });

        it("should return json data", async () => {
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const getAllProductsResponse = await request(app)
                .get("/api/product")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(
                (getAllProductsResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });
    });
});
