const MONGOOSE      = require('../config/mongo');
const MODEL         = require('./MODEL');
const Schema        = MONGOOSE.Schema;

const schema    = new Schema({
    user_id:
    {
        type:       String,
    },
    full_name:
    {
        type:       String,
    },
    user_role:
    {
        type:       String,
    },
    description:
    {
        type:       String,
    },
    reference_number:
    {
        type:       String,
        default:    "-"
    },
    date_created:
    {
        type:       Date
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

class MDB_ACCOUNT_NUMBER extends MODEL
{
	constructor()
	{
        super('activity_logs', schema);
    }

    async findByDateDesc() {
        const res = await this.collection.find().sort({ date_created: 'desc' });
        return res ? res : null;
    }

    async findFilteredActivityLogs(from, to)
    {
        let filters = 
        {
            timestamp_created_at: 
            {
                $gte: from,
                $lte: to
            }
        }

        const res = await this.collection.find(filters).sort({ date_created: 'desc' });
        return res
    }
}

module.exports = MDB_ACCOUNT_NUMBER;