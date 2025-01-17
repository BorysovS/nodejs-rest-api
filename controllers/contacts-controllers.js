const { ctrlWrapper } = require('../utils');
const { Contact } = require('../models/contact');
const { HttpError } = require('../helpers');

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite} = req.query;
    const skip = (page - 1) * limit;
    const query = {owner}
    if (favorite) { query.favorite = favorite === 'true' };
    const result = await Contact.find(query, '-createdAt -updatedAt', { skip, limit }).populate("owner", "email subscription");
    
    res.json(result);
}

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        throw HttpError(404, 'Not Found')
    }
    res.json(result)
}

const addContact = async (req, res) => {
    const { _id: owner} = req.user
    const result = await Contact.create({...req.body, owner });
    console.log(req.user)
    res.status(201).json(result);
}

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404, 'Not Found');
    }
    res.status(200).json(result);

}

const updateContactById = async (req, res) => { 
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!result) {
        throw HttpError(404, 'Not Found');
    }
    res.json(result);
}

const updateFavoriteById = async (req, res) => {
    const { contactId } = req.params;
    if (!req.body) {
        throw HttpError(400, 'missing field favorite');
        
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            throw HttpError(404, 'Not Found');
        }
    res.json(result);
}

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    addContact: ctrlWrapper(addContact),
    getContactById: ctrlWrapper(getContactById),
    removeContact: ctrlWrapper(removeContact),
    updateContactById: ctrlWrapper(updateContactById),
    updateFavoriteById: ctrlWrapper(updateFavoriteById),
}