const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;


const schema         = new Schema({
    fee_type:
    {
        type:       String,
        required:   true
    },
    is_enabled:
    {
        type:       Boolean,
        default:    true
    },
    charge_type:
    {
        type:       String,
        default:    null
    },
    value:
    {
        type:       Number,
        default:    0
    },
});

class MDB_FEE extends MODEL {
    constructor() {
        super('fees', schema);
    }

    async findByFeeType(type)
    {
        const res = await this.collection.findOne({ fee_type: type });
        return res ? res : null;
    }

    async updateByFeeType(type, options = {})
    {
        try
        {
            const collection     = this.collection;
            const modelRes       = await collection.findOneAndUpdate({fee_type: type}, options, {new: true});
            return modelRes;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}

module.exports = MDB_FEE;