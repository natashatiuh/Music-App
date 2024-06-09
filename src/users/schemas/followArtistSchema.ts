import joi from "joi"

export const followArtistSchema = joi.object({
    artistId: joi.string().required(),
})
