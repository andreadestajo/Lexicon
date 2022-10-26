const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;


let schema         = new Schema({
    user_id: {
        type:       String,
        required:   true
    },
    date_created: {
        type:       Date,
        default:    Date.now,
        index: {
            unique:  true,
            expireAfterSeconds: 10
        }
    },
});

class MDB_STAGING_TRANSACTION extends MODEL {
    constructor() {
        super('staging_transaction', schema);
    }

    async findByUserId(user_id)
    {
        const res = await this.collection.findOne({ user_id: user_id });
        return res ? res.toJSON() : null;
    }
}

module.exports = MDB_STAGING_TRANSACTION;