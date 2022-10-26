const moment = require('moment-timezone');
const MDB_USER = require('../models/MDB_USER');
const MDB_VERIFY_OTP = require('../models/MDB_VERIFY_OTP');
const NotificationClass = require('./NotificationClass');
const MDB_KYC = require('../models/MDB_KYC');
const MDB_ACCOUNT_NUMBER = require('../models/MDB_ACCOUNT_NUMBER');
const MDB_WALLET = require('../models/MDB_WALLET');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const bcrypt = require('bcryptjs');
const ServerClass = require('./ServerClass');
const fs = require('fs');
const MDB_CURRENCY = require('../models/MDB_CURRENCY');

module.exports = class AccountClass {
    constructor(user_information) {
        this.mdb_user = new MDB_USER();
        this.mdb_verify_otp = new MDB_VERIFY_OTP();
        this.mdb_kyc = new MDB_KYC();
        this.mdb_account_number = new MDB_ACCOUNT_NUMBER();
        this.mdb_wallet = new MDB_WALLET();
        this.mdb_currency = new MDB_CURRENCY();

        // this.mdb_global_settings = new MDB_GLOBAL_SETTINGS();
        this.user_information = user_information;
    }

    async validate() {
        let res = {};

        let mdb_user = new MDB_USER();
        let check_email = await mdb_user.findByEmail(this.user_information.email);
        const email = this.user_information.email;

        if (this.user_information.country.trim() == '' || this.user_information.full_name.trim() == '' || this.user_information.confirm_password.trim() == '' || this.user_information.password.trim() == '' || this.user_information.email.trim() == '') {
            res.status = "error";
            res.message = "You need to fill up all fields in order to proceed.";
        }
        else if (this.user_information.password.length < 8 || this.user_information.confirm_password.length < 8) {
            res.status = "error";
            res.message = "Password must be more than 8 characters.";
        }
        else if (this.user_information.password.length > 16 || this.user_information.confirm_password.length > 16) {
            res.status = "error";
            res.message = "Password must not be more than 16 characters.";
        }
        else if (this.user_information.confirm_password !== this.user_information.password) {
            res.status = "error";
            res.message = "The password you entered didn't match.";
        }
        else if (!email.includes("@")) {
            res.status = "error";
            res.message = "Please include an `@` in the email address.";
        }
        else if (check_email) {
            res.status = "error";
            res.message = "The e-mail you entered already exists.";
        }
        else {
            res.status = "success";
        }

        return res;
    }
    async verify() {
        let res = {};
        let mdb_verify_otp = new MDB_VERIFY_OTP();
        const email = this.user_information.email;

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
            subject: 'Verification Code',
            text: 'Your One Time Passcode is: ' + otp,
            template: 'verify_email',
            context: {
                name: this.user_information.full_name,
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
        await mdb_verify_otp.add(otp_data);
        return res;
    }
    async verify_login()
    {
        let res = {};
        const email = this.user_information.email;
        let mdb_verify_otp = new MDB_VERIFY_OTP();
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
            console.log(otp);
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
            subject: 'One Time Passcode',
            text: 'Your One Time Passcode is: ' + otp,
            template: 'verify_login',
            context: {
                name: this.user_information.full_name,
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
        await mdb_verify_otp.add(otp_data);
        return res;
    }
    async validate_otp() {
        let res = {};
        let mdb_verify_otp = new MDB_VERIFY_OTP();
        let check_otp = await mdb_verify_otp.findByEmailAndOtp(this.user_information.email, this.user_information.otp);
        if (check_otp) {
            res.status = "success";
            res.data = check_otp;
        }
        else {
            res.status = "error";
            res.message = "Invalid OTP";
        }
        return res;
    }
    async authenticate() {
        let res = {};
        let mdb_user = new MDB_USER();

        if (this.user_information.password.trim() == '' || this.user_information.email.trim() == '') {
            res.status = "error";
            res.message = "You need to fill up all fields in order to proceed.";
        }
        else {
            let check_account = await mdb_user.findByEmail(this.user_information.email);

            if (check_account) {
                const result = await bcrypt.compare(this.user_information.password, check_account.password);
                if (!result) {
                    res.status = "error";
                    res.message = "Invalid Credentials";
                }
                else {
                    res.status = "success";
                }
            }
            else {
                res.status = "error";
                res.message = "Invalid Credentials";
            }
        }

        return res;
    }
    async authenticate_otp() {
        let res = {};
        let mdb_user = new MDB_USER();
        let mdb_verify_otp = new MDB_VERIFY_OTP();
        let mdb_kyc = new MDB_KYC();
        let check_otp = await mdb_verify_otp.findByEmailAndOtp(this.user_information.email, this.user_information.otp);
        let check_account = await mdb_user.findByEmail(this.user_information.email);
        check_account.kyc = await mdb_kyc.findByUserId(check_account._id);
        let token_mixer = process.env.TOKEN_MIXER;


        if (check_otp) {
            res.status = "success";
            delete check_account.password;
            delete check_account.kyc._id;
            delete check_account.kyc.user_id;
            check_account.token = jwt.sign(check_account, token_mixer);
            res.data = check_account;
        }
        else {
            res.status = "error";
            res.message = "Invalid Validation Code";
        }
        return res;
    }
    async makeAccountNumber(data = {}, r = {})
    {
        let result = '';
        
        let date_ob = new Date();
        let year = date_ob.getFullYear().toString().substr(2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        let account_data =
        {
            user_id:      data._id,
            account_name: data.full_name,
            currency:     r.number_code,
            account_number_code: r.number_code + month + year
        }
        let res = await this.mdb_account_number.saveAccount(account_data);
        if(res)
        {
           result = res.account_number_code + res._id;
        }
        else
        {
            console.log('error');
        }
        return result;
    }
    async create() {
        let res = {};
        let hashed_password = '';
        hashed_password = await bcrypt.hash(this.user_information.password, 10);
        // currencyCode
        try {

            let add_form =
            {
                country: this.user_information.country,
                full_name: this.user_information.full_name,
                email: this.user_information.email,
                password: hashed_password,
                user_role: "Client",
                date_created: this.user_information.date_created
            }
            let data = await this.mdb_user.add(add_form);
            
            let wallet = [];
            let wallet_address = [];

            for(let i = 0; i < 2; i++)
            {
                let r = await this.mdb_currency.findByNumberCode(this.user_information.currencyCode[i]);
                let acc_num = await this.makeAccountNumber(data, r)
    
                let wallet_push =
                {
                    currency: r.abbreviation,
                    currency_name: r.name,
                    balance: 0,
                    wallet_address: acc_num,
                    decimal_places: 2,
                    is_fiat: true,
                }
                wallet.push(wallet_push);
                wallet_address.push(acc_num);
                
                let add_form_wallet =
                {
                    user_id: data._id,
                    currency_id: r._id,
                    currency_abbreviation: r.abbreviation,
                    balance: 0,
                    decimal_places: 2,
                    public_key: acc_num,
                    private_key: acc_num,
                }
                await this.mdb_wallet.add(add_form_wallet);
            }

            await this.mdb_user.update(data._id, { wallet: wallet, wallet_address: wallet_address });
            
            res.data = data._id;

            await this.createUserFilePath(res.data);


            let add_kyc_form =
            {
                user_id: res.data,
                country: add_form.country,
                nationality: this.user_information.nationality,
                calling_code: this.user_information.calling_code,
            }
            await this.mdb_kyc.add(add_kyc_form);

            res.status = "success";
        }
        catch (error) {
            console.log(error);
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }
    async sendResetCode() {
        let res = {};
        let mdb_verify_otp = new MDB_VERIFY_OTP();
        const email = this.user_information.email;

        // const expiration    = await this.mdb_global_settings.findBySettingType('email')
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
            subject: 'Request Reset Password',
            text: 'Requesting to Reset Password',
            template: 'reset_email',
            context: {
                email: this.user_information.email,
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
        await mdb_verify_otp.add(otp_data);
        res.data = otp_data;
        return res;
    }
    async findAndUpdate() {
        let res = {};
        let mdb_user = new MDB_USER();
        let hashed_password = '';

        if (this.user_information.new_password == '' || this.user_information.confirm_new_password == '') {
            res.status = "error";
            res.message = "You need to fill up all fields in order to proceed.";
        }
        else {
            // res.status = "success";
            hashed_password = await bcrypt.hash(this.user_information.new_password, 10);

            let updateDone = await mdb_user.findAndUpdate(this.user_information.email, hashed_password);

            if (updateDone) {
                res.status = "success";
                res.message = "Password updated successfully";
            }
        }

        return res;
    }
    async findPassword() {
        let res = {};
        let mdb_user = new MDB_USER();
        let check_account = await mdb_user.findByEmail(this.user_information.email);

        if (this.user_information.old_password.trim() == '') {
            res.status = "error";
            res.message = "Field is required"
        }
        else if (this.user_information.old_password.length < 8) {
            res.status = "error";
            res.message = "Password must be more than 8 characters.";
        }
        else if (this.user_information.old_password.length > 16) {
            res.status = "error";
            res.message = "Password must not be more than 16 characters.";
        }
        else {
            if (check_account) {
                const result = await bcrypt.compare(this.user_information.old_password, check_account.password);
                if (!result) {
                    res.status = "error";
                    res.message = "Old password do not exist";
                }
                else {
                    res.status = "success";
                }
            }
            else {
                res.status = "error";
            }
        }
        return res;
    }
    async findEmail() {
        let res = {};
        let mdb_user = new MDB_USER();
        let check_account = await mdb_user.findByEmail(this.user_information.email);

        if (check_account) {
            res.status = "success";
            res.data = check_account;
        }
        else {
            res.status = "error";
            res.message = "Email address do not exist";
        }
        return res;
    }
    async create_kyc() {
        let res = {};

        let mdb_kyc = new MDB_KYC();
        try {
            res.status = "success";

            let add_form =
            {
                last_name: this.user_information.last_name,
                gender: this.user_information.gender,
                contact: this.user_information.contact,
                birthday: this.user_information.birthday,
                address: this.user_information.address,
                security_question: this.user_information.security_question,
                security_answer: this.user_information.security_answer,
                identification_card: this.user_information.identification_card,
                id_image_path: this.user_information.id_image_path,
                selfie_image_path: this.user_information.selfie_image_path
            }

            await mdb_kyc.add(add_form);
        }
        catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
    }

    async getKycByUserId(user_id) {
        let res = {};
        try {
            const mdb_kyc = new MDB_KYC();
            const doc = await mdb_kyc.findByUserId(user_id);

            res.status = "success";
            res.data = doc;

        } catch (error) {
            res.status = "error";
            res.message = error.message;
        }

        return res;
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

    async getSample()
    {
        let res = "Hello World madapaka!";

        return res;
    }
}
