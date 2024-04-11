import joi from "joi"

export const changeUserNameSchema = joi.object({
    newName: joi.string().required(),
})
