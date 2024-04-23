import joi from "joi"

export const signInArtistSchema = joi.object({
    userName: joi.string().required(),
    password: joi.string().required,
})
