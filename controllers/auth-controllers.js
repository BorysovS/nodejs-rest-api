const bcrypt = require("bcrypt");

const { ctrlWrapper } = require('../utils');
const { HttpError } = require('../helpers');

const { User } = require('../models/user');


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.json({ email: newUser.email, password: newUser.password });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) { 
        throw HttpError(401, 'Email or password is wrong');
    };

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
            throw HttpError(401, 'Email or password is wrong');
    };

    const token = 'token43545tokenTest';

    res.json({ token, });


}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}