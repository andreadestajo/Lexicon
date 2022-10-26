const MONGOOSE      = require('../config/mongo');       
const MODEL         = require('./MODEL');
const Schema        = MONGOOSE.Schema;

const schema         = new Schema({
    Role:
    {
        type: String
    },

    Restrictions:
    {
        type : Array,
        default: []
    },

    Description:
    {
        type: String
    }
});

class MDB_ROLE extends MODEL {
    constructor () 
    {
        super('role', schema);
    }

    async findRole() {
        const res = await this.collection.find();
        return res ? res : null;
    }

    async delRole(roleID) {
        const res = await this.collection.deleteOne({ _id: roleID });
        return res ? res : null;
    }

    async findRoleAndUpdate(doc, updates) {
        const res = await this.collection.findOneAndUpdate(doc, updates, { new: true })
        return res;
    }

    async findByRole(role) {
        const res = await this.collection.findOne({ Role: role });
        return res ? res.toJSON() : null;
    }

}

module.exports = MDB_ROLE;
