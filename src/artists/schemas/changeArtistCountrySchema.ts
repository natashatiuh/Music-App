import joi from "joi"

export const changeArtistCountrySchema = joi.object({
    newCountry: joi.string().required(),
})
