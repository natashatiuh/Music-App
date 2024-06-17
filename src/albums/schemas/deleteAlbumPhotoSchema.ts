import joi from "joi"

export const deleteAlbumPhotoSchema = joi.object({
    albumId: joi.string().required(),
})
