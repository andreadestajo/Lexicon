const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;

const schema    = new Schema({
    currency_abbreviation: 
    {
        type: String,
        index: true
    },
    currency_name:
    {
        type: String
    },
    frequency:
    {
        type: String
    },
    conversion:
    {
        type: Object
    }
});

class MDB_CONVERSION extends MODEL
{
	constructor()
	{
		super('conversions', schema);
    }
    
    async updateByAbbreviation(abbreviation, options = {})
    {
        try
        {
            const collection     = this.collection;
            const modelRes       = await collection.findOneAndUpdate({currency_abbreviation: abbreviation}, options, {new: true});
            return modelRes;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async findByAbbreviation(abbreviation)
    {
        const res = await this.collection.findOne({currency_abbreviation: abbreviation});
        return res ? res : null;
    }
}

module.exports = MDB_CONVERSION;