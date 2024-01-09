import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config";
import createJwtMock from "mock-jwks";
import { Role } from "../../src/constants";
import { Product } from "../../src/entity";
import path from "path";

const TIMEOUT_INTERVAL = 10000;

describe("[POST] /api/product/update/:productId", () => {
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
        ingredients: "Protein",
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
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza1")
                .field("description", "This is pizza food from heart.")
                .field("discount", 20)
                .field("size", "small")
                .field("price", 200)
                .field("availability", true)
                .field("category", "pizza")
                .field("preparationTimeInMinute", 50)
                .field("currency", "doller")
                .field("ingredients", [`protein`, `vitamine`]);

            // assert
            expect(updateProductResponse.statusCode).toBe(200);
        });

        it("should return json data", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza1")
                .field("description", "This is pizza food from heart.")
                .field("discount", 10)
                .field("size", "small")
                .field("price", 200)
                .field("availability", true)
                .field("category", "pizza")
                .field("preparationTimeInMinute", 50)
                .field("currency", "doller")
                .field("ingredients", "Protein");

            // assert
            expect(
                (updateProductResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist product in database", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .field("name", "pizza1")
                .field("description", "This is pizza food from heart.")
                .field("discount", 10)
                .field("size", "small")
                .field("price", 200)
                .field("availability", true)
                .field("category", "pizza")
                .field("preparationTimeInMinute", 50)
                .field("currency", "doller")
                .field("ingredients", [`protein`, `vitamine`]);

            // assert
            const products = await productRepository.find();
            expect(products[0].name).toEqual("pizza1");
            expect(products).toHaveLength(1);
        });

        it(
            "should persist product image in database",
            async () => {
                // arrange
                const productRepository = connection.getRepository(Product);
                await productRepository.save(product);

                const adminAccessToken = jwt.token({
                    userId: "1",
                    role: Role.ADMIN,
                });

                const testPathfile = path.resolve(
                    __dirname,
                    "../utils/img/test.jpeg",
                );

                // act
                await request(app)
                    .post(`/api/product/update/1`)
                    .set("Cookie", [`accessToken=${adminAccessToken}`])
                    .field("name", "pizza")
                    .field("description", "This is pizza food from heart.")
                    .field("discount", 20)
                    .field("size", "small")
                    .field("price", 200)
                    .field("availability", true)
                    .field("category", "pizza")
                    .field("preparationTimeInMinute", 50)
                    .field("currency", "doller")
                    .field("ingredients", [`protein`, `vitamine`])
                    .attach("image", testPathfile);

                // assert
                const products = await productRepository.find();
                expect(products[0].imageUrl).not.toBe(product.imageUrl);
            },
            TIMEOUT_INTERVAL,
        );
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if name is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, name: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if description is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, description: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if size is missing", async () => {
            // arrange
            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, size: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if price is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, price: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if availability is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, availability: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if preparation time is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, preparationTimeInMinute: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if category is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, category: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if ingredients is missing", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const updateProductResponse = await request(app)
                .post(`/api/product/update/1`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, ingredients: "" });

            // assert
            expect(updateProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if product id is invalid", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const deleteProductResponse = await request(app)
                .delete("/api/product/sdfd")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(deleteProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if product id is not found", async () => {
            // arrange
            const productRepository = connection.getRepository(Product);
            await productRepository.save(product);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const deleteProductResponse = await request(app)
                .delete("/api/product/2")
                .set("Cookie", [`accessToken=${adminAccessToken}`]);

            // assert
            expect(deleteProductResponse.statusCode).toBe(400);
        });
    });
});
