import joi from "joi"

export const addAlbumSchema = joi.object({
    name: joi.string().required(),
})
