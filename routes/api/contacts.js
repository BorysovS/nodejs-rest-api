const express = require("express");

const { schemas } = require('../../models/contact');
const ctrl = require('../../controllers/contacts-controllers');
const { validateBody } = require("../../utils");
const { isValidId, authentificate } = require("../../middlewares");

const router = express.Router();

router.get("/",authentificate, ctrl.getAllContacts);

router.get("/:contactId", authentificate, isValidId, ctrl.getContactById);

router.post("/", authentificate, validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId",authentificate, isValidId, ctrl.removeContact);

router.put("/:contactId",authentificate, validateBody(schemas.addSchema), isValidId, ctrl.updateContactById);

router.patch('/:contactId/favorite',authentificate, isValidId, validateBody(schemas.favoriteSchema), ctrl.updateFavoriteById);

module.exports = router;
