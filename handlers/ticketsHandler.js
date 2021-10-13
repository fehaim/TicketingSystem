var createError = require('http-errors');

const ticketsCollectionName = config.mongo.ticketsCollectionName;
const usersCollectionName = config.mongo.usersCollectionName;
const rolesCollectionName = config.mongo.rolesCollectionName;
const _ = require('lodash');
//what happens when adding field to one Ticket?
//update Ticket
//add field to Ticket
//delete Ticket



readinessEventEmitter.once("mongoClient", async function () {
    const defaultTicket = {
        _id : 'defaultTicket',
        Summary : '' ,
        Description : '' ,
        Assignee : '' ,
        Priority : '' ,
        SLA : '' ,
        Resolution : '' ,
        ParentId : '' ,
    }
    await storage.createItemIfNotExists(defaultTicket, ticketsCollectionName );
    console.log('default ticket inserted');
});

module.exports = {
    getTicketById: async function( req, res ) {
        try {
            const ticketId = req.params.ticketId;
            const userId = req.query.userId;

            if (!userId) {
                throw createError(400);
            }
            const user = await storage.findItemById( userId, usersCollectionName );
            if (!user) {
                throw createError(404);
            }
            let [roleObj , ticketObj, defaultsObj] = await Promise.all([storage.findItemById( user.role, rolesCollectionName ),
                storage.findItemById( ticketId, ticketsCollectionName ) , storage.findItemById( 'defaultTicket', ticketsCollectionName )]);

            if (!roleObj || !ticketObj || !defaultsObj) {
                throw createError(404);
            }
            //combine ticket with defaults Ticket
            ticketObj = _.defaultsDeep(ticketObj, defaultsObj);
            Object.keys(ticketObj).forEach(k => { if (!defaultsObj[k]){delete ticketObj[k]}});

            const results = {
                ticketData: ticketObj,
                roleObj: roleObj
            };
            res.status(200).send(results);
        } catch (e) {
            console.error('error getting Ticket. message', e.message );
            res.status(e.statusCode || 500).send();
        }
    },
    createTicket: async function(req,res) {
        try {
            const ticketId = req.params.ticketId;
            const Ticket = req.body;
            //TODO validate body with role and default ticket
            Ticket._id = ticketId;
            await storage.insertItem( Ticket , ticketsCollectionName );
            res.status(200).send('Ticket inserted successfuly');
        } catch (e) {
            console.error('error creating Ticket message', e.message );
            res.status(e.statusCode || 500).send();
        }
    },
    updateTicket: async function(req,res) {
        try {
            const ticketId = req.params.ticketId;
            const Ticket = req.body;
            const results = await storage.updateItem( ticketId , Ticket , ticketsCollectionName );
            res.status(200).send(results);
        } catch (e) {
            console.error('error creating Ticket message', e.message );
            res.status(e.statusCode || 500).send();
        }
    },
    addField: async function( req, res ) {
        try {
            const field = req.body;
            //Todo add default roles to all roles
            let newField = {};
            newField[Object.keys(field)[0]] = '_';
            await storage.updateItem( "defaultTicket" , field , ticketsCollectionName );
            await storage.updateAll( newField , rolesCollectionName );
            res.status(200).send('field added');
        } catch (e) {
            console.error('error creating Ticket message', e.message );
            res.status(e.statusCode || 500).send();
        }
    },
    removeField: async function( req, res ) {
        try {
            const Ticket = req.body;
            const results = await storage.deleteFields( "defaultTicket" , Ticket , ticketsCollectionName );
            //optoinal: Todo trigger backround job to delete fields
            res.status(200).send(results);
        } catch (e) {
            console.error('error creating Ticket message', e.message );
            res.status(e.statusCode || 500).send();
        }
    },

};