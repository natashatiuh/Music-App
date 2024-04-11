import joi from "joi"

export const changePasswordSchema = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
})
