const MONGOOSE = require('../config/mongo');
const MODEL = require('./MODEL');
const Schema = MONGOOSE.Schema;

const schema = new Schema({
    user_id:
    {
        type: String,
        index: true
    },
    message:
    {
        type: String
    },
    date_created:
    {
        type: Date,
        index: true
    },
    date_opened:
    {
        type: Date
    },
    is_open:
    {
        type: Boolean,
        default: false
    },
    unread_count:
    {
        type: Number
    }
});


class MDB_NOTIFICATION extends MODEL {
    constructor() {
        super('notifications', schema);
    }

    async findNotification(user_id) {
        const res = await this.collection.find({ user_id: user_id }).sort({ "date_created": -1 });
        return res ? res : null;
    }
    async updateNotificationStatus(notifId) {
        const res = await this.collection.findOneAndUpdate({ _id: notifId }, { $set: { is_open: true, date_opened: Date() } },
            { multi: true })
        return res ? res : null;

    }
    async readAllNotification(userID) {
        const res = await this.collection.update({ user_id: userID }, { $set: { is_open: true, date_opened: Date() } },
            { multi: true })
        return res ? res : null;

    }

}

module.exports = MDB_NOTIFICATION;
