const express = require('express');
const router = express.Router();
const rolesHandler = require('../handlers/rolesHandler');

const roleId = '/:roleId';

/* GET users listing. */
router.get('/', rolesHandler.getRoles);
router.get(roleId, rolesHandler.getRoleById);
router.post(roleId, rolesHandler.createRole);
router.put(roleId, rolesHandler.updateRole);

module.exports = router;
