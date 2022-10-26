const moment        = require('moment-timezone')
const MDB_USER      = require('../models/MDB_USER');
const MDB_KYC       = require('../models/MDB_KYC');
const MDB_NOTIFS    = require('../models/MDB_NOTIFICATION');


module.exports = class MemberClass {
    constructor(user_information = null) {
        this.user_information = user_information;
    }

    async validate_user_kyc_step_1() {
        let res         = {};


        let birthdate   = moment(this.user_information.birthday).format('YYYY-MM-DD');
        let today       = moment().format('YYYY-MM-DD');
        birthdate       = moment(birthdate);
        today           = moment(today);
        let age         = today.diff(birthdate, 'years');

        if (this.user_information.last_name.trim() == '' ||
            this.user_information.first_name.trim() == '' ||
            this.user_information.gender.trim() == '' ||
            this.user_information.contact.trim() == '' ||
            this.user_information.birthday.trim() == '' ||
            this.user_information.nationality.trim() == '') {
            res.status = "error";
            res.message = "You need to fill up all fields in order to proceed.";
        } else
            if (age < 18) {


                res.status = "error";
                res.message = "18 below are not allowed";
            } else {
                res.status = "success";
            }
        return res;
    }


    async validate_user_kyc_step_2() {
        let res = {};

        if (this.user_information.house_number.trim() == '' ||
            this.user_information.street_address.trim() == '' ||
            this.user_information.city.trim() == '' ||
            this.user_information.country.trim() == '' ||
            this.user_information.zip_code.trim() == '') {
            res.status = "error";
            res.message = "You need to fill up all fields in order to proceed.";
        } else {
            res.status = "success";
        }

        return res;
    }



    async validate_user_kyc_step3() {
        let res = {status: 'success'};

        let id_expiry = this.user_information.has_id_expiry == 'false' ? null : new Date(this.user_information.id_expiry);


        if(id_expiry !== null)
        {
            id_expiry   = moment(id_expiry).format('YYYY-MM-DD');
            let today   = moment().format('YYYY-MM-DD');
            id_expiry   = moment(id_expiry);
            today       = moment(today);

            let expiry_date = id_expiry.diff(today, 'days');

            if (expiry_date <= 0) {
                res.status = "error";
                res.message = "Your ID is already expired."
            }
        }else {
            this.user_information.id_expiry = null
        }

        if (this.user_information.identification_card == '' || this.user_information.id_image_path == '' || this.user_information.id_number == '') {
            res.status = "error";
            res.message = "You need to fill up all fields in order to proceed.";
        }

        return res;
    }

    async validate_user_kyc_step5() {
        let res = {};

        if (this.user_information.selfie_image_path == "") {
            res.status = "Error";
            res.message = "You need to fill up all fields in order to proceed.";
        } else {
            res.status = "success";
        }

        return res;
    }

    async validate_user_kyc_step_6() {
        let res = {};

        if (this.user_information.secret_question == "" || this.user_information.secret_question == "") {
            res.status = "Error";
            res.message = "You need to fill up all fields in order to proceed.";
        } else {
            res.status = "success";
        }

        return res;
    }

    async updateKyc() {
        let res = {};

        let user_id = this.user_information.user_id;

        delete this.user_information.user_id;
        this.user_information.date_modified = moment();
        let updates = this.user_information;

        try {
            const mdb_kyc = new MDB_KYC();
            //MDB_KYC METHOD
            const doc = await mdb_kyc.findByUserIdAndUpdate(user_id, updates);

            res.status = "success";
            res.data = doc;
        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }
        return res;
    }

    async update_step_down() {
        let res = {}
        let user_id = this.user_information.user_info._id;

        try {
            const mdb_kyc = new MDB_KYC();

            const doc   = await mdb_kyc.findByUserIdAndUpdateKycStep(user_id, 0);
            res.status  = "success";
            res.data    = doc
        } catch (error) {
            res.status  = "error";
            res.message = error.message;
        }
        return res;

    }

    async getKycByUserId() {
        let res = {};
        try {
            const mdb_kyc = new MDB_KYC();
            const doc = await mdb_kyc.findByUserId(this.user_information.user_id);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async getAllKyc() {
        let res = {};
        try {

            const doc = await this.mdb_kyc.docs();

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message
        }
        return res
    }

}
