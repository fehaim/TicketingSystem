const express = require('express');
const router = express.Router();
const ticketHandler = require('../handlers/ticketsHandler');

const ticketId = '/:ticketId';
const addField = '/addField';
const deleteField = '/deleteField';

/* GET users listing. */
router.put(deleteField, ticketHandler.removeField);
router.put(addField, ticketHandler.addField);
router.get(ticketId, ticketHandler.getTicketById);
router.post(ticketId, ticketHandler.createTicket);
router.put(ticketId, ticketHandler.updateTicket);

module.exports = router;

