import { checkSchema } from "express-validator";
export default checkSchema({
    name: {
        trim: true,
        notEmpty: true,
        errorMessage: "Category name is required!",
        isLength: {
            options: {
                min: 3,
                max: 50,
            },
            errorMessage: "Category name length should be at most 50 chars!",
        },
    },
});
