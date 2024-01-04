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

export interface ICategory {
    name: string;
}

export interface ICreateCategoryRequest extends Request {
    body: {
        name: string;
    };
}

export interface IUpdateCategoryRequest extends Request {
    body: {
        name: string;
    };
}
