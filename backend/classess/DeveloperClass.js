const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const MODEL = require('../models/MODEL');
const MDB_USER = require('../models/MDB_USER');

module.exports = class DeveloperClass {
    constructor(user_information = null) {
        this.user_information = user_information;
    }

    async verifyDeveloper() {

        let res = {};
        const mdb_user = new MDB_USER();
        let check_account = await mdb_user.findByEmailAndRole(this.user_information.email);

        if (check_account == null) {
            res.status = "error";
            res.message = "Invalid Credentials";

            return res;
        }

        let is_password_match = await bcrypt.compare(this.user_information.password, check_account.password);

        if (is_password_match === false) {
            res.status = "error";
            res.message = "Invalid Credentials";

            return res;
        }

        let is_developer = check_account.user_role == "Developer";

        if (is_developer === false) {
            res.status = "error";
            res.message = "Invalid Credentials";

            return res;
        }

        let token_mixer = process.env.DEVELOPER_TOKEN_MIXER;
        check_account.token = jwt.sign(check_account, token_mixer);

        res.status = "success";
        res.data = check_account;

        return res;

    }

    static async clearCollections(collectionArray)
    {
        let res = {};
        collectionArray.forEach(async (item) => 
        {
           let status = await MODEL.drop(item)

           if(status == true)
           {
               console.log(`${item} has been cleared}`)
           }else
           {
                res.status  = "error";
                res.message = status;
                return res
           }
        })

        res.status = "success";
        return res;
    }
}