const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid} = require('nanoid');

const { SECRET_KEY, BASE_URL } = process.env;

const { ctrlWrapper } = require('../utils');
const { HttpError, sendEmail } = require('../helpers');

const { User } = require('../models/user');
 
const avatarDir = path.resolve('public', 'avatars')


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/auth/users/verify/${verificationToken}"> Click to verify your email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({ email: newUser.email, password: newUser.password });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });
    
    res.status(200).json({ message: 'Verification successful' });
};

const resenderVerifyEmail = async (req, res) => { 
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!user) { 
        throw HttpError(404, "User not found");
    }

    if (user.verify) { 
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a href="${BASE_URL}/api/auth/users/verify/${user.verificationToken}"> Click to verify your email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({ message: "Verification email sent" });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    };

    if (!user.verify) { 
        throw HttpError(401, 'User not verification');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        throw HttpError(401, 'Email or password is wrong');
    };
    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({ token, user: { email: user.email, subscription: user.subscription } });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
};

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).json("No Content");
};

const updateAvatar = async (req, res) => { 
    const { _id: id} = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarDir, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join('avatars', filename);

    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);

    await User.findByIdAndUpdate(id, { avatarURL });

    res.json({avatarURL});
}

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resenderVerifyEmail: ctrlWrapper(resenderVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}