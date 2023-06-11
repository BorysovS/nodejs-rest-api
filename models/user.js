const { Schema, model } = require('mongoose');
const Joi = require("joi");

const {handleMongooseError} = require('../helpers');


const userSchema = new Schema({
    password: {
        type: String,
        min: 6,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        required: [true, 'Email is required'],
        unique: true
    },
    subscription: {
        type: String,
        enum: ['starter', 'pro', 'bussines'],
        default: 'starter',
    },
    token: {
        type: String,
        default: null,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    avatarURL: {
        type: String,

    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    }
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string()
        .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        .required(),
    password: Joi.string().min(6).required(),

});

const emailSchema = Joi.object({
    email: Joi.string()
        .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        .required(),
})

const loginSchema = Joi.object({
    email: Joi.string()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .required(),
    password: Joi.string().min(6).required(),
});

const schemas = {
    registerSchema,
    loginSchema,
    emailSchema,
};

const User = model('user', userSchema);

module.exports = {
    schemas,
    User,
}