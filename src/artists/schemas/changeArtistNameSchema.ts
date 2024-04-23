import joi from "joi"

export const changeArtistName = joi.object({
    newName: joi.string().required(),
})
