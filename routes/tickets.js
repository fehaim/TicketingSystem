const express = require('express');
const router = express.Router();
const ticketHandler = require('../handlers/ticketsHandler');

const ticketId = '/:ticketId';
const addField = '/field';
const deleteField = '/field/:fieldId';

/* GET users listing. */
router.delete(deleteField, ticketHandler.removeField);
router.put(addField, ticketHandler.addField);
router.get(ticketId, ticketHandler.getTicketById);
router.post(ticketId, ticketHandler.createTicket);
router.put(ticketId, ticketHandler.updateTicket);

module.exports = router;

