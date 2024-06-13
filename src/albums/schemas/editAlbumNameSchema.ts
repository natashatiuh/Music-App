import joi from "joi"

export const editAlbumNameSchema = joi.object({
    newName: joi.string().required(),
    albumId: joi.string().required(),
})
