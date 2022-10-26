const MDB_USER = require('../models/MDB_USER');
const MDB_WALLET = require('../models/MDB_WALLET');
const MDB_TRANSACTION = require('../models/MDB_TRANSACTION');
const MDB_KYC = require('../models/MDB_KYC');
const MDB_CURRENCY = require('../models/MDB_CURRENCY');
const MDB_ADD_FUNDS = require('../models/MDB_ADD_FUNDS')
const MDB_CONVERSION = require('../models/MDB_CONVERSION');
const MDB_ACCOUNT_NUMBER = require('../models/MDB_ACCOUNT_NUMBER');
const MDB_REFERENCE_NUMBER = require('../models/MDB_REFERENCE_NUMBER');
const MDB_VERIFY_OTP = require('../models/MDB_VERIFY_OTP');
const MDB_FEE = require('../models/MDB_FEE');
const MDB_HEDGE_FUNDS = require('../models/MDB_HEDGE_FUND');
const MDB_STAGING_TRANSACTION = require('../models/MDB_STAGING_TRANSACTION');
const MDB_STAGING_HEDGE_FUND = require('../models/MDB_STAGING_HEDGE_FUND');
const MDB_ACTIVITY_LOGS = require('../models/MDB_ACTIVITY_LOGS');
const ServerClass = require('./ServerClass');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const brcypt = require('bcryptjs');
const axios = require('axios');
const moment = require('moment-timezone');
const NotificationClass = require('./NotificationClass');

module.exports = class WalletClass {
    constructor(wallet_information) {
        this.wallet_information = wallet_information;
        this.mdb_currency = new MDB_CURRENCY();
        this.mdb_wallet = new MDB_WALLET();
        this.mdb_transaction = new MDB_TRANSACTION();
        this.mdb_user = new MDB_USER();
        this.mdb_kyc = new MDB_KYC();
        this.mdb_add_funds = new MDB_ADD_FUNDS();
        this.mdb_conversion = new MDB_CONVERSION();
        this.mdb_account_number = new MDB_ACCOUNT_NUMBER();
        this.mdb_reference_number = new MDB_REFERENCE_NUMBER();
        this.mdb_hedge_fund = new MDB_HEDGE_FUNDS();
        this.mdb_staging_transaction = new MDB_STAGING_TRANSACTION();
        this.mdb_staging_hedge_fund = new MDB_STAGING_HEDGE_FUND();
        this.mdb_verify_otp = new MDB_VERIFY_OTP();
        this.mdb_fee = new MDB_FEE();
        this.mdb_activity_logs = new MDB_ACTIVITY_LOGS();
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
    async makeAccountNumber() {
        let result = '';

        let date_ob = new Date();
        let year = date_ob.getFullYear().toString().substr(2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        let account_data =
        {
            user_id: this.wallet_information.user_info._id,
            account_name: this.wallet_information.user_info.full_name,
            currency: this.wallet_information.abbreviation,
            account_number_code: this.wallet_information.number_code + month + year
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
    async generate() {
        let res = {};
        let currency = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
        let public_key = await this.makeAccountNumber();
        let private_key = public_key;

        try {
            res.status = "success";
            let add_to_user_wallet =
            {
                currency: this.wallet_information.abbreviation,
                currency_name: currency.name,
                balance: 0,
                wallet_address: public_key,
                decimal_places: currency.decimal_places,
                is_fiat: currency.is_fiat
            }
            this.wallet_information.user_info.wallet.push(add_to_user_wallet);
            this.wallet_information.user_info.wallet_address.push(public_key);

            await this.mdb_user.update(this.wallet_information.user_info._id, { wallet: this.wallet_information.user_info.wallet, wallet_address: this.wallet_information.user_info.wallet_address })

            let add_form =
            {
                user_id: this.wallet_information.user_info._id,
                currency_id: currency._id,
                currency_abbreviation: this.wallet_information.abbreviation,
                is_fiat: currency.is_fiat,
                balance: 0,
                decimal_places: currency.decimal_places,
                public_key: public_key,
                private_key: private_key,
            }
            await this.mdb_wallet.add(add_form);
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async sendInternal() {
        let res = {};
        let code = 'PGM';

        let sender_info = await this.mdb_user.findByUserId(this.wallet_information.user_info._id);

        if (sender_info.is_account_locked == true)
        {
            res.status = "error";
            res.message = "Sending is disabled";
        }
        else {
            let sender = await this.mdb_wallet.findByCurrencyAndUserId(this.wallet_information.abbreviation, this.wallet_information.user_info._id);

            if (sender == null) {
                res.status = "error";
                res.message = "Transaction error, Please try again";
                return res;
            }
            else {
                let kyc = await this.mdb_kyc.findByUserIdFiltered(this.wallet_information.user_info._id);
                let currency = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
                let receiver = await this.mdb_wallet.findByPublicKey(this.wallet_information.receiver_public_key);
                let receiver_info     = await this.mdb_user.findByPublicKey(this.wallet_information.receiver_public_key);
                let is_password_match = await brcypt.compare(this.wallet_information.password, sender_info.password);
                let conv = await this.mdb_conversion.findByAbbreviation('USD');
                let fee  = await this.mdb_fee.findByFeeType('Internal Transfer');
                if
                    (
                    kyc == null ||
                    sender == null ||
                    sender_info == null ||
                    receiver == null ||
                    receiver_info == null ||
                    currency == null ||
                    conv == null ||
                    fee == null ||
                    typeof this.wallet_information.amount != "number"
                ) {
                    res.status  = "error";
                    res.message = "Input error";
                }

                else if
                    (
                    !is_password_match ||
                    kyc.security_answer != this.wallet_information.security_answer ||
                    kyc.security_question != this.wallet_information.security_question
                ) {
                    res.status  = "error";
                    res.message = "Invalid credentials !";
                }

                else {
                    // Update sender wallet
                    let sender_amt   = Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places);
                    let receiver_amt = Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places);
                    let charge = 0;
                    let conv_charge = 0;
                    let charge_type = fee.charge_type;
                    if (receiver.currency_abbreviation != this.wallet_information.abbreviation) {
                        let conv_fee = await this.mdb_fee.findByFeeType('Conversion');
                        charge_type = conv_fee.charge_type

                        receiver_amt = Math.floor(this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] / conv.conversion[receiver.currency_abbreviation] * 10 ** receiver.decimal_places);

                        if (charge_type == "Percentage" && conv_fee.is_enabled) {
                            conv_charge = Math.floor((conv_fee.value / 100) * this.wallet_information.amount * 10 ** receiver.decimal_places);
                        }
                        else if (charge_type == "Fixed" && conv_fee.is_enabled) {
                            conv_charge = Math.floor(fee.value / conv.conversion[this.wallet_information.abbreviation] * 10 ** currency.decimal_places);
                        }
                    }
                    else {
                        if (charge_type == "Percentage" && fee.is_enabled) {
                            sender_amt = Math.floor(((100 + fee.value) / 100) * this.wallet_information.amount * 10 ** currency.decimal_places);
                        }
                        else if (charge_type == "Fixed" && fee.is_enabled) {
                            charge = Math.floor(fee.value / conv.conversion[this.wallet_information.abbreviation] * 10 ** currency.decimal_places);
                        }
                    }

                    let sender_updated_balance = sender.balance - sender_amt - charge - conv_charge;
                    let sender_index = this.wallet_information.user_info.wallet_address.indexOf(sender.public_key);
                    let reference_number = await this.makeOrderNumber(code, this.wallet_information.user_info._id);

                    this.wallet_information.user_info.wallet[sender_index].balance = sender_updated_balance;

                    let add_transaction_sender =
                    {
                        user_id:                this.wallet_information.user_info._id,
                        full_name:              this.wallet_information.user_info.full_name,
                        currency_id:            currency._id,
                        currency_abbreviation:  this.wallet_information.abbreviation,
                        transaction_type:       "send internal",
                        transaction_method:     "minus",
                        amount:                 Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places),
                        balance_before:         sender.balance,
                        balance_after:          sender_updated_balance,
                        description:            "Sent " + (Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places) / 10 ** currency.decimal_places).toLocaleString("en-US", {
                            minimumFractionDigits: currency.decimal_places,
                            maximumFractionDigits: currency.decimal_places
                        }) + " " + this.wallet_information.abbreviation + " to " + receiver_info.full_name,
                        remarks:                this.wallet_information.remarks,
                        triggered_by:           this.wallet_information.user_info._id,
                        decimal_places:         currency.decimal_places,
                        date_created:           this.wallet_information.date_created,
                        timestamp_created_at:   this.wallet_information.date_created,
                        reference_number:       reference_number,
                        charge_type:            charge_type,
                        fee:                    charge + conv_charge,
                        status:                 "Sent"
                    };
                    if (receiver.currency_abbreviation != this.wallet_information.abbreviation) {
                        let rate = (conv.conversion[this.wallet_information.abbreviation] / conv.conversion[receiver.currency_abbreviation]);
                        add_transaction_sender.description = `You have sent ${this.wallet_information.abbreviation} ${(sender_amt / 10 ** currency.decimal_places).toLocaleString("en-US", { minimumFractionDigits: currency.decimal_places })} (${receiver.currency_abbreviation} ${(receiver_amt / 10 ** receiver.decimal_places).toLocaleString("en-US", { minimumFractionDigits: receiver.decimal_places })}) to ${receiver_info.full_name}`;
                        add_transaction_sender.conversion_rate = `${this.wallet_information.abbreviation} 1.00 ~ ${receiver.currency_abbreviation} ${rate.toLocaleString("en-US", { minimumFractionDigits: rate < 1 ? 6 : receiver.decimal_places, maximumFractionDigits: rate < 1 ? 9 : receiver.decimal_places })}`;
                        add_transaction_sender.transaction_type = "send internal with conversion";
                    }

                    let limit_counter_USD = Math.floor((this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation]) * 10 ** currency.decimal_places)

                    this.mdb_user.update(sender.user_id, {
                        wallet:         this.wallet_information.user_info.wallet,
                        limit_internal: sender_info.limit_internal + limit_counter_USD,
                        send_attempt:   0
                    });
                    this.mdb_wallet.update(sender._id, { balance: sender_updated_balance });
                    let sender_transaction = await this.mdb_transaction.add(add_transaction_sender);

                    // Update receiver wallet
                    let receiver_updated = await this.mdb_wallet.findByPublicKey(this.wallet_information.receiver_public_key);
                    let receiver_updated_balance = receiver_updated.balance + receiver_amt;
                    let receiver_index = receiver_info.wallet_address.indexOf(this.wallet_information.receiver_public_key);
                    receiver_info.wallet[receiver_index].balance = receiver_updated_balance;

                    let add_transaction_receiver =
                    {
                        user_id:                receiver.user_id,
                        full_name:              receiver_info.full_name,
                        currency_id:            receiver.currency_id,
                        currency_abbreviation:  this.wallet_information.abbreviation,
                        transaction_type:       "receive internal",
                        transaction_method:     "plus",
                        amount:                 Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places),
                        balance_before:         receiver_updated.balance,
                        balance_after:          receiver_updated_balance,
                        description:            "Received " + (Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places) / 10 ** currency.decimal_places).toLocaleString("en-US", {
                            minimumFractionDigits: currency.decimal_places,
                            maximumFractionDigits: currency.decimal_places
                        }) + " " + this.wallet_information.abbreviation + " from " + this.wallet_information.user_info.full_name,
                        remarks:                this.wallet_information.remarks,
                        triggered_by:           this.wallet_information.user_info._id,
                        decimal_places:         currency.decimal_places,
                        date_created:           this.wallet_information.date_created,
                        timestamp_created_at:   this.wallet_information.date_created,
                        reference_number:       reference_number,
                        status:                 "Received"
                    };

                    this.mdb_user.update(receiver.user_id, { wallet: receiver_info.wallet });
                    this.mdb_wallet.update(receiver._id, { balance: receiver_updated_balance });
                    this.mdb_transaction.add(add_transaction_receiver);

                    res.data = sender_transaction;
                    res.status = "success";


                    // NOTIFY SENDER AND RECEIVER

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
                    if (sender_info) {
                        let mailOption1 = {
                            from:       'lexiconbank2020@gmail.com',
                            to:         this.wallet_information.user_info.email,
                            subject:    `You've successfully sent ${this.wallet_information.abbreviation} ${ (sender_amt / 10 ** currency.decimal_places).toLocaleString("en-US", {
                                    minimumFractionDigits: currency.decimal_places,
                                    maximumFractionDigits: currency.decimal_places
                                }) }`,
                            text:       'Send',
                            template:   'sender_internal',
                            context: {
                                amount:  (sender_amt / 10 ** currency.decimal_places).toLocaleString("en-US", {
                                    minimumFractionDigits: currency.decimal_places,
                                    maximumFractionDigits: currency.decimal_places
                                }),
                                currency:           this.wallet_information.abbreviation,
                                sender:             sender_info.full_name,
                                receiver:           receiver_info.full_name,
                                receiver_accnt_no:  receiver.public_key,
                                date_time:          moment(this.wallet_information.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm'),
                                reference_number:   reference_number
                            }
                        }

                        // Step 3
                        transporter.sendMail(mailOption1)
                            .then(function (response) {

                            })
                            .catch(function (error) {
                                console.log('Error: ', error);
                            });
                    }

                    if (receiver_info) {
                        let mailOption2 = {
                            from:       'lexiconbank2020@gmail.com',
                            to:         receiver_info.email,
                            subject:    `You have received ${this.wallet_information.abbreviation} ${ (receiver_amt / 10 ** currency.decimal_places).toLocaleString("en-US", {
                                    minimumFractionDigits: currency.decimal_places,
                                    maximumFractionDigits: currency.decimal_places
                                }) }`,
                            text: 'Receive',
                            template:   'receiver_internal',
                            context: {
                                amount:     (receiver_amt / 10 ** currency.decimal_places).toLocaleString("en-US", {
                                    minimumFractionDigits: currency.decimal_places,
                                    maximumFractionDigits: currency.decimal_places
                                }),
                                currency:   this.wallet_information.abbreviation,
                                sender:     sender_info.full_name,
                                receiver:   receiver_info.full_name,
                                date_time:  moment(this.wallet_information.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm'),
                            reference_number: reference_number
                            }
                        }

                        // Step 3
                        transporter.sendMail(mailOption2)
                            .then(function (response) {

                            })
                            .catch(function (error) {
                                console.log('Error: ', error);
                            });
                    }

                }
            }
        }

        return res;
    }

    async sendExternal() {
        let res = {};
        let code = 'PGM';

        let sender_info = await this.mdb_user.findByUserId(this.wallet_information.user_info._id);

        if (sender_info.is_account_locked == true) {
            res.status = "error";
            res.message = "Sending is disabled";
        }

        else {
            let sender = await this.mdb_wallet.findByCurrencyAndUserId(this.wallet_information.abbreviation, this.wallet_information.user_info._id);


            if (sender == null) {
                res.status  = "error";
                res.message = "Transaction error, Please try again";
            }
            else {
                let kyc      = await this.mdb_kyc.findByUserIdFiltered(this.wallet_information.user_info._id);
                let currency = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
                let is_password_match = await brcypt.compare(this.wallet_information.password, sender_info.password);
                let conv     = await this.mdb_conversion.findByAbbreviation('USD');
                let fee      = await this.mdb_fee.findByFeeType('Wire Transfer');

                if
                    (
                    kyc == null ||
                    sender == null ||
                    sender_info == null ||
                    currency == null ||
                    conv == null ||
                    fee == null ||
                    typeof this.wallet_information.amount != "number"
                ) {
                    res.status  = "error";
                    res.message = "Input error";
                }

                else if
                    (
                    !is_password_match ||
                    kyc.security_answer != this.wallet_information.security_answer ||
                    kyc.security_question != this.wallet_information.security_question
                ) {
                    res.status  = "error";
                    res.message = "Invalid credentials !";
                }

                else {
                    // Update sender wallet
                    let sender_amt   = Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places);
                    let receiver_amt = this.wallet_information.amount;
                    let charge = 0;
                    let ex_charge = 0;
                    if (fee.charge_type == "Percentage" && fee.is_enabled) {
                        // sender_amt = Math.floor(((100 + fee.value) / 100) * this.wallet_information.amount * 10 ** currency.decimal_places);
                        ex_charge = Math.floor((fee.value / 100) * this.wallet_information.amount * 10 ** currency.decimal_places);
                    }
                    else if (fee.charge_type == "Fixed" && fee.is_enabled) {
                        charge = Math.floor((fee.value / conv.conversion[this.wallet_information.abbreviation]) * 10 ** currency.decimal_places);
                        ex_charge = charge;
                    }
                    let sender_updated_balance = sender.balance - sender_amt - ex_charge;
                    let sender_index = this.wallet_information.user_info.wallet_address.indexOf(sender.public_key);
                    let reference_number = await this.makeOrderNumber(code, this.wallet_information.user_info._id);

                    this.wallet_information.user_info.wallet[sender_index].balance = sender_updated_balance;

                    // FOR FUTURE USE - daily limit in every currency
                    // let user_details     = this.wallet_information.user_info.wallet[sender_index];
                    // user_details.balance = sender_updated_balance;
                    // if(sender_info.wallet[sender_index].limit_external == undefined)
                    // {
                    //     user_details.limit_external = Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places)
                    // }
                    // else
                    // {
                    //     user_details.limit_external = sender_info.wallet[sender_index].limit_external + Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places)
                    // }

                    let add_transaction_sender =
                    {
                        user_id:                this.wallet_information.user_info._id,
                        full_name:              this.wallet_information.user_info.full_name,
                        currency_id:            currency._id,
                        currency_abbreviation:  this.wallet_information.abbreviation,
                        transaction_type:       "send external",
                        transaction_method:     "minus",
                        amount:                 Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places),
                        balance_before:         sender.balance,
                        balance_after:          sender_updated_balance,
                        description:            "Sent " + (Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places) / 10 ** currency.decimal_places).toLocaleString("en-US", {
                            minimumFractionDigits: currency.decimal_places,
                            maximumFractionDigits: currency.decimal_places
                        }) + " " + this.wallet_information.abbreviation + " to " + this.wallet_information.account_name,
                        remarks:                this.wallet_information.remarks,
                        triggered_by:           this.wallet_information.user_info._id,
                        decimal_places:         currency.decimal_places,
                        date_created:           this.wallet_information.date_created,
                        timestamp_created_at:   this.wallet_information.date_created,
                        // Added
                        bank:                   this.wallet_information.bank,
                        account_name:           this.wallet_information.account_name,
                        account_number:         this.wallet_information.account_number,
                        reference_number:       reference_number,
                        email:                  this.wallet_information.user_info.email,
                        status:                 "Pending",
                        status_admin:           "Pending",
                        charge_type:            fee.charge_type,
                        fee:                    ex_charge,
                    };

                    let add_transaction_fee = {};
                    if(add_transaction_sender.fee > 0)
                    {
                        add_transaction_sender.balance_after = sender.balance - sender_amt;

                        add_transaction_fee =
                        {
                            user_id:                this.wallet_information.user_info._id,
                            full_name:              this.wallet_information.user_info.full_name,
                            currency_id:            currency._id,
                            currency_abbreviation:  this.wallet_information.abbreviation,
                            transaction_type:       "transaction fee",
                            transaction_method:     "minus",
                            amount:                 ex_charge,
                            balance_before:         sender.balance - sender_amt,
                            balance_after:          sender_updated_balance,
                            description:            "Wire Transfer Fee",
                            triggered_by:           this.wallet_information.user_info._id,
                            decimal_places:         currency.decimal_places,
                            date_created:           this.wallet_information.date_created + 1,
                            timestamp_created_at:   this.wallet_information.date_created,
                        }
                    }
                    // console.log(add_transaction_sender.balance_after, add_transaction_fee.balance_after)

                    let limit_counter_USD = Math.floor((this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation]) * 10 ** currency.decimal_places)

                    this.mdb_user.update(sender.user_id, {
                        wallet:         this.wallet_information.user_info.wallet,
                        limit_external: sender_info.limit_external + limit_counter_USD,
                        send_attempt:   0
                    });

                    this.mdb_wallet.update(sender._id, { balance: sender_updated_balance });
                    this.mdb_transaction.add(add_transaction_fee);
                    let transaction = await this.mdb_transaction.add(add_transaction_sender);
                    // transaction.balance_after = sender_updated_balance;

                    // NOTIFY ADMIN AND SENDER
                    let email_receiver = `lexiconbank2020@gmail.com; ${this.wallet_information.user_info.email};`
                    let email_subject  = `Wire Transfer Reference Number: ${reference_number}`;

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
                        from:       'lexiconbank2020@gmail.com',
                        to:         email_receiver,
                        subject:    email_subject,
                        text:       'Lexicon Bank to Other Bank',
                        template:   'wire_transfer',
                        context: {
                            amount: receiver_amt.toLocaleString("en-US", {
                                    minimumFractionDigits: currency.decimal_places,
                                    maximumFractionDigits: currency.decimal_places
                                }),
                            currency:         this.wallet_information.abbreviation,
                            bank:             this.wallet_information.bank,
                            account_name:     this.wallet_information.account_name,
                            account_number:   this.wallet_information.account_number,
                            date_time:        moment(this.wallet_information.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm'),
                        reference_number:     reference_number,
                        status:               "Pending"
                        }
                    }

                    // Step 3
                    transporter.sendMail(mailOptions)
                        .then(function (response) {

                        })
                        .catch(function (error) {
                            console.log('Error: ', error);
                        });

                    res.data = transaction;
                    res.status = "success";

                }
            }
        }
        return res;
    }

    async history() {
        let res = {}

        let transactions = await this.mdb_transaction.findByTransactionHistory(this.wallet_information.user_id, this.wallet_information.abbreviation, this.wallet_information.skip);

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

    async viewBalance() {
        let res = {};

        let currency_balance = await this.mdb_wallet.findByAbbreviationAndUserId(this.wallet_information.abbreviation, this.wallet_information.user_id);
        let decimal = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
        let account_info = await this.mdb_user.findByUserId(this.wallet_information.user_id);
        let conv = await this.mdb_conversion.findByAbbreviation('USD');

        try {
            res.status = "success";
            res.data = currency_balance;
            res.decimal = decimal.decimal_places;
            res.conversion = conv.conversion;
            res.is_account_locked = account_info.is_account_locked;
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async viewBalance2() {
        let res = {};

        let account_info = await this.mdb_user.findByUserId(this.wallet_information.user_id);
        let conv         = await this.mdb_conversion.findByAbbreviation('USD');
        let kyc          = await this.mdb_kyc.findByUserId(this.wallet_information.user_id);

        try {
            res.status            = "success";
            res.data              = account_info.wallet;
            res.conversion        = conv.conversion;
            res.is_account_locked = account_info.is_account_locked;
            res.send_attempt      = account_info.send_attempt;
            res.kyc_status        = kyc.status;
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async userQuestion() {
        let res = {};

        let security_question = await this.mdb_kyc.findByUserIdFiltered(this.wallet_information.user_id);

        try {
            res.status = "success";
            res.data = security_question;
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }


    async addMoney() {
        console.log('Pasok na sa add money');
        let res = {}
        let code = 'PSG'
        let order_number = await this.makeOrderNumber(code, this.wallet_information.user_id);
        console.log('order number: ', order_number);
        // let currency = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
        // console.log('currency: ', currency);
        try
        {
            console.log('pasok na sa try');
            let add_funds =
            {
                user_id: this.wallet_information.user_id,
                full_name: this.wallet_information.full_name,
                currency_abbreviation: this.wallet_information.abbreviation,
                amount: Math.floor(this.wallet_information.amount * 10 ** 2),
                transaction_method: "manual",
                status: "pending",
                orderNumber: order_number,
                remarks: this.wallet_information.remarks,
                decimal_places: 2,
                date_created: this.wallet_information.date_created,
                timestamp_created_at: this.wallet_information.date_created,
            };
            console.log('add funds: ', add_funds);

            if (this.wallet_information.amount >= 200 || this.wallet_information.currency_abbreviation) {
                this.mdb_add_funds.add(add_funds);
                res.status = "success";
                console.log('success')
            }
            else
            {
                res.status = "error";
                res.message = "Invalid input";
            }
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        console.log('res: ', res);
        return res
    }

    async getCurrentDeposit() 
    {

        let res = {};
        try 
        {
            const details = await this.mdb_add_funds.findOneByTransactionHistory(this.wallet_information.user_id);

            res.status = "success";
            res.data = details;
        } 
        catch(error) 
        {
            res.status = "error";
            res.message = error.message
        }
        return res
    }

    async getAllAddFund() {

        let res = {};
        try 
        {
            const details = await this.mdb_add_funds.findOneByTransactionHistory(this.wallet_information.user_id);

            res.status = "success";
            res.data = details;
        } 
        catch(error) 
        {
            res.status = "error";
            res.message = error.message
        }
        return res
    }

    async getAllAddFundTransactions() {
        let res = {};
        try {

            const doc = await this.mdb_add_funds.findAddFundsTransactions();

            res.status = "success";
            res.data = doc

        } catch (error) {
            res.status = "error";
            res.message = error.message
        }
        return res
    }

    async updateStatus() {
        let res = {};
        let add_fund_info = await this.mdb_add_funds.findByOrderNumber(this.wallet_information.order_number)

        try
        {
            res.status = "success";
            let result = await this.mdb_add_funds.update(add_fund_info._id, { status: "Cancelled" })

            // activity log
            let admin_details = {
                user_id:            this.wallet_information.user_info._id,
                user_role:          this.wallet_information.user_info.user_role,
                full_name:          this.wallet_information.user_info.full_name,
                description:        `Cancelled ${result.full_name}'s ${result.currency_abbreviation}  Add Fund`,
                reference_number:   this.wallet_information.order_number,
                date_created:       this.wallet_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }
            this.mdb_activity_logs.add(admin_details);
        }
        catch (error)
        {
            res.status = "error";
            res.message = error.message
        }
        return res
    }

    async getAddFundHistory() {
        let res = {}

        let transactions = await this.mdb_add_funds.findByTransactionHistory(this.wallet_information.user_id, this.wallet_information.skip);

        try {
            res.status = "success";
            res.data = transactions;
        }
        catch (error) {
            res.status = "error";
        }
        return res;
    }

    async attempt() {
        let res = {};

        try {
            res.status = "success";

            await this.mdb_user.update(this.wallet_information.user_id, { is_account_locked: this.wallet_information.is_account_locked });
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }


    async updateAdminAddFundHistory() {
        let res = {}
        try {

            let transactions = await this.mdb_wallet.findAllByAbbreviationAndUserId(this.wallet_information.currency_abbreviation, this.wallet_information.user_id);
            let user_info = await this.mdb_user.findAllByUserId(this.wallet_information.user_id);
            let add_fund_status = await this.mdb_add_funds.findByOrderNumber(this.wallet_information.orderNumber)
            let updated_balance = transactions.balance + this.wallet_information.amount
            let index = user_info.wallet_address.indexOf(transactions.public_key);
            user_info.wallet[index].balance = updated_balance;

            let now = Date.now();
            let add_transaction_receiver =
            {
                user_id:                transactions.user_id,
                full_name:              user_info.full_name,
                currency_id:            transactions.currency_id,
                currency_abbreviation:  transactions.currency_abbreviation,
                transaction_type:       "deposit",
                transaction_method:     "plus",
                amount:                 this.wallet_information.amount,
                balance_before:         transactions.balance,
                balance_after:          updated_balance,
                description:            "Deposited " + (this.wallet_information.amount / 10 ** 2).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + transactions.currency_abbreviation,
                decimal_places:         transactions.decimal_places,
                timestamp_created_at:   now,
                date_created:           now
            };

            // activity log
            let admin_details = {
                user_id:            this.wallet_information.user_info._id,
                user_role:          this.wallet_information.user_info.user_role,
                full_name:          this.wallet_information.user_info.full_name,
                description:        `Approved ${add_fund_status.full_name}'s ${add_fund_status.currency_abbreviation}  Add Fund`,
                reference_number:   this.wallet_information.orderNumber,
                date_created:       this.wallet_information.date_created,
                timestamp_created_at: this.user_information.date_created,
            }

            await this.mdb_transaction.add(add_transaction_receiver);
            await this.mdb_user.update(user_info._id, { wallet: user_info.wallet })
            await this.mdb_wallet.update(transactions._id, { balance: updated_balance })
            await this.mdb_add_funds.update(add_fund_status._id, { status: "Approved" })
            this.mdb_activity_logs.add(admin_details);

            res.status = "success";

        }


        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async verifyInternal() {
        let res = {};

        let sender_info  = await this.mdb_user.findByUserId(this.wallet_information.user_info._id);
        let sender       = await this.mdb_wallet.findByCurrencyAndUserId(this.wallet_information.abbreviation, this.wallet_information.user_info._id);
        let receiver     = await this.mdb_wallet.findByPublicKey(this.wallet_information.receiver_public_key);
        let currency     = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
        let conv         = await this.mdb_conversion.findByAbbreviation('USD');
        let wallet_index = sender_info.wallet.findIndex(x => x.currency == this.wallet_information.abbreviation);
        let fee = await this.mdb_fee.findByFeeType('Internal Transfer');

        let charge = 0;
        let sender_amt = Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places);
        if (fee.charge_type == "Percentage" && fee.is_enabled) {
            sender_amt = Math.floor(((100 + fee.value) / 100) * this.wallet_information.amount * 10 ** currency.decimal_places);
        }
        else if (fee.charge_type == "Fixed" && fee.is_enabled) {
            charge = Math.floor(fee.value / conv.conversion[this.wallet_information.abbreviation] * 10 ** currency.decimal_places);
        }

        // Check balance of (users, wallets) collection
        // console.log(sender.balance / 10 ** currency.decimal_places)

        if(receiver.user_id == sender.user_id)
        {
            res.status  = "error";
            res.message = "You cannot send in your account";
        }
        else if(!receiver)
        {
            res.status  = "error";
            res.message = "Recipient does not exist";
        }
        else if (
            this.wallet_information.amount > sender.balance / 10 ** currency.decimal_places ||
            this.wallet_information.amount > sender_info.wallet[wallet_index].balance / 10 ** currency.decimal_places
        ) {
            res.status  = "error";
            res.message = "Insufficient Balance";
        }
        else if (this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] > 50000)
        {
            res.status  = "error";
            res.message = "Transfer maximum of $50,000";
        }
        else if((sender_info.limit_internal / 10 ** currency.decimal_places) + this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] > 50000)
        {
            res.status  = "error";
            res.message = "Maximum daily transfer limit has been reached";
        }
        else if (this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] < 100) {
            res.status  = "error";
            res.message = "Minimum amount to send $100";
        }
        else {
            res.status = "success";
        }

        return res;
    }

    async verifyExternal() {
        let res = {};

        let sender_info  = await this.mdb_user.findByUserId(this.wallet_information.user_info._id);
        let sender       = await this.mdb_wallet.findByCurrencyAndUserId(this.wallet_information.abbreviation, this.wallet_information.user_info._id);
        let currency     = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
        let conv         = await this.mdb_conversion.findByAbbreviation('USD');
        let fee          = await this.mdb_fee.findByFeeType('Wire Transfer');
        let wallet_index = sender_info.wallet.findIndex(x => x.currency == this.wallet_information.abbreviation);

        let charge = 0;
        let sender_amt = Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places);
        if (fee.charge_type == "Percentage" && fee.is_enabled) {
            sender_amt = Math.floor(((100 + fee.value) / 100) * this.wallet_information.amount * 10 ** currency.decimal_places);
        }
        else if (fee.charge_type == "Fixed" && fee.is_enabled) {
            charge = Math.floor(fee.value / conv.conversion[this.wallet_information.abbreviation] * 10 ** currency.decimal_places);
        }

        // Check balance of (users, wallets) collection
        // console.log(sender.balance / 10 ** currency.decimal_places)

        if(!sender)
        {
            res.status  = "error";
            res.message = "Invalid credentials";
        }
        else if (sender_amt + charge > sender.balance)
        {
            res.status  = "error";
            res.message = "Insufficient Balance";
        }
        else if (this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] > 10000 )
        {
            res.status  = "error";
            res.message = "Maximum daily limit is equivalent to USD 10,000";
        }
        else if((sender_info.limit_external / 10 ** currency.decimal_places) + this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] > 10000)
        {
            res.status  = "error";
            res.message = "Maximum daily limit has been reached";
        }
        else if (this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] < 100) {
            res.status  = "error";
            res.message = "Minimum amount to send USD 100";
        }
        else {
            res.status = "success";
        }

        return res;
    }

    async locked() {
        let res = {};

        let kyc = await this.mdb_kyc.findByUserId(this.wallet_information.user_info._id);

        if (kyc.id_number != this.wallet_information.id_number) {
            res.status = "error";
            res.message = "ID number does not exists";
        }
        else {
            await this.mdb_user.update(this.wallet_information.user_info._id, { is_account_locked: false });
            res.status = "success";
        }

        return res;
    }

    async saveConversion() {
        let res = {};

        try {
            let abbreviation = "USD";
            let api_key = process.env.API_KEY;
            let url = `https://api.nomics.com/v1/exchange-rates?key=${api_key}`

            await axios.get(url).then(async response => {
                let convert = {};
                let contents = response.data;
                for (let i = 0; i < contents.length; i++) {
                    convert[contents[i].currency] = Number(contents[i].rate);
                }
                await this.mdb_conversion.updateByAbbreviation(abbreviation, { conversion: convert })
                res.conversion = convert;
                console.log("PHP", 1 / Number(contents[116].rate));
                console.log("EUR", 1 / Number(contents[47].rate));
                console.log("GBP", 1 / Number(contents[50].rate));
                console.log("BTC", Number(contents[21].rate));
            });

            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async saveFrequency() {
        let res = {};

        try {
            let abbreviation = "USD";
            await this.mdb_conversion.updateByAbbreviation(abbreviation, { frequency: this.wallet_information.frequency })
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async convert() {
        let res = {};
        let code = 'VPP'
        try {
            let from_currency = await this.mdb_wallet.findByCurrencyAndUserId(this.wallet_information.from_currency, this.wallet_information.user_info._id);
            let to_currency = await this.mdb_wallet.findByCurrencyAndUserId(this.wallet_information.to_currency, this.wallet_information.user_info._id);
            let conv = await this.mdb_conversion.findByAbbreviation('USD');
            let fee = await this.mdb_fee.findByFeeType('Conversion');
            let reference_number = await this.makeOrderNumber(code, this.wallet_information.user_info._id);

            if (typeof this.wallet_information.amount == "number" && this.wallet_information.from_currency != this.wallet_information.to_currency && from_currency != null && to_currency != null && conv != null && fee != null) {
                let from_amount = Math.floor(this.wallet_information.amount * 10 ** from_currency.decimal_places); // in usd

                let from_amount_dollar = this.wallet_information.amount * conv.conversion[from_currency.currency_abbreviation];
                if (from_amount <= from_currency.balance && from_amount_dollar >= 100) {
                    let to_amount = 0;
                    let conv_charge = 0;
                    if (fee.charge_type == "Percentage" && fee.is_enabled) {
                        // in php or btc
                        to_amount = Math.floor(((100 - fee.value) / 100) * this.wallet_information.amount * conv.conversion[from_currency.currency_abbreviation] / conv.conversion[to_currency.currency_abbreviation] * 10 ** to_currency.decimal_places);

                        conv_charge = Math.floor((fee.value / 100) * this.wallet_information.amount * 10 ** to_currency.decimal_places);
                    }
                    else if (fee.charge_type == "Fixed" && fee.is_enabled) {
                        // in php or btc
                        let charge = Math.floor(fee.value * 10 ** to_currency.decimal_places);

                        conv_charge = charge;

                        to_amount = Math.floor(this.wallet_information.amount * conv.conversion[from_currency.currency_abbreviation] / conv.conversion[to_currency.currency_abbreviation] * 10 ** to_currency.decimal_places) - charge;
                    }
                    else {
                        // in php or btc
                        to_amount = Math.floor(this.wallet_information.amount * conv.conversion[from_currency.currency_abbreviation] / conv.conversion[to_currency.currency_abbreviation] * 10 ** to_currency.decimal_places);
                    }

                    let from_updated_balance = from_currency.balance - from_amount;
                    let from_index = this.wallet_information.user_info.wallet_address.indexOf(from_currency.public_key);

                    let convert_from = (from_amount / 10 ** from_currency.decimal_places).toLocaleString("en-US", { minimumFractionDigits: from_currency.decimal_places });
                    let convert_to = (to_amount / 10 ** to_currency.decimal_places).toLocaleString("en-US", { minimumFractionDigits: to_currency.decimal_places });

                    this.wallet_information.user_info.wallet[from_index].balance = from_updated_balance;

                    let rate = (conv.conversion[from_currency.currency_abbreviation] / conv.conversion[to_currency.currency_abbreviation]);

                    let convert_from_currency =
                    {
                        user_id:                this.wallet_information.user_info._id,
                        full_name:              this.wallet_information.user_info.full_name,
                        currency_id:            from_currency.currency_id,
                        currency_abbreviation:  this.wallet_information.from_currency,
                        transaction_type:       "convert",
                        transaction_method:     "minus",
                        amount:                 from_amount,
                        balance_before:         from_currency.balance,
                        balance_after:          from_updated_balance,
                        description:            "Converted " + convert_from + " " + from_currency.currency_abbreviation + " to " + convert_to + " " + to_currency.currency_abbreviation,
                        remarks: "",
                        triggered_by:           this.wallet_information.user_info._id,
                        decimal_places:         from_currency.decimal_places,
                        date_created:           this.wallet_information.date_created,
                        timestamp_created_at:   this.wallet_information.date_created,
                        reference_number:       reference_number,
                        charge_type:            fee.charge_type,
                        fee:                    conv_charge,
                        conversion_rate:        `${from_currency.currency_abbreviation} 1.00 ~ ${to_currency.currency_abbreviation} ${rate.toLocaleString("en-US", { minimumFractionDigits: rate < 1 ? 6 : to_currency.decimal_places, maximumFractionDigits: rate < 1 ? 9 : to_currency.decimal_places })}`,
                        status:                 'Converted'
                    };

                    await this.mdb_user.update(from_currency.user_id, { wallet: this.wallet_information.user_info.wallet });
                    await this.mdb_wallet.update(from_currency._id, { balance: from_updated_balance });
                    await this.mdb_transaction.add(convert_from_currency);

                    let to_updated_balance = to_currency.balance + to_amount;
                    let to_index = this.wallet_information.user_info.wallet_address.indexOf(to_currency.public_key);

                    this.wallet_information.user_info.wallet[to_index].balance = to_updated_balance;

                    let convert_to_currency =
                    {
                        user_id:                this.wallet_information.user_info._id,
                        full_name:              this.wallet_information.user_info.full_name,
                        currency_id:            to_currency.currency_id,
                        currency_abbreviation:  this.wallet_information.to_currency,
                        transaction_type:       "convert",
                        transaction_method:     "plus",
                        amount:                 to_amount,
                        balance_before:         to_currency.balance,
                        balance_after:          to_updated_balance,
                        description:            "Converted " + convert_from + " " + from_currency.currency_abbreviation + " to " + convert_to + " " + to_currency.currency_abbreviation,
                        remarks:                this.wallet_information.remarks,
                        triggered_by:           this.wallet_information.user_info._id,
                        decimal_places:         to_currency.decimal_places,
                        date_created:           this.wallet_information.date_created,
                        timestamp_created_at:   this.wallet_information.date_created,
                        status:                 'Converted'
                    };

                    await this.mdb_user.update(to_currency.user_id, { wallet: this.wallet_information.user_info.wallet });
                    await this.mdb_wallet.update(to_currency._id, { balance: to_updated_balance });
                    await this.mdb_transaction.add(convert_to_currency);

                    res.status = "success";
                }
                else if (from_amount_dollar < 100) {
                    res.status = "error";
                    res.message = "Minimum conversion amount is $100 equivalent";
                }
                else if (from_amount > from_currency.balance) {
                    res.status = "error";
                    res.message = "Insufficient balance";
                }
                else {
                    res.status = "error";
                    res.message = "Conversion Error";
                }
            }
            else if (this.wallet_information.from_currency == this.wallet_information.to_currency) {
                res.status = "error";
                res.message = "Convert to other currency";
            }
            else if (from_currency == null && to_currency == null && conv == null) {
                res.status = "error";
                res.message = "Currency not available to your account";
            }
            else {
                res.status = "error";
                res.message = "Conversion Error";
            }
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async updateDepositSlip() {
        let res = {}
        try {
            res.status = "success";
            // let add_fund_status = await this.mdb_add_funds.findByOrderNumber(this.wallet_information.orderNumber)
            let deposit_slip_path = this.wallet_information.deposit_slip_path
            let id = this.wallet_information.id
            //Object_id
            let docss = await this.mdb_add_funds.update(id, { deposit_slip_path: deposit_slip_path, status: "Mark as paid" })

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res
    }

    async generateOTP() {
        let res = {};

        const email = this.wallet_information.user_info.email;

        // const expiration    = await this.mdb_global_settings.findBySettingType('email');
        const numbers = "0123456789";
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const chars_caps = chars.toUpperCase();
        const all_chars = numbers + chars + chars_caps;
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        function get_otp() {
            let otp = '';
            for (let i = 0; i < 6; i++) {
                let rand = getRandomArbitrary(0, all_chars.length);
                otp += all_chars[parseInt(rand)];
            }
            return otp;
        }
        const otp = get_otp();


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
            to: email,
            subject: 'Forgot Security Verification Code',
            text: 'Your One Time Passcode is: ' + otp,
            template: 'otp_send_disabled',
            context: {
                name: this.wallet_information.user_info.full_name,
                otp: otp
            }
        }

        // Step 3
        transporter.sendMail(mailOptions)
            .then(function (response) {

            })
            .catch(function (error) {
                console.log('Error: ', error);
            });

        res.message = 'Email Sent';
        res.status  = 'success';

        let otp_data =
        {
            otp: otp,
            email: email,

        }

        await this.mdb_verify_otp.add(otp_data);

        return res;
    }

    // async resetViaIdNumber() {
    //     let res = {};
    //     const email = this.wallet_information.email;
    //     let kyc = await this.mdb_kyc.findByUserId(this.wallet_information.user_info._id);
    //     let upperCaseIdNum = this.wallet_information.id_number.toUpperCase();
    //     let lastChar = kyc.id_number.endsWith(upperCaseIdNum)

    //     if (!lastChar) {
    //         res.status = "error";
    //         res.message = "Invalid Credential";
    //     }
    //     else if (lastChar) {
    //         res.status = "success";

    //         const numbers = "0123456789";
    //         const chars = "abcdefghijklmnopqrstuvwxyz";
    //         const chars_caps = chars.toUpperCase();
    //         const all_chars = numbers + chars + chars_caps;
    //         function getRandomArbitrary(min, max) {
    //             return Math.random() * (max - min) + min;
    //         }
    //         function get_otp() {
    //             let otp = '';
    //             for (let i = 0; i < 50; i++) {
    //                 let rand = getRandomArbitrary(0, all_chars.length);
    //                 otp += all_chars[parseInt(rand)];
    //             }
    //             return otp;
    //         }
    //         const otp = get_otp();
    //         console.log(otp);

    //         // Step 1
    //         let transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //                 user: process.env.EMAIL,
    //                 pass: process.env.PASSWORD
    //             }
    //         });

    //         const handleBarOptions = {
    //             viewEngine: {
    //                 extName: '.html',
    //                 partialsDir: '../backend/email_template/',
    //                 layoutsDir: '../backend/email_template/',
    //                 defaultLayout: '',
    //             },
    //             viewPath: '../backend/email_template/',
    //             extName: '.html',
    //         };

    //         transporter.use('compile', hbs(handleBarOptions));

    //         // Step 2
    //         let mailOptions = {
    //             from: 'lexiconbank2020@gmail.com',
    //             to: email,
    //             subject: 'Request Reset Security Question and Answer via ID Number',
    //             text: 'Requesting to Reset Security for Transaction',
    //             template: 'reset_securityQA_idNumber',
    //             context: {
    //                 name:  this.wallet_information.user_info.full_name,
    //                 email: this.wallet_information.email,
    //                 otp:   otp
    //             }
    //         }

    //         // Step 3
    //         transporter.sendMail(mailOptions)
    //             .then(function (response) {
    //                 console.log('Email Sent!');
    //             })
    //             .catch(function (error) {
    //                 console.log('Error: ', error);
    //             });

    //         let otp_data =
    //         {
    //             otp: otp,
    //             email: email,
    //         }

    //         await this.mdb_verify_otp.add(otp_data);
    //         res.data = otp_data;
    //     }

    //     return res;
    // }

    // async resetViaOTP() {
    //     let res = {};
    //     const email = this.wallet_information.email;

    //     const numbers = "0123456789";
    //     const chars = "abcdefghijklmnopqrstuvwxyz";
    //     const chars_caps = chars.toUpperCase();
    //     const all_chars = numbers + chars + chars_caps;
    //     function getRandomArbitrary(min, max) {
    //         return Math.random() * (max - min) + min;
    //     }
    //     function get_otp() {
    //         let otp = '';
    //         for (let i = 0; i < 50; i++) {
    //             let rand = getRandomArbitrary(0, all_chars.length);
    //             otp += all_chars[parseInt(rand)];
    //         }
    //         return otp;
    //     }
    //     const otp = get_otp();
    //     console.log(otp);

    //     // Step 1
    //     let transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: process.env.EMAIL,
    //             pass: process.env.PASSWORD
    //         }
    //     });

    //     const handleBarOptions = {
    //         viewEngine: {
    //             extName: '.html',
    //             partialsDir: '../backend/email_template/',
    //             layoutsDir: '../backend/email_template/',
    //             defaultLayout: '',
    //         },
    //         viewPath: '../backend/email_template/',
    //         extName: '.html',
    //     };

    //     transporter.use('compile', hbs(handleBarOptions));

    //     // Step 2
    //     let mailOptions = {
    //         from: 'lexiconbank2020@gmail.com',
    //         to: email,
    //         subject: 'Request Reset Security Question and Answer via OTP',
    //         text: 'Requesting to Reset Security for Transaction',
    //         template: 'reset_securityQA_otp',
    //         context: {
    //             email: this.wallet_information.email,
    //             otp: otp
    //         }
    //     }

    //     // Step 3
    //     transporter.sendMail(mailOptions)
    //         .then(function (response) {
    //             console.log('Email Sent!');
    //         })
    //         .catch(function (error) {
    //             console.log('Error: ', error);
    //         });

    //     res.status = 'success';

    //     let otp_data =
    //     {
    //         otp: otp,
    //         email: email,
    //     }

    //     await this.mdb_verify_otp.add(otp_data);
    //     res.data = otp_data;

    //     return res;
    // }

    // async updateSecurity() {
    //     let res = {};

    //     let check_otp = await this.mdb_verify_otp.findByEmailAndOtp(this.wallet_information.email, this.wallet_information.otp);

    //     if (check_otp) {
    //         let kyc = await this.mdb_kyc.findByUserIdAndUpdate(this.wallet_information.user_info._id, {
    //             security_question: this.wallet_information.security_question,
    //             security_answer: this.wallet_information.security_answer
    //         });

    //         let user_details = await this.mdb_user.update(this.wallet_information.user_info._id, {
    //             is_account_locked: this.wallet_information.is_account_locked,
    //             send_attempt:      0
    //         });

    //         res.kyc = kyc;
    //         res.is_account_locked = user_details.is_account_locked;
    //         res.status = "success";
    //     }
    //     else {
    //         res.status = "error";
    //         res.message = "Invalid Credential";
    //     }

    //     return res;
    // }

    async resetViaIdNumber() {
        let res = {};
        const email  = this.wallet_information.email;
        let kyc      = await this.mdb_kyc.findByUserId(this.wallet_information.user_info._id);
        let upperCaseIdNum = this.wallet_information.id_number.toUpperCase();
        let lastChar = kyc.id_number.endsWith(upperCaseIdNum)

        if(!lastChar) {
            res.status = "error";
            res.message = "Invalid Credential";
        }
        else if (lastChar) {
            res.status = "success";

            const numbers = "0123456789";
            const chars = "abcdefghijklmnopqrstuvwxyz";
            const chars_caps = chars.toUpperCase();
            const all_chars = numbers + chars + chars_caps;
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            function get_otp() {
                let otp = '';
                for (let i = 0; i < 50; i++) {
                    let rand = getRandomArbitrary(0, all_chars.length);
                    otp += all_chars[parseInt(rand)];
                }
                return otp;
            }
            const otp = get_otp();


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
                to: email,
                subject: 'Request Reset Security Question and Answer via ID Number',
                text: 'Requesting to Reset Security for Transaction',
                template: 'reset_security',
                context: {
                    name:  this.wallet_information.user_info.full_name,
                    email: this.wallet_information.email,
                    otp:   otp
                }
            }

            // Step 3
            transporter.sendMail(mailOptions)
                .then(function (response) {

                })
                .catch(function (error) {
                    console.log('Error: ', error);
                });

            let otp_data =
            {
                otp: otp,
                email: email,
            }

            await this.mdb_verify_otp.add(otp_data);
            res.data = otp_data;
        }

        return res;
    }

    async resetViaOTP() {
        let res = {};
        const email = this.wallet_information.user_info.email;

        const numbers = "0123456789";
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const chars_caps = chars.toUpperCase();
        const all_chars = numbers + chars + chars_caps;
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        function get_otp() {
            let otp = '';
            for (let i = 0; i < 50; i++) {
                let rand = getRandomArbitrary(0, all_chars.length);
                otp += all_chars[parseInt(rand)];
            }
            return otp;
        }
        const otp = get_otp();


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
            to: email,
            subject: 'Request Reset Security Question and Answer via OTP',
            text: 'Requesting to Reset Security for Transaction',
            template: 'reset_security',
            context: {
                name:  this.wallet_information.user_info.full_name,
                email: this.wallet_information.email,
                otp: otp
            }
        }

        // Step 3
        transporter.sendMail(mailOptions)
            .then(function (response) {

            })
            .catch(function (error) {
                console.log('Error: ', error);
            });

        res.status = 'success';

        let otp_data =
        {
            otp: otp,
            email: email,
        }

        await this.mdb_verify_otp.add(otp_data);
        res.data = otp_data;

        return res;
    }

    async updateSecurity() {
        let res = {};

        let check_otp = await this.mdb_verify_otp.findByEmailAndOtp(this.wallet_information.email, this.wallet_information.otp);

        if (check_otp) {

            let user_details = await this.mdb_user.update(this.wallet_information.user_info._id, {
                is_account_locked: this.wallet_information.is_account_locked,
                send_attempt:      0
            });

            if(this.wallet_information.security_question != "(Personalize your own question)")
            {
                let kyc = await this.mdb_kyc.findByUserIdAndUpdate(this.wallet_information.user_info._id, {
                    security_question: this.wallet_information.security_question,
                    security_answer:   this.wallet_information.security_answer
                });

                res.kyc = kyc;
                res.is_account_locked = user_details.is_account_locked;
                res.status = "success";
            }
            else if(this.wallet_information.security_question == "(Personalize your own question)")
            {
                let kyc = await this.mdb_kyc.findByUserIdAndUpdate(this.wallet_information.user_info._id, {
                    security_question: this.wallet_information.personalized_question,
                    security_answer:   this.wallet_information.security_answer
                });

                res.kyc = kyc;
                res.is_account_locked = user_details.is_account_locked;
                res.status = "success";
            }

        }
        else {
            res.status = "error";
            res.message = "Invalid Credential";
        }

        return res;
    }

    async resetDailyLimit() {
        let res = {};

        try {
            await this.mdb_user.findAllAndResetLimit();
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async getOneFee() {
        let res = {};

        try {
            res.data = await this.mdb_fee.findByFeeType(this.wallet_information.fee_type);
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async getReceiver() {
        let res = {};

        try {
            res.data = await this.mdb_user.findByPublicKey(this.wallet_information.public_key);
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async manage() {
        let res = {};

        try {
            res.data = await this.mdb_transaction.findByPendingHistory(this.wallet_information.user_id);
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async manage_deposit() {
        let res = {};

        try {
            res.data = await this.mdb_add_funds.findByPendingHistory(this.wallet_information.user_id);

            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async addHedgeFund() {
        let res = {}

        let currency = await this.mdb_currency.findByAbbreviation(this.wallet_information.abbreviation);
        let transactions = await this.mdb_wallet.findAllByAbbreviationAndUserId(this.wallet_information.abbreviation, this.wallet_information.user_id);
        let user_info = await this.mdb_user.findAllByUserId(this.wallet_information.user_id);
        let conv = await this.mdb_conversion.findByAbbreviation('USD');
        try {
            res.status = "success";

            let abbreviation = "USD"
            let amount = 0
            if (this.wallet_information.fund_type == "STERLING FUND") {
                abbreviation = "GBP"
                amount = Math.floor(this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] / conv.conversion["GBP"] * 10 ** 2);
            } else if (this.wallet_information.fund_type == "EURO FUND") {
                abbreviation = "EUR"
                amount = Math.floor(this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] / conv.conversion["EUR"] * 10 ** 2);
            } else {
                abbreviation = "USD"
                amount = Math.floor(this.wallet_information.amount * conv.conversion[this.wallet_information.abbreviation] / conv.conversion["USD"] * 10 ** 2);
            }

            let add_hedge_fund =
            {
                user_id: this.wallet_information.user_id,
                full_name: this.wallet_information.full_name,
                currency_abbreviation: abbreviation,
                amount: amount,
                status: "pending",
                decimal_places: currency.decimal_places,
                date_created: this.wallet_information.date_created,
                timestamp_created_at: this.wallet_information.date_created,
                fund_type: this.wallet_information.fund_type
            };

            // this.wallet_information.user_info

            let updated_balance = transactions.balance - Math.floor(this.wallet_information.amount * 10 ** currency.decimal_places)
            let index = user_info.wallet_address.indexOf(transactions.public_key);
            user_info.wallet[index].balance = updated_balance;
            // user_info.hedge_fund.push(add_hedge_fund);
            let is_existing = await this.mdb_hedge_fund.findByUserIdAndFundType(this.wallet_information.user_id, this.wallet_information.fund_type)


            if (this.wallet_information.amount >= 200000 &&
                this.wallet_information.abbreviation.length != 0 &&
                updated_balance >= 0 &&
                !is_existing) {

                await this.mdb_hedge_fund.add(add_hedge_fund);
                await this.mdb_user.update(user_info._id, {
                    wallet:     user_info.wallet,
                    // hedge_fund: user_info.hedge_fund
                })
                await this.mdb_wallet.update(transactions._id, { balance: updated_balance })

                    // ----------------------------
                    let notification_data =
                    {
                        user_id: user_info._id,
                        message: "Send External!",
                        date_created: Date(),
                        date_opened: "",
                    }
                    let notification = new NotificationClass(notification_data);
                    let notification_class = await notification.createNotification();
                    // ----------------------------

                res.amount = add_hedge_fund.amount;
                res.user_id = add_hedge_fund.user_id;

            } else if (is_existing) {
                res.status = "error";
                res.message = "Existing";
            } else if (updated_balance < 0) {
                res.status = "error";
                res.message = "Insufficient";
            } else if (this.wallet_information.amount < 200000) {
                res.status = "error";
                res.message = "Min 225000";
            } else {
                res.status = "error";
                res.message = "Invalid input";

            }
            return res;
        }
        catch (error) {
            let res = {}
            res.status = "error";
            res.message = error.message;

            return res;
        }
    }

    async getHedgeFundList() {
        let res = {}

        let hedge_fund_logs = await this.mdb_hedge_fund.findByUserId(this.wallet_information.user_id);


        try {
            res.status = "success";
            res.data = hedge_fund_logs;
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async errorSend() {
        let res = {};

        try {
            let sender = await this.mdb_user.doc(this.wallet_information.user_info._id)
            res.data = await this.mdb_user.update(this.wallet_information.user_info._id, { send_attempt: sender.send_attempt + 1 });
            res.status = "success";
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async stageTransaction() {
        let res = {};

        try {
            let sleep = (ms) => {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await sleep(Number(String(Date.now()).slice(-2)) * 50);

            let transaction = await this.mdb_staging_transaction.findByUserId(this.wallet_information.user_id)
            if (!transaction) {
                res.status = "success";
                this.mdb_staging_transaction.add({ user_id: this.wallet_information.user_info._id, date_created: this.wallet_information.date_created });
            }
            else {
                res.status = "error";
                res.message = "Transaction Error. Please Try Again."
            }
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }
    async addHedgeFund2() {
        let res = {}

        let conv = await this.mdb_conversion.findByAbbreviation('USD');
        let is_existing = await this.mdb_hedge_fund.findByUserIdAndFundType(this.wallet_information.user_id, this.wallet_information.fund_type)

        try {

            if (this.wallet_information.amount >= 200000 &&
                this.wallet_information.abbreviation.length != 0 &&
                !is_existing) {
                let currencies = Object.keys(this.wallet_information.indiv_amount);
                let abbreviation = "USD"
                let amount = 0

                if (this.wallet_information.fund_type == "STERLING FUND")
                {
                    abbreviation = "GBP"
                    amount = Math.floor(this.wallet_information.amount / conv.conversion["GBP"] * 10 ** 2);
                }
                else if (this.wallet_information.fund_type == "EURO FUND")
                {
                    abbreviation = "EUR"
                    amount = Math.floor(this.wallet_information.amount / conv.conversion["EUR"] * 10 ** 2);
                }
                else
                {
                    abbreviation = "USD"
                    amount = Math.floor(this.wallet_information.amount * 10 ** 2);
                }

                let add_hedge_fund =
                {
                    user_id: this.wallet_information.user_id,
                    full_name: this.wallet_information.full_name,
                    currency_abbreviation: abbreviation,
                    amount: amount,
                    status: "pending",
                    decimal_places: 2,
                    date_created: this.wallet_information.date_created,
                    fund_type: this.wallet_information.fund_type
                };

                for (let i = 0; i < currencies.length; i++) {
                    let user_info = await this.mdb_user.findAllByUserId(this.wallet_information.user_id);
                    let transactions = await this.mdb_wallet.findAllByAbbreviationAndUserId(currencies[i], this.wallet_information.user_id);
                    let indiv_amount = Math.floor(this.wallet_information.indiv_amount[currencies[i]] / conv.conversion[currencies[i]] * 10 ** transactions.decimal_places)
                    let updated_balance = transactions.balance - indiv_amount;

                    let index = user_info.wallet_address.indexOf(transactions.public_key);
                    user_info.wallet[index].balance = updated_balance;

                    if (updated_balance >= 0) {
                        let add_staging_hedge =
                        {
                            user_id: this.wallet_information.user_id,
                            fund_type: this.wallet_information.fund_type,
                            amount: indiv_amount,
                            currency_abbreviation: transactions.currency_abbreviation
                        };
                        await this.mdb_staging_hedge_fund.add(add_staging_hedge);
                        await this.mdb_wallet.update(transactions._id, { balance: updated_balance })
                        await this.mdb_user.update(user_info._id, {
                            wallet:     user_info.wallet,
                            hedge_fund: user_info.hedge_fund
                        })

                    } else {
                        res.status = "error";
                        res.message = "Insufficient balance";
                        await this.returnHedgeFund(this.wallet_information.user_id, this.wallet_information.fund_type);
                        return res;
                    }
                }

                // NOTIFY ADMIN AND SENDER

                let email_receiver = `lexiconbank2020@gmail.com; ${this.wallet_information.email};`


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
                    template: 'hedge_fund',
                    context: {

                        amount: (amount / 10 ** 2).toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        }),
                        currency: abbreviation,
                        full_name: this.wallet_information.full_name,
                        fund_type: this.wallet_information.fund_type,
                        date_time: `${moment(this.wallet_information.date_created).format('DD-MMM-YYYY')} ${new Date(this.wallet_information.date_created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
                        status: "Pending"
                    }
                }

                // Step 3
                transporter.sendMail(mailOptions)
                    .then(function (response) {

                    })
                    .catch(function (error) {
                        console.log('Error: ', error);
                    });


                await this.mdb_hedge_fund.add(add_hedge_fund);

                res.status = "success";
                res.amount = add_hedge_fund.amount;
                res.user_id = add_hedge_fund.user_id;

            } else if (is_existing) {
                res.status = "error";
                res.message = "Existing";
            } else if (this.wallet_information.amount < 200000) {
                res.status = "error";
                res.message = "Min 225000";
            } else {
                res.status = "error";
                res.message = "Invalid input";

            }
            return res;
        }
        catch (error) {
            let res = {}
            res.status = "error";
            res.message = error.message;

            return res;
        }
    }

    async returnHedgeFund(user_id, fund_type)
    {
        let hedge_fund = await this.mdb_staging_hedge_fund.findByUserIdAndFundType(user_id, fund_type);

        for(let i=0; i < hedge_fund.length; i++)
        {
            let user_info = await this.mdb_user.findAllByUserId(user_id);
            let wallet = await this.mdb_wallet.findAllByAbbreviationAndUserId(hedge_fund[i].currency_abbreviation, hedge_fund[i].user_id);
            let updated_balance = wallet.balance + hedge_fund[i].amount;

            let index = user_info.wallet_address.indexOf(wallet.public_key);
            user_info.wallet[index].balance = updated_balance;

            await this.mdb_wallet.update(wallet._id, { balance: updated_balance });
            await this.mdb_user.update(user_info._id, { wallet: user_info.wallet });
        }
    }

    async getHedgeFundList() {
        let res = {}

        let hedge_fund_logs = await this.mdb_hedge_fund.findByUserId(this.wallet_information.user_id);


        try {
            res.status = "success";
            res.data = hedge_fund_logs;
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async getClientTransactionReports() {
        let res = {}
        try {
            res.status = 'success'

            let filters = this.wallet_information;

            if (filters.hasOwnProperty('last_defined_date_range')) 
            {
                let server_date = ServerClass.get_date();
                filters.date_from = moment(server_date).subtract(filters.last_defined_date_range, 'days');
                filters.date_to = moment(server_date);
                delete filters.last_defined_date_range;
            } 
            else 
            {
                filters.date_from = new Date(filters.date_from);
                filters.date_to = new Date(filters.date_to);
                filters.date_from = moment(filters.date_from);
                filters.date_to = moment(filters.date_to);
            }

            filters.date_from_timestamp = moment(filters.date_from.hours(0).minutes(0).seconds(0).milliseconds(0)).format('x')
            filters.date_to_timestamp   = moment(filters.date_to.hours(23).minutes(59).seconds(59).milliseconds(999)).format('x')

            if (filters.transaction_type == 'All') 
            {
                delete filters.transaction_type
            } 
            else 
            {
                filters.transaction_type = filters.transaction_type.toLowerCase()
            }

            if (filters.currency == 'All') 
            {
                delete filters.currency
            } 
            else 
            {
                filters.currency = filters.currency.toUpperCase()
            }

            if (filters.transaction_type == 'hedge') 
            {
                delete filters.transaction_type;
                res.data = await this.mdb_hedge_fund.getClientReportsIn(filters);
            } 
            else 
            {
                res.data = await this.mdb_transaction.getClientReportsIn(filters);
            }

            return res;
        } catch (error) {
            console.log(error)
            res.message = error
            res.status = 'error'
            return res
        }
    }
}
