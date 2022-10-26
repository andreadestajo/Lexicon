const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;


let schema         = new Schema({
    user_id:
    {
        type:       String,
        required:   true
    },
    fund_type:
    {
        type:       String
    },
    amount:
    {
        type:       Number
    },
    currency_abbreviation:
    {
        type:       String
    }
});

class MDB_STAGING_HEDGE_FUND extends MODEL {
    constructor() {
        super('hedge_fund_staging', schema);
    }

    async findByUserIdAndFundType(user_id, fund_type)
    {
        const res = await this.collection.find({ user_id: user_id, fund_type: fund_type });
        return res ? res : null;
    }

    async deleteStaging(user_id, fund_type)
    {
        const res = await this.collection.deleteMany({ user_id: user_id, fund_type: fund_type });
        return res ? res : null;
    }
}

module.exports = MDB_STAGING_HEDGE_FUND;
