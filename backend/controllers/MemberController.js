const express       = require('express');
const moment        = require('moment-timezone');
const app           = express();
const ServerClass   = require('../classess/ServerClass');
const MemberClass   = require('../classess/MemberClass');
const AccountClass  = require('../classess/AccountClass');
const NotificationClass = require('../classess/NotificationClass');
const CurrencyClass = require('../classess/CurrencyClass');


// const account = new AccountClass();
// const member = new MemberClass();
const account       = new AccountClass();
const notification = new NotificationClass();

module.exports =
{
    async updateProfile(req, res)
    {
        res.send("update profile");
    },

    async updateKyc_personal(req, res) {
        let user_data = req.body;

        user_data.step = 2;

        let member_class = new MemberClass(user_data);
        let kyc_validation = await member_class.validate_user_kyc_step_1();

        if (kyc_validation.status == "error") {
            res.status(400).send({ message: kyc_validation.message })
        } else if (kyc_validation.status == "success") {
            let doc = await member_class.updateKyc()
            res.json(doc).status(200);
            return res;

        }
    },

    async updateKyc_address(req, res) {
        let user_data = req.body;

        user_data.step = 3;

        let member_class = new MemberClass(user_data);
        let kyc_validation = await member_class.validate_user_kyc_step_2();

        if (kyc_validation.status == "error") {
            res.status(400).send({ message: kyc_validation.message })
        } else if (kyc_validation.status == "success") {
            const doc = await member_class.updateKyc()
            res.json(doc).status(200);
        }
    },

    async updateKyc_id(req, res) {
        let user_data   = req.body;


        user_data.id_image_path = "id/" + req.file.filename;
        user_data.step  = 4;

        let member_class = new MemberClass(user_data);
        let kyc_validation = await member_class.validate_user_kyc_step3();

        if (kyc_validation.status == "error") {
            res.status(400).send({ message: kyc_validation.message })
        } else if (kyc_validation.status == "success") {
            const doc = await member_class.updateKyc()
            res.json(doc).status(200);
        }
    },

    async updateKyc_selfie(req, res) {
        let user_data = req.body;

        user_data.selfie_image_path = "selfie/" + req.file.filename;
        user_data.step = 5;

        let member_class = new MemberClass(user_data);
        let kyc_validation = await member_class.validate_user_kyc_step5();

        if (kyc_validation.status == "Error") {
            res.status(400).send({ message: kyc_validation.message })
        } else if (kyc_validation.status == "success") {
            const doc = await member_class.updateKyc()
            res.json(doc).status(200);
        }
    },

    async changePassword(req, res)
    {
        let user_information =
        {
            email: req.user_info.email,
            old_password: req.body.old_password,
            new_password: req.body.password,
            confirm_new_password: req.body.confirm_password,
        }

        let account_class        = new AccountClass(user_information);
        let findPassword      = await account_class.findPassword();

        if(findPassword.status == "success")
        {
            let changePassword = await account_class.findAndUpdate();

            if(changePassword.status == "success")
            {
                res.status(200).send({ message: changePassword.message });
            }
            else
            {
                res.status(400).send({ message: changePassword.message });
            }
        }
        else if(findPassword.status == "error")
        {
            res.status(400).send({ message: findPassword.message });
        }
    },
    async updateKyc_security_question(req, res) {
        let user_data = req.body;
        // user_data.id_image_path = "id/" + req.file.filename;
        user_data.step          = 6;
        user_data.status        = 'PENDING';
        user_data.date_created  = moment();

        let member_class = new MemberClass(user_data);
        let kyc_validation = await member_class.validate_user_kyc_step_6();

        if (kyc_validation.status == "error") {
            res.status(400).send({ message: kyc_validation.message })
        } else if (kyc_validation.status == "success") {
            const doc = await member_class.updateKyc()
            res.json(doc).status(200);
        }
    },

    async update_step_down(req, res) {
        let user_data = req.body

        let member_class = new MemberClass(user_data);

        let result = await member_class.update_step_down();

        if(result.status == 'error') {
            res.status(400).send({message: result.message})
        }else if(result.status == 'success'){
            res.json(result).status(200);
        }
    },

    async getKycByUserId(req, res) {
        const member = new MemberClass(req.body);
        const member_data = await member.getKycByUserId();
        if (member_data.status == 'success') {
            res.json(member_data.data).status(200);
        }
        else
        {
            res.json(member_data.message).status(400);
        }

    },

    async update_step(req, res)
    {
        let user_data   = req.body;
        return
    },
    async getKyc(req, res)
    {

        const member = new MemberClass();
        const member_data = await member.getAllKyc();

        if (member_data.status = "success") {
            res.json(member_data.data).status(200);
        } else {
            res.json(member_data.message).status(400);
        }
    },



//-----------------------------Notifications
    async getNotif(req, res) {

        const notification = new NotificationClass(req.body);
        const notification_data = await notification.getNotifByUserId();

        if (notification_data.status == 'success') {
            res.json(notification_data.data).status(200);
        }
        else {
            res.json(notification_data.message).status(400);
        }
    },

    async updateStatus(req, res){

        let userNotification = {
            user_id: req.body.id,
            notifId:req.body.notifId
        }

        const notification = new NotificationClass(userNotification);
        const notification_data = await notification.readNotification();

        if (notification_data.status == 'success') {
            res.json(notification_data.data).status(200);
        }
        else {
            res.json(notification_data.message).status(400);
        }
    },

    async sendNotif(req, res){
        let userNotification = {
            user_id: req.body.id,
            message: req.body.message,
            date_opened: req.body.date_opened,
            is_open: req.body.is_open,
        }
        let notification = new NotificationClass(userNotification);
        let notification_data = await notification.createNotification();

        if (notification_data.status == 'success') {
            res.json(notification_data.status).status(200);
        }
        else {
            res.json(notification_data.message).status(400);
        }
    },

    async readAllNotifications(req, res){

        let userNotification = {
            user_id: req.body.id,
            notifId:req.body.notifId
        }

        const notification = new NotificationClass(userNotification);
        const notification_data = await notification.readAllNotification();

        if (notification_data.status == 'success') {
            res.json(notification_data.data).status(200);
        }
        else {
            res.json(notification_data.message).status(400);
        }
    },

    async supported_currency(req, res)
    {
        const supported_currency      = new CurrencyClass();
        const supported_currency_data = await supported_currency.supported_currency();

        if(supported_currency_data.status == 'success')
        {
            res.json(supported_currency_data.data).status(200);
        }
        else
        {
            res.json(supported_currency_data.message).status(400);
        }
    },

}
