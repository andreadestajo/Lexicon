const AccountClass = require('../classess/AccountClass');
const CurrencyClass = require('../classess/CurrencyClass');

module.exports =
{

    async login(req, res)
    {
        let email = req.body.email;
        let password = req.body.password;
        //authenticate() --- AccountClass.js method
        let authenticate = await new AccountClass({ email: email, password: password }).authenticate();

        if (authenticate.status == "success") {
            let validate_otp = await new AccountClass({ email: email, password: password }).verify_login();
            res.send(true);
        }
        else {
            res.status(400).send({ message: authenticate.message });
        }
    },
    //validate() --- AccountClass.js method
    async login_validate(req, res) {
        let user_information =
        {
            email: req.body.email,
            otp: req.body.code,
        }
       let account_class        = new AccountClass(user_information);
       let otp_validation       = await account_class.authenticate_otp();

        if(otp_validation.status == "error")
        {
            res.status(400).send({ message: otp_validation.message });
        }
        else if(otp_validation.status == "success")
        {
            res.send(otp_validation.data);
        }
        // res.send(true);
    },
    async registration(req, res)
    {
        let user_information =
        {
            country: req.body.country,
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password,
        }
        
        let account_class        = new AccountClass(user_information);
        let account_validation   = await account_class.validate();
        let account_verification = '';

        if (account_validation.status == "error") {
            res.status(400).send({ message: account_validation.message });
        }
        else if(account_validation.status == "success")
        {
            res.send(true);
            await account_class.verify();
        }

        if(account_verification.status == "error")
        {
            res.status(400).send({ message: account_verification.message });
        }
        else if(account_verification.status == "success")
        {
            res.send(account_verification.data);
        }
    },
    async validate_otp(req, res)
    {
       const currencyCodeArray = ['840', req.body.currencyCode];
       let user_information    =
        {
            country: req.body.country,
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password,
            otp: req.body.otp,
            nationality: req.body.demonym,
            contact_code: req.body.callingCodes,
            currencyCode: currencyCodeArray,
            date_created: Date.now()
        }

       let account_class        = new AccountClass(user_information);
       let otp_validation       = await account_class.validate_otp();

       if(otp_validation.status == "error")
        {
            res.status(400).send({ message: otp_validation.message });
        }
        else if(otp_validation.status == "success")
        {
            delete user_information.otp;
            await account_class.create();
            res.send(true);
        }
    },
    async forgotPassword(req, res)
    {
        let user_information =
        {
            email: req.body.email,
            isValidCaptcha: req.body.isValidCaptcha,
        }
        let account_class        = new AccountClass(user_information);
        let findEmail            = await account_class.findEmail();

        if(findEmail.status == "success")
        {
            let sendResetCode        = await account_class.sendResetCode();

            if(sendResetCode.status == "success")
            {
                res.status(200).send(sendResetCode.data);
            }
            else
            {
                res.status(400).send({ message: 'Error' });
            }
        }
        else if(findEmail.status == "error")
        {
            res.status(400).send({ message: findEmail.message });
        }
        // res.send(true);
    },
    async checkIfExpired(req, res)
    {
        let user_information =
        {
            otp: req.body.code,
            email: req.body.email,
        }
        let account_class        = new AccountClass(user_information);
        let checkIfExpired       = await account_class.validate_otp();

        if(checkIfExpired.status == "error")
        {
            res.send(checkIfExpired);
        }
        else if(checkIfExpired.status == "success")
        {
            res.send(checkIfExpired);
        }
    },
    async updatePassword(req, res)
    {
        let user_information =
        {
            email: req.body.email,
            new_password: req.body.new_password,
            confirm_new_password: req.body.confirm_new_password,
        }
        let account_class        = new AccountClass(user_information);
        let account_update   = await account_class.findAndUpdate();

        if(account_update.status == "error")
        {
            res.status(400).send({ message: account_update.message });
        }
        else if(account_update.status == "success")
        {
            res.status(200).send({ message: account_update.message });
        }
        // res.send(true);
    },
    async kyc(req, res) {
        let kyc_information =
        {
            //level 2 KYC
            last_name: req.body.last_name,
            gender: req.body.gender,
            contact: req.body.contact,
            birthday: req.body.birthday,
            address: req.body.address,
            security_question: req.body.security_question,
            security_answer: req.body.security_answer,
            // level 3 KYC
            identification_card: req.body.identification_card,
            id_image_path: "id/" + req.files['id_image_path'][0].filename,
            // id_image_path: req.body.id_image_path,
            // selfie_image_path: req.body.selfie_image_path
            selfie_image_path: "selfie/" + req.files['selfie_image_path'][0].filename
        }

        let account_class = new AccountClass(kyc_information);
        let kyc_validation = await account_class.validate_kyc();
        //if success in validate_kyc()
        //create KYC
        if (kyc_validation.status == "error") {
            res.status(400).send({ message: kyc_validation, message })
        } else if (kyc_validation.status == "success") {
            await account_class.create_kyc();
        }
    },

    async getSample(req, res)
    {
        let account_class = new AccountClass();
        let s = await account_class.getSample();

        res.status(200).send(s);
    }
}
