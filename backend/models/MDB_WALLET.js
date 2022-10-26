const MONGOOSE = require('../config/mongo');
const MODEL = require('./MODEL');
const Schema = MONGOOSE.Schema;

const schema = new Schema({
    user_id:
    {
        type: String,
        required: true
    },
    currency_id:
    {
        type: String,
        required: true
    },
    currency_abbreviation:
    {
        type: String,
    },
    is_fiat:
    {
        type: Boolean,
        default: true
    },
    decimal_places:
    {
        type: Number,
    },
    public_key:
    {
        type: String,
        required: true
    },
    private_key:
    {
        type: String,
        required: true
    },
    balance:
    {
        type: Number,
        default: 0
    },
});


class MDB_WALLET extends MODEL {
    constructor() {
        super('wallets', schema);
    }

    async findByPublicKey(public_key) {
        const res = await this.collection.findOne({ public_key: public_key }, "-private_key");
        return res ? res : null;
    }

    async findByCurrencyAndUserId(abbreviation, user_id) {
        const res = await this.collection.findOne({ currency_abbreviation: abbreviation, user_id: user_id }, "-private_key");
        return res ? res : null;
    }

    async findByAbbreviationAndUserId(abbreviation, user_id) {
        const res = await this.collection.findOne({ currency_abbreviation: abbreviation, user_id: user_id }, "currency_abbreviation balance -_id");
        return res ? res : null;
    }

    async findAllByAbbreviationAndUserId(abbreviation, user_id) {
        const res = await this.collection.findOne({ currency_abbreviation: abbreviation, user_id: user_id });
        return res ? res : null;
    }

    async findByUserId(user_id) {
        const res = await this.collection.findOne({ user_id: user_id });
        return res ? res : null;
    }

    async findByUserId(user_id) {
        const res = await this.collection.findOne({ user_id: user_id });
        return res ? res : null;
    }

}

module.exports = MDB_WALLET;