import joi from "joi"

export const signUpArtistSchema = joi.object({
    userName: joi.string().required(),
    password: joi.string().required(),
    country: joi.string().required(),
    artistAge: joi.number().required(),
})
