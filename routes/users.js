const express = require('express');
const router = express.Router();
const userHandler = require('../handlers/usersHandler');

const userId = '/:userId';

/* GET users listing. */
router.get(userId, userHandler.getUserById);
router.post(userId, userHandler.createUser);
router.put(userId, userHandler.updateUser);

module.exports = router;
