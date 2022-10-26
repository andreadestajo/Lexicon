const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;

const schema    = new Schema({
    is_fiat:
    {
        type:       Boolean,
        default:    true
    },
    number_code:
    {
        type:       String,
    },
    abbreviation:
    {
    	type: 		String,
    	required: 	true
    },
    name:
    {
        type:       String,
        required:   true
    },
    decimal_places: 
    {
    	type: 		Number,
        required:   true
    }
});

class MDB_CURRENCY extends MODEL
{
	constructor()
	{
		super('currencies', schema);
    }
    
    async findByAbbreviation(abbreviation)
    {
        const res = await this.collection.findOne({abbreviation: abbreviation});
        return res ? res : null;
    }

    async findSupportedCurrency()
    {
        const res = await this.collection.find();
        return res ? res : null;
    }

    async findByNumberCode(currency)
    {
        const res = await this.collection.findOne({number_code: currency});
        return res ? res : null;
    }
}

module.exports = MDB_CURRENCY;