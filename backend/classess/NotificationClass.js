const moment = require('moment-timezone')
const MDB_USER = require('../models/MDB_USER');
const MDB_NOTIFICATION = require('../models/MDB_NOTIFICATION');


module.exports = class NotificationClass {
    constructor(user_information = null) {
        this.user_information = user_information;
    }

    async getNotifByUserId() {
        let res = {};
        try {

            const mdb_notifs = new MDB_NOTIFICATION();
            const doc = await mdb_notifs.findNotification(this.user_information.id);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async readNotification() {
        let res = {};
        try {

            const mdb_notifs = new MDB_NOTIFICATION();
            const mdb_user = new MDB_USER();
            const doc = await mdb_notifs.updateNotificationStatus(this.user_information.notifId);

            const doc_notification = await mdb_user.findOneAndUpdate({ _id: this.user_information.user_id }, { $inc: { notification_count: -1 } });

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;


    }

    async createNotification() {
        let res = {};

        try {
            const mdb_notifs = new MDB_NOTIFICATION();
            const mdb_user = new MDB_USER();

            res.status = "success";
            let add_form =
            {
                user_id: this.user_information.user_id,
                message: this.user_information.message,
                date_created: Date(),
                date_opened: this.user_information.date_opened,
                is_open: this.user_information.is_open,
            }
            await mdb_notifs.add(add_form);

            const doc_notification = await mdb_user.findOneAndUpdate({ _id: this.user_information.user_id }, { $inc: { notification_count: 1 } });
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async readAllNotification() {
        let res = {};
        try {

            const mdb_notifs = new MDB_NOTIFICATION();
            const mdb_user = new MDB_USER();
            const doc = await mdb_notifs.readAllNotification(this.user_information.user_id);

            const doc_notification = await mdb_user.findOneAndUpdate({ _id: this.user_information.user_id }, { $set: { notification_count: 0 } });

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;


    }

}
