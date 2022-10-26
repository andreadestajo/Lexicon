const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;


let schema         = new Schema({
    user_id : {
        type:       String
    },
    reference_number: {
        type:       String
    },
});

class MDB_REFERENCE_NUMBER extends MODEL {
    constructor() {
        super('reference_number', schema);
    }

    async findByReferenceNumber(reference_number)
    {
        const res = await this.collection.findOne({ reference_number: reference_number });
        return res ? res : null;
    }
}

module.exports = MDB_REFERENCE_NUMBER;
