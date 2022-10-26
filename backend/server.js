const express = require('express');
const cors = require('cors');
const multer = require("multer");
const app = express();
const ServerClass = require('./classess/ServerClass');
const FrontController = require('./controllers/FrontController');
const MemberController = require('./controllers/MemberController');
const member_only = require("./middleware/member_only");
const admin_only = require("./middleware/admin_only");
const WalletController = require('./controllers/WalletController');
const ScheduleController = require('./controllers/ScheduleController');
const AdminController = require('./controllers/AdminController');
const DeveloperController = require('./controllers/DeveloperController');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Front
// app.post("/api/front/login", FrontController.login);
// app.post("/api/front/registration", FrontController.registration);
// app.post("/api/front/forgot_password", FrontController.forgotPassword);

// file uploading in KYC
let storage = multer.diskStorage({
  filename: async function (req, file, next) {
    let ext = "";
    const mime_types = {
      "image/jpg": "jpg",
      "image/jpeg": "jpeg",
      "image/png": "png",
    };

    if (mime_types.hasOwnProperty(file.mimetype)) {
      // rename the file to guid + timestamp

      // converting blob file into image
      ext = mime_types[file.mimetype];
    }

    next(null, new Date().getTime() + "." + ext);
  },
  destination: async function (req, file, next) {
    let folder = "";
    const image_path = {
      id_image_path: "id",
      selfie_image_path: "selfie",
    };

    if (image_path.hasOwnProperty(file.fieldname)) {
      // rename the file to guid + timestamp

      // converting blob file into image
      folder = image_path[file.fieldname];
    }

    next(
      null,
      `${process.env.MEMBER_DIR}/${req.body.user_id}/images/${folder}/`
    );
  },
});

let upload = multer({
  storage: storage,
});

// file uploading in Deposit Slip
let storageDeposit = multer.diskStorage({
  destination: async function (req, file, next) {
    // req.body.user_id = '5f2cd95fcdfc3d60487774d7';
    next(
      null,
      `${process.env.MEMBER_DIR}/${req.body.user_id}/images/transactions/`
    );
  },
  filename: function (req, file, next) {
    next(null, new Date().getTime() + "-" + file.originalname);
  },
});
let uploadDeposit = multer({ storage: storageDeposit });

app.use('/user/:user_id/:category/:folder/',
  async function (req, res, next) {
    let user_id = req.params.user_id;
    let category = req.params.category;
    let folder = req.params.folder;

    console.log(process.env.MEMBER_DIR)
    app.use(`/user/${user_id}/${category}/${folder}`, express.static(`${process.env.MEMBER_DIR}/${user_id}/${category}/${folder}/`));
    next();
  });

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/email_template/account_created.html");
});

// app.use('/public/', express.static('../../public/'))
app.post("/api/member/kyc", MemberController.getKycByUserId);
app.put(
  "/api/member/kyc/personal/",
  member_only,
  MemberController.updateKyc_personal
);
app.put(
  "/api/member/kyc/address/",
  member_only,
  MemberController.updateKyc_address
);
app.put(
  "/api/member/kyc/id/",
  upload.single("id_image_path"),
  member_only,
  MemberController.updateKyc_id
);
app.put(
  "/api/member/kyc/selfie/",
  upload.single("selfie_image_path"),
  member_only,
  MemberController.updateKyc_selfie
);
app.put(
  "/api/member/kyc/security/",
  member_only,
  MemberController.updateKyc_security_question
);
app.post(
  "/api/member/kyc/update/step/",
  member_only,
  MemberController.update_step
);
app.post(
  "/api/member/update_profile",
  member_only,
  MemberController.updateProfile
);
app.put(
  "/api/member/kyc/down/",
  member_only,
  MemberController.update_step_down
);

app.post("/api/front/login", FrontController.login);
app.post("/api/front/login_validate", FrontController.login_validate);
app.post("/api/front/registration", FrontController.registration);
app.post("/api/front/validate_otp", FrontController.validate_otp);
app.post("/api/front/forgot_password", FrontController.forgotPassword);
app.post("/api/front/checkIfExpired", FrontController.checkIfExpired);
app.post("/api/front/updatePassword", FrontController.updatePassword);

// KYC
app.post(
  "/api/front/kyc",
  upload.fields([
    { name: "id_image_path", maxCount: 1 },
    { name: "selfie_image_path", maxCount: 1 },
  ]),
  FrontController.kyc
);

//admin
app.post("/api/admin/kyc/get/all", admin_only, MemberController.getKyc);

// MEMBER
app.post(
  "/api/member/change_password",
  member_only,
  MemberController.changePassword
);
// app.post("/api/member/kyc", member_only, MemberController.getKycByUserId);

//Notification
app.post("/api/member/notifications/showNotifs", MemberController.getNotif);
app.post(
  "/api/member/notifications/updateNotifs",
  MemberController.updateStatus
);
app.post(
  "/api/member/notifications/readAllNotifications",
  MemberController.readAllNotifications
);

// WALLET
app.post('/api/wallet/create_wallet', member_only, WalletController.createWallet);
app.post('/api/wallet/verify_internal_user_details', member_only, WalletController.verifyInternalDetails);
app.post('/api/wallet/verify_external_user_details', member_only, WalletController.verifyExternalDetails);
app.post('/api/wallet/get_security_question', member_only, WalletController.getSecurityQuestion);
app.post('/api/wallet/send_attempt_reached', member_only, WalletController.sendAttemptReached);
app.post('/api/wallet/send_currency_internal', member_only, WalletController.sendCurrencyInternal); // modified
app.post('/api/wallet/send_currency_external', member_only, WalletController.sendCurrencyExternal); //new
app.post('/api/wallet/view_wallet_balance', member_only, WalletController.viewWalletBalance);
app.post('/api/wallet/view_balance_options', member_only, WalletController.viewBalanceOptions);
app.post('/api/wallet/transaction_history', member_only, WalletController.transactionHistory);
app.post('/api/wallet/view_receiver', member_only, WalletController.viewReceiver);
app.post('/api/wallet/external_transactions', member_only, WalletController.externalTransactions);
app.post('/api/wallet/transaction/report', member_only, WalletController.getClientTransactionReports);
app.post('/api/wallet/current_deposit', member_only, WalletController.getCurrentDeposit);

//add funds
app.post('/api/wallet/manual_add_funds', member_only, WalletController.manualAddFunds);
app.post('/api/wallet/update/status/cancel/member', member_only, WalletController.member_updateStatus);
app.post('/api/wallet/update/status/cancel', admin_only, WalletController.updateStatus);
app.post('/api/wallet/add_fund/history', member_only, WalletController.addFundHistory);
app.post('/api/wallet/add_fund/upload/deposit_slip', uploadDeposit.single('deposit_slip_path'), member_only, WalletController.uploadDeposit)

//Forgot Security
app.post('/api/wallet/account_request_email', member_only, WalletController.requestEmail); // request email
app.post('/api/wallet/account_request_otp', member_only, WalletController.requestOTP); // request OTP
app.post('/api/wallet/reset_security_question_answer', member_only, WalletController.resetSecurity);
app.post('/api/wallet/account_locked', member_only, WalletController.accountLocked);
app.post('/api/wallet/convert_currency', member_only, WalletController.convertCurrency);
app.post('/api/wallet/view_one_fee', member_only, WalletController.viewOneFee);
app.post('/api/wallet/send_error_counter', member_only, WalletController.sendErrorCounter);
app.post('/api/wallet/generate_otp', member_only, WalletController.generateOtp);
//hedge fund
app.post("/api/wallet/hedge_fund", WalletController.hedge_fund);
app.post('/api/wallet/hedge_fund/2', member_only, WalletController.hedge_fund_2);
app.post("/api/wallet/hedge_fund/list", WalletController.hedge_fund_list);

// SCHEDULE
app.post('/api/schedule/set_time', ScheduleController.setTimeSchedule);

// ADMIN
app.post('/api/admin/create_currency', admin_only, AdminController.addCurrency);
app.post('/api/admin/kyc', admin_only, AdminController.getKycByStatus);
app.post('/api/admin/add_fee', admin_only, AdminController.addFee);
app.post('/api/admin/update_fee', admin_only, AdminController.updateFee);
app.post('/api/admin/view_fees', admin_only, AdminController.viewDefaultFees);
app.post('/api/admin/view_frequency', admin_only, AdminController.viewConversionFrequency);
app.post('/api/admin/view_currencies', admin_only, AdminController.viewCurrencies);
app.put('/api/member/kyc/status', admin_only, AdminController.updateMemberKyc)
app.delete('/api/admin/delete/user', admin_only, AdminController.deleteAllUserInfo)
app.post('/api/admin/transaction/report', admin_only, AdminController.getTransactionReports)
app.post('/api/admin/get_client_list/all', admin_only, AdminController.clientList);
app.post('/api/admin/get_activity_logs/all', admin_only, AdminController.activityLogs);

// Add Fund
app.post(
  "/api/admin/add_funds/get/all",
  admin_only,
  AdminController.viewAllAddFund
);
app.post(
  "/api/admin/add_funds/get/all/transactions",
  admin_only,
  AdminController.viewAllAddFundsTransactions
);
app.post(
  "/api/admin/update/add/funds",
  admin_only,
  AdminController.updateStatusApprove
);

//ADMIN
app.post('/api/admin/get_external_transactions/all', admin_only, AdminController.getExternalTransaction);
app.post('/api/admin/external_transactions/approve', admin_only, AdminController.approveExternalTxn);
app.post('/api/admin/external_transactions/cancel', admin_only, AdminController.cancelExternalTxn);
app.post('/api/admin/external_transactions/verify', admin_only, AdminController.verifyExternalTxn);

//user rights
// app.post('/api/admin/users/userlist', admin_only, AdminController.userlist);
app.post('/api/admin/users/set/Userrole', admin_only, AdminController.setUserRole);
app.post('/api/admin/users/add/user', admin_only, AdminController.addUser);
app.post('/api/admin/users/verify/admin', AdminController.verifyAdmin); // Login
app.post('/api/admin/delete/removeUser', admin_only, AdminController.removeUser);
app.post('/api/admin/add/role', admin_only, AdminController.addRole);
app.post('/api/admin/list/role', admin_only, AdminController.getRole);
app.post('/api/admin/delete/role', admin_only, AdminController.removeRole);
app.post('/api/admin/update/role', admin_only, AdminController.updateRole);
app.post('/api/admin/hedge-fund/get/all', admin_only, AdminController.getAllHedgeFund);
app.post('/api/admin/hedge-fund/delete', admin_only, AdminController.deleteHedgeFund);
app.post('/api/admin/hedge-fund/update', admin_only, AdminController.updateHedgeFund);

//admin Add Account
app.post("/api/admin/users/userlist", admin_only, AdminController.getuserlist);
app.post("/api/admin/users/alluserlist", AdminController.getAllUserList);
app.post("/api/admin/users/createaccount", admin_only, AdminController.postCreateAccount);
app.post("/api/admin/password/verification", admin_only, AdminController.verifiedAccount);
app.post("/api/admin/users/getUserByID", AdminController.getUserByID);

const developer_only = require('./middleware/developer_only');
// Developer
app.post('/api/developer/users/verify', DeveloperController.verifyDeveloper);
app.post('/api/developer/create/admin', developer_only, DeveloperController.addAdminUser);
app.delete('/api/developer/delete/collections', DeveloperController.clearCollections);

// SMS
app.post("/api/admin/send/message", AdminController.postSendMessage);

app.post('/api/member/supported_currency', member_only, MemberController.supported_currency);
// app.post('/api/member/new_currency', member_only, WalletController.createWallet);
// app.post('/api/wallet/external_transactions', member_only, WalletController.externalTransactions);
app.post('/api/wallet/manage_deposit', member_only, WalletController.manage_deposit);

const ServerController = require('./controllers/ServerController');
app.post('/api/server/date', ServerController.get_date);

app.get('/api/sample', FrontController.getSample);

app.post(
  "/api/member/supported_currency",
  member_only,
  MemberController.supported_currency
);
app.post(
  "/api/member/new_currency",
  member_only,
  WalletController.createWallet
);
app.post(
  "/api/wallet/external_transactions",
  member_only,
  WalletController.externalTransactions
);
app.post(
  "/api/wallet/manage_deposit",
  member_only,
  WalletController.manage_deposit
);

app.listen(
  {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },
  (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      console.log(
        `Server is up and running on port ${process.env.SERVER_PORT}`
      );
    }
  }
);

