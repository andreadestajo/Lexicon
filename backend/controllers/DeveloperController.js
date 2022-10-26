const DeveloperClass = require('../classess/DeveloperClass');
const AdminController = require('./AdminController');

module.exports = {
    async verifyDeveloper(req, res) 
    {

        let developer_credentials = {
            email: req.body.email,
            password: req.body.password
        }

        const developer_class = new DeveloperClass(developer_credentials);
        const developer_data = await developer_class.verifyDeveloper();


        if (developer_data.status == "success") {
            res.json(developer_data.data)
        }
        else if (developer_data.status == "error") {
            res.json({ status: 'error', message: developer_data.message }).status(400)
        }
    },

    async addAdminUser(req, res) 
    {
        req.body.select_role = "Administrator";
        AdminController.addUser(req, res)
    },

    async clearCollections(req, res)
    {
        let collections = ['IdentityCounter', 'account_number', 'activity_logs', 'add_funds', 'currencies', 'hedge_fund', 'hedge_fund_staging', 'kyc', 'notifications', 'reference_number', 'role', 'security_questions', 'staging_transaction', 'transactions', 'users', 'verify_otp', 'wallets'];
        let data = DeveloperClass.clearCollections(collections)

        if (data.status == "success") {
            data.json({status: 'success', message: "collections had been cleared"})
        }else if (data.status == "error") {
            data.json({ status: 'error', message: data.message }).status(400)
        }
    }
}