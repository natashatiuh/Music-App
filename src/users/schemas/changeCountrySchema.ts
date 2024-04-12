import joi from "joi"

export const changeCountrySchema = joi.object({
    newCountry: joi.string().required(),
})
