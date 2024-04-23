import joi from "joi"

export const changeArtistPassword = joi.object({
    newPassword: joi.string().required(),
    oldPassword: joi.string().required(),
    userId: joi.string().required(),
})
