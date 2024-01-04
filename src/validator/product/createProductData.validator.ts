import { checkSchema } from "express-validator";
export default checkSchema({
    name: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product name is required!",
    },

    description: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product description is required!",
    },

    size: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product size is required!",
    },

    price: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product price is required!",
    },

    discount: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product discount is required!",
    },

    currency: {
        trim: true,
        notEmpty: true,
        errorMessage: "Currency is required!",
    },

    availability: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product availability is required!",
    },

    preparationTimeInMinute: {
        trim: true,
        notEmpty: true,
        errorMessage: "Preparation time is required!",
    },

    category: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product category is required!",
    },

    ingredients: {
        trim: true,
        notEmpty: true,
        errorMessage: "Product ingredients is required!",
    },
});
