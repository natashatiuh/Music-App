import joi from "joi"

export const signUpUserSchema = joi.object({
    userName: joi.string().required(),
    password: joi.string().required(),
    country: joi.string().required(),
    userAge: joi.number().required(),
})
