const WalletClass = require('../classess/WalletClass');
const AdminClass = require('../classess/AdminClass')
const AccountClass = require('../classess/AccountClass')
const MemberClass = require('../classess/MemberClass')
const CurrencyClass = require('../classess/CurrencyClass');

module.exports =
{
    async addCurrency(req, res) {
        let currency_information =
        {
            is_fiat: req.body.is_fiat,
            number_code: req.body.number_code,
            abbreviation: req.body.abbreviation,
            name: req.body.name,
            decimal_places: req.body.decimal_places
        }

        let currency_class = new CurrencyClass(currency_information);
        let currency_creation = await currency_class.createCurrency();

        if (currency_creation.status == "error") {
            res.status(400).send({ message: currency_creation.message });
        }
        else {
            res.send({ message: currency_creation.status })
        }
    },
    async updateMemberKyc(req, res) {
        let user_data = {
            user_info: req.user_info,
            status: req.body.status,
            user_id: req.body.user_id,
            date_created: Date.now()
        }

        if (req.body.hasOwnProperty('remarks')) {
            user_data.remarks = req.body.remarks
        }

        let admin_class = new AdminClass(user_data);
        let result = await admin_class.updateMemberKyc();

        if (result.status == 'success') {
            res.status(200).json({ status: result.status, data: result.data });
        } else if (result.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }

    },

    async viewAllAddFund(req, res) {
        if(req.body.from != undefined && req.body.to != undefined)
        {
            date = 
            {
                from: req.body.from,
                to: req.body.to
            };
            console.log(date);
        }
        else
        {
            date = null;
        }
        const account = new AdminClass(date);
        const account_data = await account.getAllAddFund();

        if (account_data.status = "success") {
            console.log('account_data.data')
            console.log(account_data.data)
            res.json(account_data.data).status(200);
        } else {
            res.json(account_data.message).status(400);
        }
    },

    async viewAllAddFundsTransactions(req, res) {

        const account = new WalletClass();
        const account_data = await account.getAllAddFundTransactions();

        if (account_data.status = "success") {
            res.json(account_data.data).status(200);
        } else {
            res.json(account_data.message).status(400);
        }
    },

    async updateStatusApprove(req, res) {

        let user_info = req.user_info
        let user_id = req.body.user_id
        let orderNumber = req.body.orderNumber
        let currency_abbreviation = req.body.currency_abbreviation
        let amount = req.body.amount
        let decimal_places = req.body.decimal_places
        let status = req.body.status

        let wallet_class = new WalletClass({
            user_info: user_info,
            user_id: user_id,
            orderNumber: orderNumber,
            currency_abbreviation: currency_abbreviation,
            amount: Number(amount),
            decimal_places: decimal_places,
            status: status,
            date_created: Date.now()
        });

        let updateStats = await wallet_class.updateAdminAddFundHistory()

        if (updateStats.status == "success")
        {
            res.send({ message: updateStats.status })
        }
        else
        {
            res.status(400).send({ message: updateStats.message })
        }
    },

    async getKyc(req, res) {
        const account = new AdminClass();
        const account_data = await account.getAllKyc();

        if (account_data.status = "success") {
            res.status(200).json({ status: result.status, data: result.data });
        } else if (result.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }

    },

    async getKycByStatus(req, res) {

        let kyc = {
            status: req.body.status
        }

        let admin_class = new AdminClass(kyc);
        let result = await admin_class.getKycByStatus();

        if (result.status == 'success') {
            res.status(200).json({ status: result.status, data: result.data });
        } else if (result.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }

    },

    async deleteAllUserInfo(req, res) {
        let admin_class = new AdminClass();
        let result = await admin_class.deleteAllUserInfo();

        if (result.status == 'success') {
            res.status(200).json({ status: result.status, data: result.data });
        } else if (result.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }
    },

    async addFee(req, res) {
        let fee =
        {
            user_info: req.user_info,
            fee_type: req.body.fee_type,
            is_enabled: req.body.is_enabled,
            charge_type: req.body.charge_type,
            value: req.body.value,
            date_created: Date.now()
        }

        let admin_class = new AdminClass(fee);
        let create_fee = await admin_class.createFee();

        if (create_fee.status == "error") {
            res.status(400).send({ message: create_fee.message });
        }
        else {
            res.send({ message: create_fee.status })
        }
    },

    async updateFee(req, res) {
        let fee =
        {
            user_info: req.user_info,
            fee_type: req.body.fee_type,
            is_enabled: req.body.is_enabled,
            charge_type: req.body.charge_type,
            value: req.body.value,
            date_created: Date.now()
        }

        let admin_class = new AdminClass(fee);
        let set_fee = await admin_class.setFee();

        if (set_fee.status == "error") {
            res.status(400).send({ message: set_fee.message });
        }
        else {
            res.send({ message: set_fee.status })
        }
    },

    async viewDefaultFees(req, res) {
        let admin_class = new AdminClass();
        let get_fee = await admin_class.getFee();

        if (get_fee.status == "error") {
            res.status(400).send({ message: get_fee.message });
        }
        else {
            res.send(get_fee.data);
        }
    },

    async viewConversionFrequency(req, res) {
        let admin_class = new AdminClass();
        let get_frequency = await admin_class.getFrequency();

        if (get_frequency.status == "error") {
            res.status(400).send({ message: get_frequency.message });
        }
        else {
            res.send(get_frequency.data);
        }
    },

    async viewCurrencies(req, res) {
        let admin_class = new AdminClass();
        let get_currencies = await admin_class.getCurrencies();

        if (get_currencies.status == "error") {
            res.status(400).send({ message: get_currencies.message });
        }
        else {
            res.send(get_currencies.data);
        }
    },

    async getExternalTransaction(req, res) {
        const transaction = new AdminClass();
        const result = await transaction.getAllExternalTxn();

        if (result.status == "success") {
            res.status(200).json({ status: result.status, data: result.data });
        }
        else if (result.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }
    },

    async approveExternalTxn(req, res) {
        let transaction_info = {
            user_info: req.user_info,
            email: req.body.email,
            reference_number: req.body.reference_number,
            date_created: Date.now(),
        }

        let account_class = new AccountClass(transaction_info);
        let findEmail = await account_class.findEmail();

        if (findEmail.status == "success") {
            let admin_class = new AdminClass(transaction_info);
            let transaction = await admin_class.approveTxnStatus();

            if (transaction.status == "success") {
                res.send(transaction.status);
            }
            else {
                res.status(400).send(transaction.message);
            }
        }
        else if (findEmail.status == "error") {
            res.status(400).send({ message: findEmail.message });
        }
    },

    async cancelExternalTxn(req, res) {
        let transaction_info = {
            user_info: req.user_info,
            email: req.body.email,
            reference_number: req.body.reference_number,
            date_created: Date.now(),
        }
        let account_class = new AccountClass(transaction_info);
        let findEmail = await account_class.findEmail();
        if (findEmail.status == "success") {
            let admin_class = new AdminClass(transaction_info);
            let transaction = await admin_class.cancelTxnStatus();

            if (transaction.status == "success") {
                res.send({ user: transaction.user, wallet: transaction.wallet, data: transaction.data });
            }
            else {
                res.status(400).send(transaction.message);
            }
        }
        else if (findEmail.status == "error") {
            res.status(400).send({ message: findEmail.message });
        }
    },

    // async cancelExternalTxn(req, res) {
    //     let transaction_info = {
    //         user_info: req.user_info,
    //         email: req.body.email,
    //         reference_number: req.body.reference_number
    //     }
    //
    //     let account_class = new AccountClass(transaction_info);
    //     let findEmail = await account_class.findEmail();
    //
    //     if (findEmail.status == "success") {
    //         let admin_class = new AdminClass(transaction_info);
    //         let transaction = await admin_class.cancelTxnStatus();
    //
    //         if (transaction.status == "success") {
    //             res.send({ user: transaction.user, wallet: transaction.wallet, data: transaction.data });
    //         }
    //         else {
    //             res.status(400).send(transaction.message);
    //         }
    //     }
    //     else if (findEmail.status == "error") {
    //         res.status(400).send({ message: findEmail.message });
    //     }
    // },


    // =============================================================
    // Role and User Account
    // Contributor: AAD
    // =============================================================

    async updateRole(req, res) {
        let roleList = {
            user_info: req.user_info,
            role_ID: req.body.role_ID,
            role_restrictions: req.body.restrictions,
            role_name: req.body.newRole,
            role_description: req.body.description,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(roleList);
        const admin_data = await admin_class.updateRole();

        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async getuserlist(req, res) {
        const admin_class = new AdminClass();
        const admin_data = await admin_class.getuserlist();


        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async getAllUserList(req, res) {
        const admin_class = new AdminClass();
        const admin_data = await admin_class.getalluserlist();


        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async setUserRole(req, res) {
        let userList = {
            user_info: req.user_info,
            user_id: req.body.user_id,
            user_email: req.body.user_email,
            user_fullname: req.body.user_fullname,
            user_role: req.body.user_role,
            user_restrictions: req.body.user_restrictions,
            date_created: Date.now()
        }


        const admin_class = new AdminClass(userList);
        const admin_data = await admin_class.setUserRole();

        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async addUser(req, res) {

        let userList = {
            user_info: req.user_info,
            user_fullname: req.body.full_name,
            user_email: req.body.email,
            user_country: req.body.country,
            user_contact: req.body.contact,
            user_password: req.body.password,
            user_role: req.body.select_role,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(userList);
        const admin_data = await admin_class.createUser();

        if (admin_data.status == 'success') {
            res.status(200).send({ message: admin_data.status })
        }
        else {
            res.status(400).send({ message: admin_data.message })
        }
    },

    async verifyAdmin(req, res) {
        let admin_credential =
        {
            user_info: req.user_info,
            email: req.body.email,
            password: req.body.password,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(admin_credential);
        const admin_data = await admin_class.verifyAdmin();


        if (admin_data.status == 'success') {
            res.send(admin_data.data);
        }
        else {
            res.status(400).send({ message: admin_data.message });
        }
    },

    async removeUser(req, res) {
        let userInfo = {
            user_info: req.user_info,
            user_id: req.body.user_id,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(userInfo);
        const admin_data = await admin_class.delUser();

        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async addRole(req, res) {

        let role_info = {
            user_info: req.user_info,
            role_name: req.body.newRole,
            permissions: req.body.restrictions,
            description: req.body.description,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(role_info);
        const admin_data = await admin_class.createRole();

        if (admin_data.status == 'success') {
            res.status(200).send({ message: admin_data.status })
        }
        else {
            res.status(400).send({ message: admin_data.message })
        }
    },

    async getRole(req, res) {
        const admin_class = new AdminClass();
        const admin_data = await admin_class.getrolelist();



        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);

        }
        else {
            res.json(admin_data.message).status(400);
        }

    },

    async removeRole(req, res) {
        let roleID = {
            user_info: req.user_info,
            role_id: req.body.role_ID,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(roleID);
        const admin_data = await admin_class.delRole();

        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async postCreateAccount(req, res) {
        let userinfo = {
            user_info: req.user_info, // admin infos
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            full_name: req.body.full_name,
            birthdate: req.body.birthdate,
            nationality: req.body.nationality,
            gender: req.body.gender,
            house_number: req.body.house_number,
            street_address: req.body.street_address,
            city: req.body.city,
            postal_code: req.body.postal_code,
            email: req.body.email,
            contact_code: req.body.contact_code,
            mobile_number: req.body.mobile_number,
            country: req.body.country,
            date_created: Date.now()
        }

        const admin_class = new AdminClass(userinfo);
        const admin_data = await admin_class.postCreateAccount();
        if (admin_data.status == "success") {
            res.status(200).json({ status: admin_data.status, data: admin_data.data });
        }
        else if (admin_data.status == 'error') {
            res.status(400).json({ status: admin_data.error, message: admin_data.message });
        }
    },

   async getUserByID(req, res) {
        let userInfo = {
            userID: req.body.id,
        }
        const admin_class = new AdminClass(userInfo);
        const admin_data = await admin_class.getUserByID();

        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.json(admin_data.message).status(400);
        }
    },

    async verifyExternalTxn(req, res) {
        let admin_info = {
            user_info:        req.user_info,
            reference_number: req.body.reference_number,
            date_created:     Date.now()
        }

        let admin_class = new AdminClass(admin_info);
        let result = await admin_class.verifyTxnStatus();

        if (result.status == "success") {
            res.send(result.status);
        }
        else {
            res.status(400).send(result.message);
        }
    },

    async verifiedAccount(req, res){
        let userInfo = {
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password,
        }

        const admin_class = new AdminClass(userInfo);
        const admin_data = await admin_class.setUserPass();

        if (admin_data.status == 'success') {
            res.json(admin_data.data).status(200);
        }
        else {
            res.status(400).send({ message: admin_data.message })
        }
    },

    async getAllHedgeFund(req, res) {
        const admin_class = new AdminClass();
        const admin_data = await admin_class.getAllHedgeFundTransactions();

        if (admin_data.status = "success") {
            res.json(admin_data.data).status(200);
        } else {
            res.json(admin_data.message).status(400);
        }
    },

    async deleteHedgeFund(req, res) {
        let id = req.body.id
        let user_info = req.user_info
        let date =  Date.now()

        const admin_class = new AdminClass({ id: id, user_info: user_info, date_created: date });
        const admin_data = await admin_class.deleteHedgeFundTransaction();
        if (admin_data.status = "success") {
            res.json(admin_data.data).status(200);
        } else {
            res.json(admin_data.message).status(400);
        }
    },

    async updateHedgeFund(req, res) {
        let client_details = {
            user_info:    req.user_info,
            id:           req.body.id,
            user_id:      req.body.user_id,
            amount:       req.body.amount,
            decimal:      req.body.decimal,
            rate:         req.body.rate,
            date_to:      req.body.date_to,
            date_from:    req.body.date_from,
            date_created: Date.now()
        }

        let admin_class = new AdminClass(client_details);
        let updateStats = await admin_class.updateHedgeFundTransaction()

        if (updateStats.status == "success") {
            res.send({ message: updateStats.status })
        } else {
            res.status(400).send({ message: updateStats.message })
        }
    },

    async getTransactionReports(req, res) {
        let report_filters = req.body;
        let admin_class = new AdminClass(report_filters);
        let result = await admin_class.getTransactionReports();
        if (result.status == 'success') {
            res.status(200).json({ status: result.status, data: result.data })
        } else if (res.status == 'error') {
            res.status(400).json({ status: result.error, message: result.message });
        }
    },

    async clientList(req, res) {
        let admin_class = new AdminClass();
        let result      = await admin_class.clientList();

        if (result.status == 'success')
        {
            res.status(200).json({ status: result.status, data: result.data })
        }
        else if (res.status == 'error')
        {
            res.status(400).json({ status: result.error, message: result.message });
        }
    },

    async activityLogs(req, res) {
        if(req.body.from != undefined && req.body.to != undefined)
        {
            date = 
            {
                from: req.body.from,
                to: req.body.to
            };
        }
        else
        {
            date = null;
        }

        let admin_class = new AdminClass(date);
        let result      = await admin_class.activityLogs();

        if (result.status == 'success')
        {
            res.status(200).json({ status: result.status, data: result.data })
        }
        else if (res.status == 'error')
        {
            res.status(400).json({ status: result.error, message: result.message });
        }
    },

    // async viewAllAddFund(req, res) {
    //     if(req.body.from != undefined && req.body.to != undefined)
    //     {
    //         date = 
    //         {
    //             from: req.body.from,
    //             to: req.body.to
    //         };
    //         console.log(date);
    //     }
    //     else
    //     {
    //         date = null;
    //     }
    //     const account = new AdminClass(date);
    //     const account_data = await account.getAllAddFund();

    //     if (account_data.status = "success") {
    //         console.log('account_data.data')
    //         console.log(account_data.data)
    //         res.json(account_data.data).status(200);
    //     } else {
    //         res.json(account_data.message).status(400);
    //     }
    // },

    async postSendMessage(req, res) {

        const admin_class = new AdminClass(req.body);
        const admin_data = await admin_class.sendMessage();

        if (admin_data.status == 'success') {
            res.status(200).send({ message: admin_data.status })
        }
        else {
            res.status(400).send({ message: admin_data.message })
        }
    },

}
