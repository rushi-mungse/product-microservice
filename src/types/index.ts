import { Request } from "express";

export interface ICreateProductRequest extends Request {
    body: {
        name: string;
        description: string;
        price: number;
        size: string;
        currency: string;
        availability: boolean;
        preparationTimeInMinute: number;
        discount: number;
        category: string;
        ingredients: string;
    };
}

export interface IProduct {
    name: string;
    description: string;
    price: number;
    size: string;
    currency: string;
    availability: boolean;
    preparationTimeInMinute: number;
    discount: number;
    category: string;
    ingredients: string;
    imageUrl: string;
}
