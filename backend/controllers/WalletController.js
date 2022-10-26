const WalletClass = require('../classess/WalletClass');
const CurrencyClass = require('../classess/CurrencyClass');
const AccountClass = require('../classess/AccountClass');
const moment = require('moment-timezone');

module.exports =
{
    async createWallet(req, res) {
        let details = {
            user_info: req.user_info,
            abbreviation: req.body.currency
        }
        let currency_class = new CurrencyClass(details);
        let number_code = await currency_class.getNumberCode();

        if (number_code) {
            details.number_code = number_code.data.number_code;
            let wallet_class = new WalletClass(details);
            let wallet = await wallet_class.generate();

            if (wallet.status == "success") {
                res.send({ message: wallet.status });
            }
            else {
                res.status(400).send({ message: wallet.message });
            }
        }
        else {
            console.log('error')
        }
    },

    async sendCurrencyInternal(req, res) {
        let transaction_details = {
            user_info:              req.user_info,                // get user info of sender
            password:               req.body.password,
            security_question:      req.body.security_question,
            security_answer:        req.body.security_answer,
            receiver_public_key:    req.body.receiver_public_key, // get user info of receiver (receiver_id)
            abbreviation:           req.body.abbreviation,        // get currency_id
            amount:                 req.body.amount,
            remarks:                req.body.remarks,
            date_created:           Date.now()
        }

        let wallet_class = new WalletClass(transaction_details);

        // let sleep = (ms) => {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // await sleep(Number(String(Date.now()).slice(-2)) * 10);

        let stage_transaction = await wallet_class.stageTransaction();
        if (stage_transaction.status == 'success') {
            let internal_send = await wallet_class.sendInternal();

            if (internal_send.status == "success") {
                res.send(internal_send.data);
            }
            else {
                res.status(400).send({ message: internal_send.message });
            }
        }
        else {
            res.status(400).send({ message: stage_transaction.message });
        }
    },

    async sendCurrencyExternal(req, res) {
        let transaction_details = {
            user_info: req.user_info, // get user info of sender
            abbreviation: req.body.abbreviation, // get currency_id
            amount: req.body.amount,
            bank: req.body.bank,
            account_name: req.body.account_name,
            account_number: req.body.account_number,
            remarks: req.body.remarks,
            password: req.body.password,
            security_question: req.body.security_question,
            security_answer: req.body.security_answer,
            date_created: Date.now(),
        }

        let wallet_class = new WalletClass(transaction_details);

        // if(stage_transaction.status == 'success')
        // {
            let external_send = await wallet_class.sendExternal();

            if (external_send.status == "success") {
                res.send(external_send.data);
            }
            else
            {
                res.status(400).send({ message: external_send.message });
            }
        // }
        // else
        // {
        //     res.status(400).send({ message: stage_transaction.message });
        // }
    },

    async transactionHistory(req, res) {
        let history =
        {
            user_id:        req.user_info._id,
            abbreviation:   req.body.abbreviation,
            skip:           req.body.skip,
        }

        let wallet_class = new WalletClass(history);
        let transaction_logs = await wallet_class.history();

        if (transaction_logs.status == "success") {
            res.send(transaction_logs.data);
        }
        else {
            res.status(400).send({ message: transaction_logs.message })
        }
    },

    async viewWalletBalance(req, res) {
        let abbreviation = req.body.abbreviation;
        let user_id = req.user_info._id;

        let wallet_class = new WalletClass({ abbreviation: abbreviation, user_id: user_id });
        let currency_balance = await wallet_class.viewBalance();

        if (currency_balance.status == "success") {
            res.send({ balance: currency_balance.data, decimal: currency_balance.decimal, is_account_locked: currency_balance.is_account_locked, conversion: currency_balance.conversion });
        }
        else {
            res.status(400).send({ message: currency_balance.message });
        }
    },

    async viewBalanceOptions(req, res) {

        let user_id = req.user_info._id;

        let wallet_class = new WalletClass({ user_id: user_id });
        let account_info = await wallet_class.viewBalance2();

        if (account_info.status == "success") {
            res.send({
                wallet: account_info.data,
                is_account_locked: account_info.is_account_locked,
                conversion: account_info.conversion,
                send_attempt: account_info.send_attempt,
                kyc_status: account_info.kyc_status
            });
        }
        else {
            res.status(400).send({ message: account_info.message });
        }
    },

    async getSecurityQuestion(req, res) {
        let user_id = req.user_info._id;

        let wallet_class = new WalletClass({ user_id: user_id });
        let security_question = await wallet_class.userQuestion();

        if (security_question.status == "success") {
            res.send(security_question.data.security_question);
        }
        else {
            res.status(400).send({ message: security_question.message });
        }
    },

    //manual add fund
    async manualAddFunds(req, res) {
        let user_id = req.body.user_id;
        let full_name = req.body.full_name;
        let amount = req.body.amount;
        let remarks = req.body.remarks;
        let date_created = Date.now()
        let abbreviation = req.body.abbreviation;
        let amount_fee = req.body.amount_fee

        let wallet_class = new WalletClass({
            user_id: user_id,
            full_name: full_name,
            abbreviation: abbreviation,
            amount: amount,
            remarks: remarks,
            date_created: date_created,

        });

        let transaction = await wallet_class.addMoney()

        if (transaction.status == "success") {
            res.send({ message: transaction.status });
        }
        else {
            res.send({ message: transaction.message });
        }
    },

    async getCurrentDeposit(req, res)
    {
        let user_id = req.body.user_id;
        let wallet_class = new WalletClass({ user_id: user_id });
        let transaction = await wallet_class.getCurrentDeposit();

        if (transaction.status == "success")
        {
            res.send(transaction.data);
        }
        else
        {
            res.send({ message: transaction.message });
        }
    },

    //update status to cancel
    async updateStatus(req, res) {
        let user_info =  req.user_info;
        let order_number = req.body.order_number;

        let wallet_class = new WalletClass({
            user_info: user_info,
            order_number: order_number,
            date_created: Date.now()
        });

        let updateStats = await wallet_class.updateStatus()

        if (updateStats.status == "success")
        {
            res.send({ message: updateStats.status })
        }
        else
        {
            res.status(400).send({ message: updateStats.message })
        }
    },

    async member_updateStatus(req, res) {
        let user_info =  req.user_info;
        let order_number = req.body.order_number;

        let wallet_class = new WalletClass({
            user_info: user_info,
            order_number: order_number
        });

        let updateStats = await wallet_class.updateStatus()

        if (updateStats.status == "success")
        {
            res.send({ message: updateStats.status })
        }
        else
        {
            res.status(400).send({ message: updateStats.message })
        }
    },


    async addFundHistory(req, res) {
        let user_id = req.user_info._id;
        // let abbreviation = req.body.abbreviation;
        let skip = req.body.skip;

        let wallet_class = new WalletClass({ user_id: user_id, skip: skip });

        let transaction_logs = await wallet_class.getAddFundHistory();

        if (transaction_logs.status == "success") {
            res.send(transaction_logs.data);
        }
        else {
            res.status(400).send({ message: transaction_logs.message })
        }
    },

    async uploadDeposit(req, res) {
        let id = req.body.id

        let deposit_slip_path = "transactions/" + req.file.filename;

        let wallet_class = new WalletClass({ deposit_slip_path: deposit_slip_path, id: id });

        let transaction_logs = await wallet_class.updateDepositSlip();

        if (transaction_logs.status == "success") {
            res.send(transaction_logs.data);
        }
        else {
            res.status(400).send({ message: transaction_logs.message })
        }
    },

    async sendAttemptReached(req, res) {
        let user_id = req.user_info._id;
        let is_account_locked = req.body.is_account_locked;

        let wallet_class = new WalletClass({ user_id: user_id, is_account_locked: is_account_locked });
        let send_attempt = await wallet_class.attempt();

        if (send_attempt.status == "success") {
            res.send({ message: send_attempt.status });
        }
        else {
            res.status(400).send({ message: send_attempt.message });
        }
    },

    async verifyInternalDetails(req, res) {
        let user_details = {
            user_info:              req.user_info,
            receiver_public_key:    req.body.receiver_public_key, // get user info of receiver (receiver_id)
            abbreviation:           req.body.abbreviation, // get currency_id
            amount:                 req.body.amount,
        }

        let wallet_class = new WalletClass(user_details);
        let receiver     = await wallet_class.verifyInternal();

        if (receiver.status == "success") {
            res.send({ message: receiver.status });
        }
        else {
            res.status(400).json({ message: receiver.message });
        }
    },

    async verifyExternalDetails(req, res) {
        let user_details = {
            user_info:              req.user_info,
            receiver_public_key:    req.body.receiver_public_key, // get user info of receiver (receiver_id)
            abbreviation:           req.body.abbreviation, // get currency_id
            amount:                 req.body.amount,
        }

        let wallet_class = new WalletClass(user_details);
        let receiver     = await wallet_class.verifyExternal();

        if (receiver.status == "success") {
            res.send({ message: receiver.status });
        }
        else {
            res.status(400).send({ message: receiver.message });
        }
    },

    async accountLocked(req, res) {
        let user_info = req.user_info;
        let id_number = req.body.id_number;

        let wallet_class = new WalletClass({ user_info: user_info, id_number: id_number });
        let user = await wallet_class.locked();

        if (user.status == "success") {
            res.send({ message: user.status });
        }
        else {
            res.status(400).send({ message: user.message });
        }
    },

    async convertCurrency(req, res) {
        let conversion_details =
        {
            user_info:      req.user_info,
            from_currency:  req.body.from_currency,
            to_currency:    req.body.to_currency,
            amount:         req.body.amount,
            date_created:   Date.now(),
        };


        let wallet_class = new WalletClass(conversion_details);
        let conversion = await wallet_class.convert();

        if (conversion.status == "success") {
            res.send({ message: conversion.status, date: conversion_details.date_created  });
        }
        else {
            res.status(400).send({ message: conversion.message });
        }
    },

    async requestEmail(req, res) {
        let user_information = {
            user_info: req.user_info,
            email:     req.user_info.email,
            id_number: req.body.id_number
        }

        let account_class = new AccountClass(user_information);
        let findEmail = await account_class.findEmail();

        if (findEmail.status == "success") {
            let wallet_class = new WalletClass(user_information);
            let sendEmail = await wallet_class.resetViaIdNumber();

            if (sendEmail.status == "success") {
                res.status(200).send(sendEmail.data);
            }
            else {
                res.status(400).send({ message: sendEmail.message });
            }
        }
        else if (findEmail.status == "error") {
            res.status(400).send({ message: findEmail.message });
        }
    },

    async requestOTP(req, res) {
        let user_details = {
            user_info: req.user_info,
            otp: req.body.code,
            email: req.user_info.email,
        }

        let account_class = new AccountClass(user_details);
        let checkIfExpired = await account_class.validate_otp();

        if (checkIfExpired.status == "error") {
            res.status(400).send({ message: checkIfExpired.message });
        }
        else if (checkIfExpired.status == "success") {
            let wallet_class = new WalletClass(user_details);
            let sendResetEmail = await wallet_class.resetViaOTP();

            if (sendResetEmail.status == "success") {
                res.send(sendResetEmail.data);
            }
            else {
                res.status(400).send({ message: sendResetEmail.message });
            }
        }
    },

    async resetSecurity(req, res) {
        let user_information = {
            user_info:          req.user_info,
            email:              req.body.email,
            otp:                req.body.otp,
            security_question:  req.body.security_question,
            security_answer:    req.body.security_answer,
            is_account_locked:  req.body.is_account_locked
        }

        let wallet_class = new WalletClass(user_information);
        let user_details = await wallet_class.updateSecurity();

        if (user_details.status == "success") {
            res.send({ message: user_details.status, is_account_locked: user_details.is_account_locked, kyc: user_details.kyc });
        }
        else {
            res.status(400).send(user_details.message);
        }
    },

    async viewOneFee(req, res) {

        let fee_type = req.body.fee_type;
        let wallet_class = new WalletClass({ fee_type: fee_type });
        let get_fee = await wallet_class.getOneFee();

        if (get_fee.status == "success") {
            res.send(get_fee.data);
        }
        else {
            res.status(400).send({ message: get_fee.message });
        }
    },

    async viewReceiver(req, res) {
        let public_key = req.body.public_key;
        let wallet_class = new WalletClass({ public_key: public_key });
        let get_receiver = await wallet_class.getReceiver();

        if (get_receiver.status == "success") {
            res.send(get_receiver.data);
        }
        else {
            res.status(400).send({ message: get_receiver.message });
        }
    },

    async externalTransactions(req, res) {
        let details =
        {
            user_id: req.user_info._id,
        }

        let wallet_class = new WalletClass(details);
        let transaction = await wallet_class.manage();
        if (transaction.status == "success") {
            res.send(transaction.data);
        }
        else {
            res.status(400).send({ message: transaction.message });
        }
    },

    async manage_deposit(req, res) {
        let details =
        {
            user_id: req.user_info._id,
        }

        let wallet_class = new WalletClass(details);
        let transaction = await wallet_class.manage_deposit();

        if (transaction.status == "success") {
            res.send(transaction.data);
        }
        else {
            res.status(400).send({ message: transaction.message });
        }
    },

    async hedge_fund(req, res) {

        let user_id = req.body.user_id;
        let full_name = req.body.full_name;
        let amount = req.body.amount;
        let abbreviation = req.body.abbreviation;
        let fund_type = req.body.fund_type
        let date_created = Date.now()


        let wallet_class = new WalletClass({
            user_id: user_id,
            full_name: full_name,
            abbreviation: abbreviation,
            amount: amount,
            date_created: date_created,
            fund_type: fund_type
        });

        let transaction = await wallet_class.addHedgeFund()

        if (transaction.status == "success") {
            res.status(200).send({ message: transaction.status });
        }
        else {

            res.status(400).send({ message: transaction.message });
        }

    },
    async hedge_fund_list(req, res) {

        let user_id = req.body.user_id;


        let wallet_class = new WalletClass({ user_id: user_id });

        let hedge_fund_logs = await wallet_class.getHedgeFundList();

        if (hedge_fund_logs.status == "success") {
            res.send(hedge_fund_logs.data);
        }
        else {
            res.status(400).send({ message: hedge_fund_logs.message })
        }
    },
    async sendErrorCounter(req, res) {
        let details =
        {
            user_info:    req.user_info,
            send_attempt: req.body.send_attempt,
        }

        let wallet_class = new WalletClass(details);
        let sender = await wallet_class.errorSend();

        if (sender.status == "success") {
            res.send({ send_attempt: sender.data.send_attempt });
        }
        else {
            res.status(400).send({ message: sender.message });
        }
    },

    async generateOtp(req, res) {
        let user_information =
        {
            user_info: req.user_info
        }

        let wallet_class = new WalletClass(user_information);
        let result = await wallet_class.generateOTP();

        if (result.status == "success") {
            res.send(result.message);
        }
        else {
            res.status(400).send({ message: result.message });
        }
    },

    async hedge_fund_2(req, res) {

        let user_id = req.user_info._id;
        let email = req.user_info.email;
        let full_name = req.user_info.full_name;
        let amount = req.body.amount;
        let abbreviation = req.body.abbreviation;
        let fund_type = req.body.fund_type
        let indiv_amount = req.body.indiv_amount
        let date_created = Date.now()

        let wallet_class = new WalletClass({
            user_id: user_id,
            email: email,
            full_name: full_name,
            abbreviation: abbreviation,
            indiv_amount: indiv_amount,
            amount: amount,
            date_created: date_created,
            fund_type: fund_type
        });

        let transaction = await wallet_class.addHedgeFund2()


        if (transaction.status == "success") {
            res.send({ message: transaction.status });
        }
        else {

            res.status(400).send({ message: transaction.message });
        }

    },
    async hedge_fund_list(req, res) {


        let user_id = req.body.user_id;


        let wallet_class = new WalletClass({ user_id: user_id });

        let hedge_fund_logs = await wallet_class.getHedgeFundList();

        if (hedge_fund_logs.status == "success") {
            res.send(hedge_fund_logs.data);
        }
        else {
            res.status(400).send({ message: hedge_fund_logs.message })
        }
    },

    async getClientTransactionReports(req, res) {
        let report_filters = req.body;
        console.log('from:', report_filters.date_from)
        console.log('to:', report_filters.date_to)
        report_filters.user_id = req.user_info._id;

        let wallet_class = new WalletClass(report_filters);
        let result = await wallet_class.getClientTransactionReports();
        if (result.status == 'success') {
            res.status(200).json({ status: result.status, data: result.data })
        } else if (res.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }
    }
}