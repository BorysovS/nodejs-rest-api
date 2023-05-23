const express = require("express");

const { schemas } = require('../../models/contact');
const ctrl = require('../../controllers/contacts-controllers');
const { validateBody } = require("../../utils");
const { isValidId } = require("../../middlewares");

const router = express.Router();

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put("/:contactId", validateBody(schemas.addSchema), isValidId, ctrl.updateContactById);

router.patch('/:contactId/favorite', isValidId, validateBody(schemas.favoriteSchema), ctrl.updateFavoriteById);

module.exports = router;
