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
    full_name:
    {
        type: String,
    },
    currency_id:
    {
        type: String
    },
    currency_abbreviation:
    {
        type: String,
        index: true
    },
    transaction_type:
    {
        type: String, // charges/send/receive/add fund
        required: false,
        index: true
    },
    transaction_method:
    {
        type: String, //plus or minus
    },
    amount:
    {
        // type: Schema.Types.Decimal128,
        type: Number,
        default: 0
    },
    balance_before:
    {
        type: Number,
    },
    balance_after:
    {
        type: Number,
    },
    description:
    {
        type: String,
    },
    remarks:
    {
        type: String
    },
    triggered_by:
    {
        type: String //id
    },
    tx_hash:
    {
        type: String
    },
    decimal_places:
    {
        type: Number
    },
    deposit_slip_path: {
        type: String
    },
    date_created:
    {
        type: Date,
        index: true
    },
    conversion_rate:
    {
        type: String
    },

    //For External Transaction
    bank:
    {
        type: String
    },
    account_name:
    {
        type: String
    },
    account_number:
    {
        type: String
    },
    reference_number:
    {
        type: String
    },
    status:
    {
        type: String,
        index: true
    },
    status_admin: {
        type: String
    },
    verified_by: {
        String
    },
    approved_by: {
        type: String
    },
    cancelled_by: {
        type: String
    },
    email:
    {
        type: String
    },
    fee:
    {
        type: Number,
        default: 0
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

class MDB_TRANSACTION extends MODEL {
    constructor() {
        super('transactions', schema);
    }

    async findByTransactionHistory(user_id, abbreviation, skip) {
        const res = await this.collection.find({ user_id: user_id, currency_abbreviation: abbreviation }).sort({ date_created: 'desc' }).limit(10).skip(skip);
        return res ? res : null;
    }

    async findByRefNo(reference_number) {
        const res = await this.collection.findOne({ reference_number: reference_number })
        return res ? res : null;
    }

    async findByExternalTxn() {
        const res = await this.collection.find({ transaction_type: "send external" }).sort({ date_created: 'desc' });
        return res ? res : null;
    }

    async findByPendingHistory(user_id) {
        const res = await this.collection.find({ user_id: user_id, transaction_type: "send external", status: "Pending" }).sort({ date_created: 'desc' });
        return res ? res : null;
    }


    // FOR FUTURE USE
    // async findAndDeleteMany(reference_number)
    // {
    //     const res = await this.collection.updateMany({ reference_number }, { $set: { "wallet.$[].limit_external": 0 } });
    //     console.log(res)
    //     return res ? res : null;
    // }
    async getReportsIn(filtersObj) {
        const date_from_timestamp = filtersObj.date_from_timestamp
        const date_to_timestamp = filtersObj.date_to_timestamp

        let filters = {
            timestamp_created_at: {
                $gte: date_from_timestamp,
                $lte: date_to_timestamp
            }
        }
        console.log(filters);
        filtersObj.hasOwnProperty('transaction_type') ? filters.transaction_type = filtersObj.transaction_type : undefined
        filtersObj.hasOwnProperty('currency') ? filters.currency_abbreviation = filtersObj.currency : undefined

        const res = await this.collection.find(filters).sort({ date_created: 'desc' })
        return res
    }

    async getClientReportsIn(filtersObj) {
        const date_from_timestamp = filtersObj.date_from_timestamp
        const date_to_timestamp = filtersObj.date_to_timestamp
        let filters = {
            timestamp_created_at: {
                $gte: date_from_timestamp,
                $lte: date_to_timestamp
            },
            user_id: filtersObj.user_id
        }
        filtersObj.hasOwnProperty('currency') ? filters.currency_abbreviation = filtersObj.currency : undefined
        if(filtersObj.hasOwnProperty('transaction_type'))
        {
            if(filtersObj.transaction_type === 'send internal')
            {
                filters.$or = [ {'transaction_type': 'send internal'}, {'transaction_type': 'receive internal'}]
            }
            else if(filtersObj.transaction_type === 'send external')
            {
                filters.$or = [ {'transaction_type': 'send external'}, {'transaction_type': 'transaction fee'}]
            }
            else
            {
                filters.transaction_type = filtersObj.transaction_type
            }

            if(filtersObj.transaction_type === 'deposit')
            {
                filters.status = "Approved";
            }
        }
        const res = await this.collection.find(filters).sort({ date_created: 'desc' })
        return res
    }

    async getClientReportsIn(filtersObj) {
        const date_from_timestamp = filtersObj.date_from_timestamp
        const date_to_timestamp = filtersObj.date_to_timestamp

        let filters = {
            timestamp_created_at: {
                $gte: date_from_timestamp,
                $lte: date_to_timestamp
            },
            user_id: filtersObj.user_id
        }
        filtersObj.hasOwnProperty('currency') ? filters.currency_abbreviation = filtersObj.currency : undefined
        if(filtersObj.hasOwnProperty('transaction_type'))
        {
            if(filtersObj.transaction_type === 'send internal')
            {
                filters.$or = [ {'transaction_type': 'send internal'}, {'transaction_type': 'receive internal'}]
            }
            else if(filtersObj.transaction_type === 'send external')
            {
                filters.$or = [ {'transaction_type': 'send external'}, {'transaction_type': 'transaction fee'}]
            }
            else
            {
                filters.transaction_type = filtersObj.transaction_type
            }
        }
        
        const res = await this.collection.find(filters).sort({ date_created: 'desc' })
        return res
    }
}

module.exports = MDB_TRANSACTION;
