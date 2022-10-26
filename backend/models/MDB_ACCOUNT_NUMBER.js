const MONGOOSE      = require('../config/mongo');
const MODEL         = require('./MODEL');
const Schema        = MONGOOSE.Schema;
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(MONGOOSE.con);

const schema    = new Schema({
    user_id:
    {
        type:       String,
        
    },
    account_name:
    {
        type:       String,
    },
    currency:
    {
    	type: 		String,
    },
    currency_name:
    {
        type:       String,
    },
    account_number_code: 
    {
    	type: 		String,

    },
});

class MDB_ACCOUNT_NUMBER extends MODEL
{
	constructor()
	{
        super('account_number', schema);

        schema.plugin(autoIncrement.plugin, {
            model: 'account_number',
            startAt: 10000,
            increment: 1
        });
    }

    async saveAccount(data = {})
    {
        try {
            const collection     = this.collection;
            // sets object to insert
            const modelObj       = new collection(data);

            // confirms the insertion
            const modelRes       = await modelObj.save();

            return modelRes;
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = MDB_ACCOUNT_NUMBER;