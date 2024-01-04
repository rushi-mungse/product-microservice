import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config";
import createJwtMock from "mock-jwks";
import { Role } from "../../src/constants";
import { Product } from "../../src/entity";

describe("[POST] /api/product/create", () => {
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
        image: "ewerwer",
        availability: true,
        preparationTimeInMinute: 30,
        discount: 40,
        category: "pizza",
        ingredients: ["protien", "vitamine"],
    };

    describe("Given all fields", () => {
        it("should returns the 201 status code if all ok", async () => {
            // arrange
            // const user = {
            //     fullName: "Jon Doe",
            //     email: "jon.doe@gmail.com",
            //     password: "secret@password",
            //     role: Role.ADMIN,
            // };

            //// const userRepository = connection.getRepository(User);
            // // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send(product);

            // assert
            expect(createProductResponse.statusCode).toBe(201);
        });

        it("should return json data", async () => {
            // arrange
            // const user = {
            //     fullName: "Jon Doe",
            //     email: "jon.doe@gmail.com",
            //     password: "secret@password",
            //     role: Role.ADMIN,
            // };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send(product);

            // assert
            expect(
                (createProductResponse.headers as Record<string, string>)[
                    "content-type"
                ],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist product in database", async () => {
            // arrange
            // const user = {
            //     fullName: "Jon Doe",
            //     email: "jon.doe@gmail.com",
            //     password: "secret@password",
            //     role: Role.ADMIN,
            // };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send(product);

            // assert
            const productRepository = connection.getRepository(Product);
            const products = await productRepository.find();
            expect(products).toHaveLength(1);
        });
    });

    describe("Some fields are missing", () => {
        it("should returns the 400 status code if name is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, name: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if description is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, description: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if size is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, size: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if price is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, price: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if availability is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, availability: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if preparation time is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, preparationTimeInMinute: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if category is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, category: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });

        it("should returns the 400 status code if ingredients is missing", async () => {
            // arrange
            const user = {
                fullName: "Jon Doe",
                email: "jon.doe@gmail.com",
                password: "secret@password",
                role: Role.ADMIN,
            };

            // const userRepository = connection.getRepository(User);
            // await userRepository.save(user);

            const adminAccessToken = jwt.token({
                userId: "1",
                role: Role.ADMIN,
            });

            // act
            const createProductResponse = await request(app)
                .post(`/api/product/create`)
                .set("Cookie", [`accessToken=${adminAccessToken}`])
                .send({ ...product, ingredients: "" });

            // assert
            expect(createProductResponse.statusCode).toBe(400);
        });
    });
});
