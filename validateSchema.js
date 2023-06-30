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
    shelter: joi.object({
        sheltername: joi.string().required().escapeHTML(),
        email: joi.string().required().escapeHTML(),
        contact: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        description: joi.string().escapeHTML()
    }).required()
});