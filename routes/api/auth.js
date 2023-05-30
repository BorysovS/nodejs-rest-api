const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth-controllers');
const { validateBody } = require('../../utils');
const { schemas } = require('../../models/user');
const { authentificate } = require('../../middlewares');

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authentificate, ctrl.getCurrent);

router.post('/logout',authentificate, ctrl.logout);

module.exports = router;