const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not incluce HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.shelterSchema = joi.object({
    sheltername: joi.string().required(),
    email: joi.string().required().escapeHTML(),
    mobnumber: joi.string().required().escapeHTML(),
    location: joi.string().required().escapeHTML(),
    description: joi.string().escapeHTML(),
    password: joi.string().required().escapeHTML(),
    confPassword: joi.string().required().escapeHTML()
});

module.exports.reviewSchema = joi.object({
    Review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required().escapeHTML()
    }).required()
});

module.exports.adoptionSchema = joi.object({
    species: joi.string().required().escapeHTML(),
    name: joi.string().required().escapeHTML(),
    age: joi.number().required(),
    details: joi.string().escapeHTML(),
    gender: joi.string().required()
});

module.exports.rescueSchema = joi.object({
    species: joi.string().required().escapeHTML(),
    severe: joi.string().required(),
    description: joi.string().escapeHTML(),
    locality: joi.string().required().escapeHTML(),
    callerContact: joi.string().required().escapeHTML(),
    identification: joi.string().escapeHTML()
});