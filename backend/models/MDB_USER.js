const MONGOOSE = require('../config/mongo');
const MODEL = require('./MODEL');
const Schema = MONGOOSE.Schema;

const schema = new Schema({
    country:
    {
        type: String,
    },
    full_name:
    {
        type: String,
        required: true,
        index: true
    },
    email:
    {
        type: String,
        required: true
    },
    contact:
    {
        type: String,
        // required: true
    },
    password:
    {
        type: String,
        // required: true
    },
    admin_pass:
    {
        type: String,
    },
    wallet:
    {
        type: Array,
        default: []
        // required: false
    },
    hedge_fund:
    {
        type: Array,
        default: []
    },
    wallet_address:
    {
        type: Array,
        default: []  // Ex. ["ASDASDASDADASDASDASDAS", "ASDASDASDASAW13213231232"]
    },
    send_attempt:
    {
        type: Number,
        default: 0
    },
    is_account_locked:
    {
        type: Boolean,
        default: false
    },

    notification_count:
    {
        type: Number,
        default: 0,
    },//Contributor: AAD
    user_role:
    {
        type: String,
        index: true
    },//Contributor: AAD
    date_created:
    {
        type: Date,
    },
    // Send Limit
    limit_internal:
    {
        type: Number,
        default: 0
    },
    limit_external:
    {
        type: Number,
        default: 0
    }
});

schema.index({full_name: 1})

class MDB_USER extends MODEL {
    constructor() {
        super('users', schema);
    }
    async findByEmail(email) {
        const res = await this.collection.findOne({ email: email }, "-is_account_locked");
        return res ? res.toJSON() : null;
    }
    async findByEmailAndRole(email) {
        const res = await this.collection.findOne({ email: email, user_role: { $ne: "" } });
        return res ? res.toJSON() : null;
    }
    async findOneAndUpdate(doc, updates) {
        const res = await this.collection.findOneAndUpdate(doc, updates, { new: true })
        return res;
    }
    // async findAndUpdate(email, hashed_password)
    // {
    //     let query = { email: email };
    //     const res = await this.collection.findOneAndUpdate(query, { $set: { password: hashed_password } });
    //     return res ? res.toJSON() : null;
    // }

    async findByPublicKey(public_key) {
        const res = await this.collection.findOne({ wallet_address: { $in: public_key } });
        return res ? res : null;
    }

    async findByUserId(id) {
        // .explain("executionStats"); - for index checking
        const res = await this.collection.findById(id);
        return res ? res : null;
    }
    async findAllByUserId(id) {
        const res = await this.collection.findById(id);
        return res ? res : null;
    }

    // FOR FUTURE USE
    // async findAllAndResetLimit()
    // {
    //     const res = await this.collection.updateMany({ }, { $set: { "wallet.$[].limit_external": 0 } });
    //     return res ? res : null;
    // }

    async findAllAndResetLimit() {
        const res = await this.collection.updateMany({}, { $set: { "limit_internal": 0, "limit_external": 0 } });
        
        return res ? res : null;
    }

    //Contributor: AAD
    async findUser() {
        // const res = await this.collection.find();
        const res = await this.collection.find({$and : [{ user_role: { $ne: null }},{user_role: { $ne: 'Client' } }]});
        return res ? res : null;
    }
    //Contributor: AAD
    async delUser(userID) {
        const res = await this.collection.findOneAndDelete({ _id: userID });
        return res ? res : null;
    }

    async findAllUser() {
        const res = await this.collection.find().sort({ "date_created": -1 });
        return res ? res : null;
    }

    async findClientsList() {
        const res = await this.collection.find({ user_role: "Client" });
        return res ? res : null;
    }
}

module.exports = MDB_USER;
