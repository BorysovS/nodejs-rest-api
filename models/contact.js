const { Schema, model } = require('mongoose')
const Joi = require("joi");

const {handleMongooseError} = require('../helpers')

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contacts'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        match: /^\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
        required: [true, 'Set phone number for contact']
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleMongooseError);

const addSchema  = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\d{3}-\d{2}-\d{2}$/)
    .required(),
});

const favoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

const schemas = {
    addSchema,
    favoriteSchema,
}

const Contact = model('contact', contactSchema);

module.exports = {
    Contact,
    schemas,
};
