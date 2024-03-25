import joi from "joi"

export const signInUserSchema = joi.object({
    userName: joi.string().required(),
    password: joi.string().required(),
})
