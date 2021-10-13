const rolesCollectionName = config.mongo.rolesCollectionName;


const none = '-';
const read = 'R';
const write = 'W';

function role(roleId,Summary,Description,Assignee,Priority,SLA,Resolution,ParentId) {
    this._id = roleId;
    this.Summary = Summary || none ;
    this.Description = Description || none ;
    this.Assignee = Assignee || none ;
    this.Priority = Priority || none ;
    this.SLA = SLA || none ;
    this.Resolution = Resolution || none ;
    this.ParentId = ParentId || none ;
}

readinessEventEmitter.once("mongoClient", async function () {
    await storage.createItemIfNotExists( new role('Worker', write,write,write), rolesCollectionName );
    await storage.createItemIfNotExists( new role('Manager', write,write,write,write,write), rolesCollectionName );
    await storage.createItemIfNotExists( new role('Admin', write,write,write,write,write,write,write), rolesCollectionName );
    await storage.createItemIfNotExists( new role('SuperAdmin', write,write,write,write,write,write,write), rolesCollectionName );
    console.log('default roles ticket inserted');
});

//what happens when adding field to one role?
//update role
//add field to role
//delete role


module.exports = {
    getRoles: async function( req, res ) {
        try {
            const results = await storage.getItems( rolesCollectionName );
            //combine results default Ticket
            res.status(200).send(results);
        } catch (e) {
            console.error('error getting Roles. message', e.message );
            throw e;
        }
    },
    getRoleById: async function( req, res ) {
        try {
            const roleId = req.params.roleId;
            const results = await storage.findItemById( roleId, rolesCollectionName );
            //combine results default role
            res.status(200).send(results);
        } catch (e) {
            console.error('error getting role. message', e.message );
            throw e;
        }

    },
    createRole: async function(req,res) {
        try {
            const roleId = req.params.roleId;
            const role = req.body;
            role._id = roleId;
            const results = await storage.insertItem( role , rolesCollectionName );
            res.status(200).send(results);
        } catch (e) {
            console.error('error creating role message', e.message );
            throw e;
        }

    },
    updateRole: async function(req,res) {
        try {
            const roleId = req.params.roleId;
            const role = req.body;
            const results = await storage.updateItem( roleId , role , rolesCollectionName );
            res.status(200).send(results);
        } catch (e) {
            console.error('error creating role message', e.message );
            throw e;
        }
    },
    getRoleIds: async function(req,res) {/*not implemented*/}
};