const usersCollectionName = config.mongo.usersCollectionName;

//what happens when adding field to one user?
//update user
//add field to user
//delete user

module.exports = {
    getUsers: async function(req,res) {/*not implemented*/},
    getUserById: async function( req, res ) {
        try {
            const userId = req.params.userId;
            const results = await storage.findItemById( userId, usersCollectionName );
            if (results) {
                res.status(200).send(results);
            } else {
                res.status(404).send();
            }

        } catch (e) {
            console.error('error getting user. message', e.message );
            throw e;
        }

    },
    createUser: async function(req,res) {
        try {
            const userId = req.params.userId;
            const user = req.body;
            user._id = userId;
            await storage.insertItem( user , usersCollectionName );
            res.status(200).send('user inserted successfuly');
        } catch (e) {
            console.error('error creating user message', e.message );
            throw e;
        }

    },
    updateUser: async function(req,res) {
        try {
            const userId = req.params.userId;
            const user = req.body;
            await storage.updateItem( userId , user , usersCollectionName );
            res.status(200).send('user updated successfuly');
        } catch (e) {
            console.error('error creating user message', e.message );
            throw e;
        }
    }
};