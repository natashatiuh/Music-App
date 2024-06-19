import joi from "joi"

export const deleteAlbumSchema = joi.object({
    albumId: joi.string().required(),
})
