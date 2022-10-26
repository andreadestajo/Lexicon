const MONGOOSE = require('../config/mongo');
const MODEL = require('./MODEL');
const Schema = MONGOOSE.Schema;

const schema = new Schema({
    user_id:
    {
        type: String,
        required: false,
        index: true
    },
    full_name: {
        type: String
    },
    status:
    {
        type: String,
        default: "PENDING"
    },

    currency_abbreviation:
    {
        type: String
    },
    fund_type:
    {
        type: String
    },
    amount:
    {
        type: Number,
        default: 0
    },

    decimal_places:
    {
        type: Number
    },
    rate:
    {
        type: Number,
        default: 0
    },
    date_to:
    {
        type: Date
    },
    date_from:
    {
        type: Date
    },
    projected_value:
    {
        type: Number,
        default: 0
    },
    date_created:
    {
        type: Date,
        default: Date.now(),
        index: true
    },
    timestamp_created_at: 
    {
        type: Number,
        default: Date.now()
    }
},  {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

class MDB_HEDGE_FUNDS extends MODEL {
    constructor() {
        super('hedge_fund', schema);
    }

    async findByUserIdAndFundType(id, fund_type) {
        const res = await this.collection.findOne({ user_id: id, fund_type: fund_type })
        return res ? res : null;
    }
    async findByUserId(id) {
        const res = await this.collection.find({ user_id: id })
        return res ? res : null;
    }

    async findHedgeFundTransactions() {

        const res = await this.collection.find().sort({ date_created: 'desc' })
        return res ? res : null;
    }


    async delHedgeFund(id) {
        const res = await this.collection.findOneAndDelete({ _id: id });
        return res ? res : null;
    }

    async findById(id) {
        const res = await this.collection.findOne({ id: id })
        return res ? res : null;
    }

    async getClientReportsIn(filtersObj) {
        let filters = {
            user_id: filtersObj.user_id,
            status: "Approved"
        }
        filtersObj.hasOwnProperty('currency') ? filters.currency_abbreviation = filtersObj.currency : undefined
        const res = await this.collection.find(filters).sort({ date_created: 'desc' })
        return res
    }

    async getReportsIn(filtersObj) {
        const date_from_timestamp = filtersObj.date_from_timestamp
        const date_to_timestamp = filtersObj.date_to_timestamp
        let filters = {
            timestamp_created_at: {
                $gte: date_from_timestamp,
                $lte: date_to_timestamp
            }
        }
        filtersObj.hasOwnProperty('currency') ? filters.currency_abbreviation = filtersObj.currency : undefined
        const res = await this.collection.find(filters).sort({ date_created: 'desc' })
        return res
    }

}

module.exports = MDB_HEDGE_FUNDS;