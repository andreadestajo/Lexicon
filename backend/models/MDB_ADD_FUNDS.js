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
    status:
    {
        type: String,
        default: "PENDING",
        index: true
    },
    currency_abbreviation:
    {
        type: String
    },
    orderNumber: {
        type: String
    },
    full_name: {
        type: String
    },
    transaction_method:
    {
        type: String, //manual or paypa
        required: false,
        index: true
    },
    amount:
    {
        type: Number,
        default: 0
    },
    amount_fee:
    {
        type: Number,
        default: 0
    },
    remarks:
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

class MDB_ADD_FUNDS extends MODEL {
    constructor() {
        super('add_funds', schema);
    }

    async findByOrderNumber(orderNumber) {
        const res = await this.collection.findOne({ orderNumber: orderNumber })
        return res ? res : null;
    }
    async findByTransactionHistory(user_id, skip) {
        const res = await this.collection.find({ user_id: user_id }).sort({ date_created: 'desc' }).limit(3).skip(skip);
        return res ? res : null;
    }
    async findByPendingHistory(user_id) {
        const res = await this.collection.find({ user_id: user_id, transaction_method: "manual", status: "pending" }).sort({ date_created: 'desc' });
        return res ? res : null;
    }
    async findAllAddFunds() {

        const res = await this.collection.find({ $or: [{ status: "Mark as paid" }, { status: "pending" }] }).sort({ date_created: 'desc' })
        return res ? res : null;
    }

    async findAddFundsTransactions() {

        const res = await this.collection.find().sort({ date_created: 'desc' })
        return res ? res : null;
    }

    async findOneByTransactionHistory(user_id) {
      const res = await this.collection.findOne({ user_id: user_id }).sort({ date_created: 'desc' });
      return res ? res : null;
    }

    async findFilteredAddFunds(from, to)
    {
        let filters = 
        {
            timestamp_created_at: 
            {
                $gte: from,
                $lte: to
            }
        }
        console.log(filters);

        const res = await this.collection.find(filters).sort({ date_created: 'desc' })
        return res
    }

    async updateAllAddFunds() {
        const res = await this.collection.updateMany({}, { $set: { "timestamp_created_at": "$date_created"} });
        
        return res ? res : null;
    }

}

module.exports = MDB_ADD_FUNDS;
