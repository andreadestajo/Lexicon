const MDB_USER = require('../models/MDB_USER');
const MDB_ROLE = require('../models/MDB_ROLE');
const MDB_KYC = require('../models/MDB_KYC');
const MDB_FEE = require('../models/MDB_FEE');
const MDB_TRANSACTION = require('../models/MDB_TRANSACTION');
const MDB_CONVERSION = require('../models/MDB_CONVERSION');
const MDB_CURRENCY = require('../models/MDB_CURRENCY');
const MemberClass = require('./MemberClass');
const MDB_WALLET = require('../models/MDB_WALLET');
const ServerClass = require('./ServerClass');
const NotificationClass = require('./NotificationClass');
const MDB_HEDGE_FUND = require('../models/MDB_HEDGE_FUND');
const MDB_STAGING_HEDGE_FUND = require('../models/MDB_STAGING_HEDGE_FUND');
const MDB_ACTIVITY_LOGS = require('../models/MDB_ACTIVITY_LOGS');
const MDB_ADD_FUNDS = require('../models/MDB_ADD_FUNDS')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MDB_ACCOUNT_NUMBER = require('../models/MDB_ACCOUNT_NUMBER');
const MDB_REFERENCE_NUMBER = require('../models/MDB_REFERENCE_NUMBER');
const MDB_VERIFY_OTP = require('../models/MDB_VERIFY_OTP');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const moment = require('moment-timezone');
const fs = require('fs');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
const twilio = require('twilio');
const Nexmo = require('nexmo');

module.exports = class AdminClass {
    constructor(user_information = null) {
        this.user_information = user_information;
        this.mdb_fee = new MDB_FEE();
        this.mdb_conversion = new MDB_CONVERSION();
        this.mdb_currency = new MDB_CURRENCY();
        this.mdb_transaction = new MDB_TRANSACTION();
        this.mdb_user = new MDB_USER();
        this.mdb_account_number = new MDB_ACCOUNT_NUMBER();
        this.mdb_reference_number = new MDB_REFERENCE_NUMBER();
        this.mdb_hedge_fund = new MDB_HEDGE_FUND();
        this.mdb_wallet = new MDB_WALLET();
        this.mdb_activity_logs = new MDB_ACTIVITY_LOGS();
        this.mdb_add_funds = new MDB_ADD_FUNDS();
        this.mdb_staging_hedge_fund = new MDB_STAGING_HEDGE_FUND();
    }

    async test() {

        return {};
    }

    async getKycByStatus() {
        const mdb_kyc = new MDB_KYC();

        let kyc_data = await mdb_kyc.findByKycStatus(this.user_information.status, { 'date_created': 'desc' });
        return kyc_data;
    }

    async updateMemberKyc() {
        let member_class = new MemberClass(this.user_information);
        let result = await member_class.updateKyc();

        if (this.user_information.status == 'REJECTED') {
            this.user_information.step = 1

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Rejected ${result.data.first_name} ${result.data.last_name} KYC`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);
        }
        else {
            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Approved ${result.data.first_name} ${result.data.last_name} KYC`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);
        }

        return result;
    }

    async deleteAllUserInfo() {
        let res = {}
        try {

            const mdb_user = new MDB_USER();
            const mdb_kyc = new MDB_KYC();
            const user_ids = ['5f070941cb8f239cd5d1073a', '5f0c3b1d1f1e56168ccd38c5', '5f1946eb218f5c2fe85aef89', '5f0c2f6341f6051c7c461640', '5f169b48f13cfe2458ed7704', '5f197e4e80e10114d05310a9'];
            let user_res = await mdb_user.remove({ _id: { $nin: user_ids } });
            let kyc_res = await mdb_kyc.remove({ user_id: { $nin: user_ids } });

            res.status = 'success';
            res.data = { user_res, kyc_res };
        } catch (error) {
            res.status = 'error';
            res.message = error;
        }
        return res;
    }

    async createFee() {
        let res = {};
        try {
            res.status = "success";

            let add_form =
            {
                fee_type: this.user_information.fee_type,
                is_enabled: this.user_information.is_enabled,
                charge_type: this.user_information.charge_type,
                value: this.user_information.value
            }
            await this.mdb_fee.add(add_form);

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Set Fee: ${this.user_information.charge_type}`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async setFee() {
        let res = {};
        try {
            res.status = "success";

            let fee = await this.mdb_fee.findByFeeType(this.user_information.fee_type);

            let add_form =
            {
                is_enabled: this.user_information.is_enabled,
                charge_type: this.user_information.charge_type,
                value: this.user_information.value
            }
            await this.mdb_fee.update(fee._id, add_form);

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Set ${this.user_information.fee_type} ${this.user_information.charge_type ? this.user_information.charge_type : 'No'} Fee:  ${this.user_information.value}`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async getFee() {
        let res = {};
        try {
            res.data = await this.mdb_fee.docs();
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async getFrequency() {
        let res = {};
        try {
            res.data = await this.mdb_conversion.findByAbbreviation('USD');
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async getCurrencies() {
        let res = {};
        try {
            res.data = await this.mdb_currency.docs();
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async makeOrderNumber(code, user_id)
    {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + user_id.toString().toUpperCase();
        for (var i = 0; i < 9; i++)
        {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        let reference_number = `${code}-${result}`
        let is_existing = await this.mdb_reference_number.findByReferenceNumber(reference_number);
        if(is_existing)
        {
            await this.makeOrderNumber(code, user_id);
        }
        else
        {
            this.mdb_reference_number.add({ user_id: user_id, reference_number: reference_number });
            return reference_number;
        }
    }

    async getAllExternalTxn() {
        let res = {};

        let transactions = await this.mdb_transaction.findByExternalTxn();

        try {
            res.status = "success";
            res.data = transactions;
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async verifyTxnStatus() {
        let res = {};

        let transaction = await this.mdb_transaction.findByRefNo(this.user_information.reference_number);
        // let txn = {};

        if (this.user_information.user_info && transaction) {
            this.mdb_transaction.update(transaction._id, {
                status_admin: "Verified",
                verified_by: this.user_information.user_info.full_name
            });

            // ----------------------------
            let notification_data =
            {
                user_id: this.user_information.user_info._id,
                message: "Transaction Verified!",
                date_created: this.user_information.date_created,
                date_opened: "",
            }
            let notification = new NotificationClass(notification_data);
            notification.createNotification();
            // ----------------------------

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Verified ${transaction.full_name}'s Wire Transfer`,
                reference_number: transaction.reference_number,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            this.mdb_activity_logs.add(admin_details);

            // res.data = txn;
            res.status = "success";
        }
        else {
            res.status = "error";
            res.message = "Status Update Failed";
        }

        return res;
    }

    async approveTxnStatus() {
        let res = {};

        const mdb_transaction = new MDB_TRANSACTION();
        let transaction = await mdb_transaction.findByRefNo(this.user_information.reference_number);
        // let txn = {};

        if (this.user_information.user_info && transaction) {
            mdb_transaction.update(transaction._id, {
                status: "Approved",
                approved_by: this.user_information.user_info.full_name
            });

            // ----------------------------
            let notification_data =
            {
                user_id: this.user_information.user_info._id,
                message: "Send External!",
                date_created: this.user_information.date_created,
                date_opened: "",
            }
            let notification = new NotificationClass(notification_data);
            notification.createNotification();
            // ----------------------------

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Approved ${transaction.full_name}'s Wire Transfer`,
                reference_number: transaction.reference_number,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            this.mdb_activity_logs.add(admin_details);

            // res.data = txn;
            res.status = "success";

            // Step 1
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const handleBarOptions = {
                viewEngine: {
                    extName: '.html',
                    partialsDir: '../backend/email_template/',
                    layoutsDir: '../backend/email_template/',
                    defaultLayout: '',
                },
                viewPath: '../backend/email_template/',
                extName: '.html',
            };

            transporter.use('compile', hbs(handleBarOptions));

            // Step 2
            let mailOptions = {
                from: 'lexiconbank2020@gmail.com',
                to: this.user_information.email,
                subject: 'Wire Transfer Approved',
                text: 'Wire Transfer Approved',
                template: 'wire_transfer_approved',
                context: {
                    amount: (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                        minimumFractionDigits: transaction.decimal_places,
                        maximumFractionDigits: transaction.decimal_places
                    }),

                    currency: transaction.currency_abbreviation,
                    bank: transaction.bank,
                    account_name: transaction.account_name,
                    account_number: transaction.account_number,
                    date_time: moment(this.user_information.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm'),
                    reference_number: transaction.reference_number,
                    status: 'Approved'
                }
            }

            // Step 3
            transporter.sendMail(mailOptions)
                .then(function (response) {

                })
                .catch(function (error) {
                    console.log('Error: ', error);
                });
        }
        else {
            res.status = "error";
            res.message = "Status Update Failed";
        }

        return res;
    }

    async cancelTxnStatus() {
        let res = {};
        let code = 'PGM';

        const mdb_transaction = new MDB_TRANSACTION();
        const mdb_user = new MDB_USER();
        const mdb_wallet = new MDB_WALLET();

        let transaction = await mdb_transaction.findByRefNo(this.user_information.reference_number);
        // let txn = {};

        if (this.user_information.user_info.user_role && transaction) {
            // update transaction status
            mdb_transaction.update(transaction._id, {
                status: "Cancelled",
                cancelled_by: this.user_information.user_info.full_name
            });

                // ----------------------------
                let notification_data =
                {
                    user_id: this.user_information.user_info._id,
                    message: "Wire Transfer Cancelled!",
                    date_created: this.user_information.date_created,
                    date_opened: "",
                }
                let notification = new NotificationClass(notification_data);
                notification.createNotification();
                // ----------------------------

                let admin_details = {
                    user_id:            this.user_information.user_info._id,
                    user_role:          this.user_information.user_info.user_role,
                    full_name:          this.user_information.user_info.full_name,
                    description:        `Cancelled ${transaction.full_name}'s Wire Transfer`,
                    reference_number:   transaction.reference_number,
                    date_created:       this.user_information.date_created,
                    timestamp_created_at: this.user_information.date_created,
                }
                this.mdb_activity_logs.add(admin_details);

            let receiver_info = await mdb_user.doc(transaction.user_id);
            let receiver = await mdb_wallet.findByUserId(transaction.user_id);
            let fee = await this.mdb_fee.findByFeeType('Cancellation');
            let conv = await this.mdb_conversion.findByAbbreviation('USD');

            // Update receiver wallet
            let trans_amt = transaction.amount;
            let charge = 0;
            let ex_charge = 0;
            if (fee.charge_type == "Percentage" && fee.is_enabled) {
                trans_amt = Math.floor(((100 - fee.value) / 100) * transaction.amount);
                ex_charge = Math.floor((fee.value / 100) * transaction.amount);

            }
            else if (fee.charge_type == "Fixed" && fee.is_enabled) {
                charge = Math.floor(fee.value / conv.conversion[transaction.currency_abbreviation] * 10 ** transaction.decimal_places);
                ex_charge = charge;
            }
            let receiver_updated_balance = receiver.balance + trans_amt - charge;
            let receiver_index = receiver_info.wallet.findIndex(x => x.currency == transaction.currency_abbreviation);
            receiver_info.wallet[receiver_index].balance = receiver_updated_balance;

            // add new transaction
            let add_transaction_receiver =
            {
                user_id:                transaction.user_id,
                full_name:              receiver_info.full_name,
                currency_id:            transaction.currency_id,
                currency_abbreviation:  transaction.currency_abbreviation,
                transaction_type:       "returned balance",
                transaction_method:     "plus",
                amount:                 transaction.amount,
                balance_before:         receiver.balance,
                balance_after:          receiver_updated_balance,
                description:            "Received " + (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                    minimumFractionDigits: transaction.decimal_places,
                    maximumFractionDigits: transaction.decimal_places
                }) + " " + transaction.currency_abbreviation + " from Lexicon",
                remarks:                transaction.remarks,
                triggered_by:           transaction.user_id,
                decimal_places:         transaction.decimal_places,
                date_created:           this.user_information.date_created,
                bank:                   transaction.bank,
                account_name:           transaction.account_name,
                account_number:         transaction.account_number,
                status:                 'Cancelled',
                reference_number:       await this.makeOrderNumber(code, transaction.user_id),
                email:                  transaction.email,
                charge_type:            fee.charge_type,
                fee:                    ex_charge,
            }

            mdb_user.update(receiver.user_id, { wallet: receiver_info.wallet });
            mdb_wallet.update(receiver._id, { balance: receiver_updated_balance });
            mdb_transaction.update(transaction._id, { status: 'Cancelled' });
            mdb_transaction.add(add_transaction_receiver);

            // response datas
            // res.data    = txn;
            // res.user    = user.wallet[receiver_index].balance;
            // res.wallet  = wallet.balance;
            res.status = "success";

            // Step 1
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const handleBarOptions = {
                viewEngine: {
                    extName: '.html',
                    partialsDir: '../backend/email_template/',
                    layoutsDir: '../backend/email_template/',
                    defaultLayout: '',
                },
                viewPath: '../backend/email_template/',
                extName: '.html',
            };

        transporter.use('compile', hbs(handleBarOptions));

        // Step 2
        let mailOptions = {
            from: 'lexiconbank2020@gmail.com',
            to: this.user_information.email,
            subject: 'Wire Transfer Cancelled',
            text: 'Wire Transfer Cancelled',
            template: 'wire_transfer_cancelled',
            context: {
                amount: (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                    minimumFractionDigits: transaction.decimal_places,
                    maximumFractionDigits: transaction.decimal_places
                }),
                currency:       transaction.currency_abbreviation,
                bank:           transaction.bank,
                account_name:   transaction.account_name,
                account_number: transaction.account_number,
                date_time:      moment(this.user_information.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm'),
                reference_number: add_transaction_receiver.reference_number,
                status:          'Cancelled'
                }
            }

            // Step 3
            transporter.sendMail(mailOptions)
                .then(function (response) {
                    console.log('Email Sent!');
                })
                .catch(function (error) {
                    console.log('Error: ', error);
                });

        }
        else {
            res.status = "error";
            res.message = "Status Update Failed";
        }

        return res;
    }

    // =============================================================
    // Role and User Account
    // Contributor: AAD
    // =============================================================

    async updateRole() {
        let res = {};

        try {

            const mdb_role = new MDB_ROLE();

            const role = await mdb_role.doc(this.user_information.role_ID);
            const doc = await mdb_role.findRoleAndUpdate({ _id: this.user_information.role_ID }, { $set: { Restrictions: this.user_information.role_restrictions, Role: this.user_information.role_name, Description: this.user_information.role_description } });

            // activity log
            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Updated Role: ${role.Role} to ${this.user_information.role_name}`,
                date_created: this.user_information.date_created
            }
            await this.mdb_activity_logs.add(admin_details);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;

    }

    async getuserlist() {
        let res = {};
        try {

            const mdb_user = new MDB_USER();
            const doc = await mdb_user.findUser();

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async getalluserlist() {
        let res = {};
        try {

            const mdb_user = new MDB_USER();
            const doc = await mdb_user.findAllUser();

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async setUserRole() {

        let res = {};
        let hashed_password = await bcrypt.hash("Lexicon01", 10);
        try {
            const mdb_user = new MDB_USER();
            const user = await mdb_user.doc(this.user_information.user_id)
            const doc = await mdb_user.findOneAndUpdate({ _id: this.user_information.user_id }, { $set: { user_role: this.user_information.user_role, admin_pass: hashed_password } });

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Changed ${doc.full_name} User Role: ${user.user_role} to ${this.user_information.user_role}`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async createUser() {
        let res = {};
        const mdb_user = new MDB_USER();
        let check_account = await mdb_user.findByEmail(this.user_information.user_email);
        let unhashed_password = this.user_information.user_password;
        let hashed_password = await bcrypt.hash(unhashed_password, 10);

        console.log(this.user_information)

        if (check_account == null) {
            try {

                res.status = "success";

                let userInfo = {
                    full_name: this.user_information.user_fullname,
                    email: this.user_information.user_email,
                    contact: this.user_information.user_contact,
                    user_role: this.user_information.user_role,
                    admin_pass: hashed_password,
                }

                const result = await mdb_user.add(userInfo);
                res.data = result;

                let admin_details = {
                    user_id: this.user_information.user_info._id,
                    user_role: this.user_information.user_info.user_role,
                    full_name: this.user_information.user_info.full_name,
                    description: `Added ${this.user_information.user_fullname} as ${this.user_information.user_role}`,
                    date_created: this.user_information.date_created,
                    timestamp_created_at: this.user_information.date_created,
                }
                await this.mdb_activity_logs.add(admin_details);

                if (res.status == 'success') {
                    // Step 1


                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });

                    const handleBarOptions = {
                        viewEngine: {
                            extName: '.html',
                            partialsDir: '../backend/email_template/',
                            layoutsDir: '../backend/email_template/',
                            defaultLayout: '',
                        },
                        viewPath: '../backend/email_template/',
                        extName: '.html',
                    };

                    transporter.use('compile', hbs(handleBarOptions));

                    // Step 2
                    let mailOptions = {
                        from: 'lexiconbank2020@gmail.com',
                        to: userInfo.email,
                        subject: 'Lexicon Account',
                        text: 'Your Temporary Password is: ' + userInfo.password,
                        template: 'account_created',
                        context: {
                            name: userInfo.full_name,
                            password: unhashed_password,
                            email: userInfo.email,
                            role: userInfo.user_role
                        }
                    }

                    // Step 3
                    transporter.sendMail(mailOptions)
                        .then(function (response) {

                        })
                        .catch(function (error) {
                            console.log('error');
                        });

                }
            }
            catch (error) {
                console.log(error)

                res.status = "error"; res.message = error.message;
            }
            return res;
        } else {
            res.status = "error";
            return res;
        }
    }

    async verifyAdmin() {
        let res = {};
        const mdb_user = new MDB_USER();
        let check_account = await mdb_user.findByEmailAndRole(this.user_information.email);

        if (check_account != null) {
            let has_role = check_account.user_role == null;

            if (has_role == false) {
                let token_mixer = process.env.ADMIN_TOKEN_MIXER;

                const result = await bcrypt.compare(this.user_information.password, check_account.admin_pass);

                let admin_details = {
                    user_id: check_account._id,
                    user_role: check_account.user_role,
                    full_name: check_account.full_name,
                    description: "Logged on",
                    date_created: this.user_information.date_created,
                    timestamp_created_at: this.user_information.date_created,
                }

                if (result) {
                    check_account.token = jwt.sign(check_account, token_mixer);
                    this.mdb_activity_logs.add(admin_details);

                    res.status = "success";
                    res.data = check_account;
                }
                else {
                    res.status = "error";
                    res.message = "Invalid Password!";
                }

                return res;
            }
            else {
                res.status = "error";
                res.message = "Your not registered as Administrator!";
            }
        } else {
            res.status = "error";
            res.message = "Email not registered!";
            return res;
        }
        return res;
    }

    async delUser() {
        let res = {};
        try {
            const mdb_user = new MDB_USER();
            const doc = await mdb_user.delUser(this.user_information.user_id)



            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Deleted Admin ${doc.full_name} - ${doc.user_role}`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
        // let res = {};
        // try {
        //     const mdb_user = new MDB_USER();
        //     const doc = await mdb_user.findOneAndUpdate({ _id: this.user_information.user_id }, { $set: { user_role: null } });

        //     res.status = "success";
        //     res.data = doc;
        //     console.log(doc)
        // } catch (error) {
        //     res.status = "error";
        //     res.message = error.message;
        // }
        // return res;
    }
    async createRole() {
        let res = {};
        const mdb_role = new MDB_ROLE();
        let check_dublicate = await mdb_role.findByRole(this.user_information.role_name);

        let admin_details = {
            user_id: this.user_information.user_info._id,
            user_role: this.user_information.user_info.user_role,
            full_name: this.user_information.user_info.full_name,
            description: `Created ${this.user_information.role_name} Role`,
            date_created: this.user_information.date_created,
            timestamp_created_at: this.user_information.date_created,
        }
        await this.mdb_activity_logs.add(admin_details);

        if (check_dublicate == null) {
            try {

                res.status = "success";
                let roleInfo = {
                    Role: this.user_information.role_name,
                    Restrictions: this.user_information.permissions,
                    Description: this.user_information.description,
                }
                await mdb_role.add(roleInfo);


            }
            catch (error) {
                res.status = "error";
                res.message = error.message;
            }
            return res;
        } else {
            res.status = "error";
            return res;
        }

    }


    async getrolelist() {
        let res = {};
        try {

            const mdb_role = new MDB_ROLE();
            const doc = await mdb_role.findRole();

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async delRole() {
        let res = {};
        try {
            const mdb_role = new MDB_ROLE();
            const doc = await mdb_role.delRole(this.user_information.role_id)

            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Deleted ${this.user_information.user_info.user_role} Role`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async makeAccountNumber(data = {}) {
        let result = '';

        let date_ob = new Date();
        let year = date_ob.getFullYear().toString().substr(2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        let account_data =
        {
            user_id: data._id,
            account_name: data.full_name,
            currency: 'USD',
            account_number_code: '840' + month + year
        }
        let res = await this.mdb_account_number.saveAccount(account_data);
        if (res) {
            result = res.account_number_code + res._id;
        }
        else {
            console.log('error');
        }
        return result;
    }

    async postCreateAccount() {
        let res = {};
        const mdb_user = new MDB_USER();
        const mdb_kyc = new MDB_KYC();
        let check_account = await mdb_user.findByEmail(this.user_information.email);

        if (check_account == null) {
            try {

                res.status = "success";

                let userInfo = {

                    full_name: this.user_information.full_name,
                    email: this.user_information.email,
                    country: this.user_information.country,
                    password: '',
                    date_created: Date.now()
                }

                const userResult = await mdb_user.add(userInfo);

                let acc_num = await this.makeAccountNumber(userResult);

                let wallet =
                {
                    currency: 'USD',
                    balance: 0,
                    wallet_address: acc_num,
                    decimal_places: 2,
                    is_fiat: true,
                }
                await this.mdb_user.update(userResult._id, { wallet: wallet, wallet_address: acc_num });

                let add_form_wallet =
                {
                    user_id: userResult._id,
                    currency_id: '5f0c2e741a29fe3a3c07347c',
                    currency_abbreviation: 'USD',
                    balance: 0,
                    decimal_places: 2,
                    public_key: acc_num,
                    private_key: acc_num,
                }
                await this.mdb_wallet.add(add_form_wallet);

                res.data = userResult;

                let create_user_file_path_res = await this.createUserFilePath(res.data._id);

                if (res.status == 'success') {

                    let kycInfo = {
                        first_name: this.user_information.firstname,
                        middle_name: this.user_information.middlename,
                        last_name: this.user_information.lastname,
                        birthday: this.user_information.birthdate,
                        nationality: this.user_information.nationality,
                        gender: this.user_information.gender,
                        house_number: this.user_information.house_number,
                        street_address: this.user_information.street_address,
                        city: this.user_information.city,
                        zip_code: this.user_information.postal_code,
                        contact_code: this.user_information.contact_code,
                        contact: this.user_information.mobile_number,
                        country: this.user_information.country,
                        user_id: res.data._id,
                        date_created: Date.now(),
                    }
                    const kycResult = await mdb_kyc.add(kycInfo);


                    let admin_details = {
                        user_id: this.user_information.user_info._id,
                        user_role: this.user_information.user_info.user_role,
                        full_name: this.user_information.user_info.full_name,
                        description: `Encoded User: ${this.user_information.full_name}`,
                        date_created: this.user_information.date_created,
                        timestamp_created_at: this.user_information.date_created,
                    }
                    await this.mdb_activity_logs.add(admin_details);

                    // Step 1

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });

                    const handleBarOptions = {
                        viewEngine: {
                            extName: '.html',
                            partialsDir: '../backend/email_template/',
                            layoutsDir: '../backend/email_template/',
                            defaultLayout: '',
                        },
                        viewPath: '../backend/email_template/',
                        extName: '.html',
                    };


                    transporter.use('compile', hbs(handleBarOptions));


                    // Step 2
                    let mailOptions = {
                        from: 'lexiconbank2020@gmail.com',
                        to: userInfo.email,
                        subject: 'Lexicon Account Verification',
                        text: 'Verify your account',
                        template: 'user_account_verification',
                        context: {
                            name: userInfo.full_name,
                            email: userInfo.email,
                            id: userResult._id,
                        }
                    }

                    // Step 3
                    transporter.sendMail(mailOptions)
                        .then(function (response) {

                        })
                        .catch(function (error) {
                            console.log('error');
                        });

                    // SendSMS

                    const accountSid = 'AC6a51779544c551cf3cb59beea9f7fdf5';
                    const authToken = 'bea08706a24ed85e3b19a0b78920942d';


                    var client = new twilio(accountSid, authToken);
                    client.messages
                        .create({
                            body: 'Hi, ' + userInfo.full_name + 'this is lexicon bank, you can now check you email and verify your account',
                            from: '+13343261187',
                            to: kycInfo.contact_code + kycInfo.contact
                        })
                        .then(message => console.log(message.sid))
                        .done();
                }
            }
            catch (error) {

                res.status = "error";
                res.message = error.message;

            }
            return res;
        } else {
            res.status = "error";
            res.message = "Error dito";
            return res;
        }
    }

    async setUserPass() {
        let res = {};
        try {
            const mdb_user = new MDB_USER();
            let password = this.user_information.password;
            let confirm_password = this.user_information.confirm_password;
            let check_account = await mdb_user.findByEmail(this.user_information.email);

            if (check_account != null) {
                if (password == confirm_password) {

                    let hashed_password = await bcrypt.hash(this.user_information.password, 10);

                    const doc = await mdb_user.findOneAndUpdate({ email: this.user_information.email }, { $set: { password: hashed_password } });

                    res.status = "success";
                    res.data = doc;

                } else {
                    res.status = "error";
                    res.message = "Password doesn't matched!";
                }
            }
            else {
                res.status = "error";
                res.message = "Email not registered!";
            }

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }


    async getUserByID() {
        let res = {};
        try {
            const mdb_user = new MDB_USER();
            const doc = await mdb_user.findByUserId(this.user_information.userID);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async getAllHedgeFundTransactions() {
        let res = {};
        try {

            const doc = await this.mdb_hedge_fund.findHedgeFundTransactions();

            res.status = "success";
            res.data = doc

        } catch (error) {
            res.status = "error";
            res.message = error.message
        }
        return res
    }


    async updateHedgeFundTransaction() {

        let res = {}

        try {
            let client_info = await this.mdb_user.doc(this.user_information.user_id);

            // NOTIFY ADMIN AND SENDER
            let email_receiver = `lexiconbank2020@gmail.com; ${client_info.email};`


            let email_subject = `Hedge Fund Transaction`;

            // Step 1
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const handleBarOptions = {
                viewEngine: {
                    extName: '.html',
                    partialsDir: '../backend/email_template/',
                    layoutsDir: '../backend/email_template/',
                    defaultLayout: '',
                },
                viewPath: '../backend/email_template/',
                extName: '.html',
            };

            transporter.use('compile', hbs(handleBarOptions));

            // Step 2
            let mailOptions = {
                from: 'lexiconbank2020@gmail.com',
                to: email_receiver,
                subject: email_subject,
                text: 'Lexicon Bank to Other Bank',
                template: 'hedge_fund_admin',
                context: {

                    rate: (this.user_information.rate).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    }),
                    full_name: client_info.full_name,
                    date_to: this.user_information.date_to,
                    date_from: this.user_information.date_from,
                    date_time: `${ moment(this.user_information.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm') }`,
                    date_time: this.user_information.date_time,
                    status: "Approved"
                }
            }

            // Step 3
            transporter.sendMail(mailOptions)
                .then(function (response) {

                })
                .catch(function (error) {
                    console.log('Error: ', error);
                });

            // projected_value
            let percentage = this.user_information.rate / 100
            let projected_value = this.user_information.amount + (this.user_information.amount * percentage)

            let user_hedge_update = await this.mdb_hedge_fund.update(this.user_information.id, {
                status: "Approved",
                rate: this.user_information.rate,
                date_to: this.user_information.date_to,
                date_from: this.user_information.date_from,
                projected_value: projected_value
            })

            // user update
            client_info.hedge_fund.push(user_hedge_update);
            let updated_client_info = await this.mdb_user.update(this.user_information.user_id, {
                hedge_fund: client_info.hedge_fund
            });

            //activity log
            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Approved ${updated_client_info.full_name}'s ${user_hedge_update.fund_type}`,
                reference_number: user_hedge_update.reference_number,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_staging_hedge_fund.deleteStaging(user_hedge_update.user_id, user_hedge_update.fund_type);
            await this.mdb_activity_logs.add(admin_details);

            res.status = "success";
        }


        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async getTransactionReports() {
        let res = {}
        try {
            let filters = this.user_information;

            if (filters.hasOwnProperty('last_defined_date_range')) {
                let server_date = ServerClass.get_date();
                filters.date_from = moment(server_date).subtract(filters.last_defined_date_range, 'days');
                filters.date_to = moment(server_date);
                delete filters.last_defined_date_range;
            } else {
                filters.date_from = new Date(filters.date_from)
                console.log(filters.date_from)
                filters.date_to = new Date(filters.date_to)
                filters.date_from = moment(filters.date_from)
                filters.date_to = moment(filters.date_to)
            }
            console.log(filters.date_from)
            filters.date_from_timestamp = moment(filters.date_from.hours(0).minutes(0).seconds(0).milliseconds(0)).format('x')
            console.log(filters.date_from_timestamp)
            filters.date_to_timestamp = moment(filters.date_to.hours(23).minutes(59).seconds(59).milliseconds(999)).format('x')

            if (filters.transaction_type == 'All') {
                delete filters.transaction_type
            }
            else {
                filters.transaction_type = filters.transaction_type.toLowerCase()
            }

            if (filters.currency == 'All') {
                delete filters.currency
            }
            else {
                filters.currency = filters.currency.toUpperCase()
            }


            let mdb_transaction = new MDB_TRANSACTION()
            if (filters.transaction_type == 'hedge') {
                delete filters.transaction_type;
                res.data = await this.mdb_hedge_fund.getReportsIn(filters);
            }
            else {
                res.data = await this.mdb_transaction.getReportsIn(filters);
            }

            res.status = 'success'

            return res;
        } catch (error) {
            console.log(error)
            res.message = error
            res.status = 'error'
            return error
        }
    }

    async getAllAddFund() {
        let res = {};
        try {
            let doc = {}
            if(this.user_information)
            {
                let date_from = new Date(this.user_information.from);
                let date_to = new Date(this.user_information.to);
                date_from = moment(date_from);
                date_to = moment(date_to);
                let date_from_timestamp = moment(date_from.hours(0).minutes(0).seconds(0).milliseconds(0)).format('x');
                let date_to_timestamp = moment(date_to.hours(23).minutes(59).seconds(59).milliseconds(999)).format('x')
                doc = await this.mdb_add_funds.findFilteredAddFunds(date_from_timestamp, date_to_timestamp);
            }
            else
            {
                doc = await this.mdb_add_funds.findAllAddFunds();
                // await this.mdb_add_funds.updateAllAddFunds();
            }
            res.status = "success";
            res.data = doc

        } catch (error) {
            res.status = "error";
            res.message = error.message
        }
        return res
    }

    async createUserFilePath(user_id) {
        let res = {};

        try {

            await fs.mkdirSync(`${process.env.MEMBER_DIR}/${user_id}/`);
            await fs.mkdirSync(`${process.env.MEMBER_DIR}/${user_id}/images/`);
            await fs.mkdirSync(`${process.env.MEMBER_DIR}/${user_id}/images/id/`);
            await fs.mkdirSync(`${process.env.MEMBER_DIR}/${user_id}/images/selfie/`);
            await fs.mkdirSync(`${process.env.MEMBER_DIR}/${user_id}/images/transactions/`);

            res.status = 'success';
        } catch (error) {
            res.status = 'error';
            res.error = error;
        }
        return res;
    }

    async clientList() {
        let res = {};

        try {
            let all_users = await this.mdb_user.findClientsList();

            res.data = all_users;
            res.status = 'success';
        }
        catch (error) {
            res.status = 'error';
            res.error = error;
        }

        return res;
    }

    async activityLogs() {
        let res = {};

        try {
            // let activity_logs = await this.mdb_activity_logs.findByDateDesc();
            // res.data   = activity_logs;
            // res.status = 'success';

            let doc = {}
            if(this.user_information)
            {
                let date_from = new Date(this.user_information.from);
                let date_to = new Date(this.user_information.to);
                date_from = moment(date_from);
                date_to = moment(date_to);
                let date_from_timestamp = moment(date_from.hours(0).minutes(0).seconds(0).milliseconds(0)).format('x');
                let date_to_timestamp = moment(date_to.hours(23).minutes(59).seconds(59).milliseconds(999)).format('x')
                doc = await this.mdb_activity_logs.findFilteredActivityLogs(date_from_timestamp, date_to_timestamp);
            }
            else
            {
                doc = await this.mdb_activity_logs.findByDateDesc();
            }

            res.status = "success";
            res.data = doc
        }
        catch (error) {
            res.status = 'error';
            res.error = error;
        }

        return res;
    }

    // async getAllAddFund() {
    //     let res = {};
    //     try {
    //         let doc = {}
    //         if(this.user_information)
    //         {
    //             let date_from = new Date(this.user_information.from);
    //             let date_to = new Date(this.user_information.to);
    //             date_from = moment(date_from);
    //             date_to = moment(date_to);
    //             let date_from_timestamp = moment(date_from.hours(0).minutes(0).seconds(0).milliseconds(0)).format('x');
    //             let date_to_timestamp = moment(date_to.hours(23).minutes(59).seconds(59).milliseconds(999)).format('x')
    //             doc = await this.mdb_add_funds.findFilteredAddFunds(date_from_timestamp, date_to_timestamp);
    //         }
    //         else
    //         {
    //             doc = await this.mdb_add_funds.findAllAddFunds();
    //             // await this.mdb_add_funds.updateAllAddFunds();
    //         }
    //         res.status = "success";
    //         res.data = doc

    //     } catch (error) {
    //         res.status = "error";
    //         res.message = error.message
    //     }
    //     return res
    // }

    async returnHedgeFund(user_id, fund_type) {
        let hedge_fund = await this.mdb_staging_hedge_fund.findByUserIdAndFundType(user_id, fund_type);

        for (let i = 0; i < hedge_fund.length; i++) {
            let user_info = await this.mdb_user.findAllByUserId(user_id);
            let wallet = await this.mdb_wallet.findAllByAbbreviationAndUserId(hedge_fund[i].currency_abbreviation, hedge_fund[i].user_id);
            let updated_balance = wallet.balance + hedge_fund[i].amount;

            let index = user_info.wallet_address.indexOf(wallet.public_key);
            user_info.wallet[index].balance = updated_balance;

            await this.mdb_wallet.update(wallet._id, { balance: updated_balance });
            await this.mdb_user.update(user_info._id, { wallet: user_info.wallet });
        }
    }

    async deleteHedgeFundTransaction() {
        let res = {}
        try {
            let doc = await this.mdb_hedge_fund.delHedgeFund({ _id: this.user_information.id });
            await this.returnHedgeFund(doc.user_id, doc.fund_type);

            // activity logs
            let admin_details = {
                user_id: this.user_information.user_info._id,
                user_role: this.user_information.user_info.user_role,
                full_name: this.user_information.user_info.full_name,
                description: `Deleted ${doc.full_name}'s ${doc.fund_type}`,
                date_created: this.user_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            await this.mdb_activity_logs.add(admin_details);

            res.status = 'success';
            res.data = doc;
        }
        catch (error) {
            res.status = 'error';
            res.message = error;
        }
        return res;
    }

    async sendMessage() {

        let res = {};
        try {
            // --------TWILIO-----------
            // const accountSid = 'AC6a51779544c551cf3cb59beea9f7fdf5';
            // const authToken = 'bea08706a24ed85e3b19a0b78920942d';


            // var client = new twilio(accountSid, authToken);
            // client.messages
            //   .create({
            //      // body: 'Hi, ' + userInfo.full_name + 'this is lexicon bank, you can now check you email and verify your account',
            //      body: this.user_information.message,
            //      from: '+13343261187',
            //      to: this.user_information.receiver,
            //    })
            //   .then(message => console.log(message.sid))
            //   .done();


            //---------NEXMO----------------

            const nexmo = new Nexmo({
                apiKey: '9efa9906',
                apiSecret: '5XhxGmVeKu2InFby',
            });

            const from = 'Lexicon';
            const to = this.user_information.receiver;
            const text = this.user_information.message;

            nexmo.message.sendSms(from, to, text);



            res.status = "success"

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }
}
