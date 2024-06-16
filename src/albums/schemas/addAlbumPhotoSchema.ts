import joi from "joi"

export const addAlbumPhotoSchema = joi.object({
    photo: joi.string().required(),
    albumId: joi.string().required(),
    artistId: joi.string().required(),
})
