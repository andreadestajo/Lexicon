//front
exports.postLoginUser = 'front/login';
exports.postValidateLogin = 'front/login_validate';
exports.postRegistrationUser = 'front/registration';
exports.postValidateOtp = 'front/validate_otp';
exports.postForgotPassword = 'front/forgot_password';
exports.postCheckIfExpired = 'front/checkIfExpired';
exports.postUpdatePassword = 'front/updatePassword';

//admin
exports.postListUsers = 'admin/users/list';
exports.postAddUser = 'admin/users/add';
exports.postAddEdit = 'admin/users/edit';
exports.postAddCurrency = 'admin/create_currency';
exports.postUpdateFee = 'admin/update_fee';
exports.postViewFees = 'admin/view_fees';
exports.postViewFrequency = 'admin/view_frequency'
exports.postViewCurrencies = 'admin/view_currencies';
exports.postListUsers = 'admin/users/list';
exports.postAddUser = 'admin/users/add';
exports.postAddEdit = 'admin/users/edit';
exports.postUserList = 'admin/users/userlist';
exports.setUserRole = 'admin/users/set/Userrole';
exports.AdminAddUser = 'admin/users/add/user';
exports.verifyAdmin = 'admin/users/verify/admin';
exports.removeUser = 'admin/delete/removeUser';
exports.AdminAddRole = 'admin/add/role';
exports.postRoleList = 'admin/list/role';
exports.deleteRole = 'admin/delete/role';
exports.updateRole = 'admin/update/role';

//Add Account
exports.postAllUserList = 'admin/users/alluserlist';
exports.postCreateAccount = 'admin/users/createaccount';
exports.setUserPass = 'admin/password/verification';
exports.getUserByID = 'admin/users/getUserByID';

exports.postSetConversionFrequency = 'schedule/set_time';

//notification
exports.getNotifications = 'member/notifications/showNotifs';
exports.updateNotifications = 'member/notifications/updateNotifs';
exports.readAllNotifications = 'member/notifications/readAllNotifications';

// SMS
exports.postSendMessage = 'admin/send/message';


//member
exports.postUpdateProfile = 'member/update_profile';

// kyc
exports.putUpdateKycPersonal = "member/kyc/personal/";
exports.putUpdateKycAddress = "member/kyc/address/"
exports.putUpdateKycId = "member/kyc/id/"
exports.putUpdateKycIdInformation = "member/kyc/id-number/"
exports.putUpdateKycSelfie = "member/kyc/selfie/"
exports.putUpdateKycSecurityQuestion = "member/kyc/security"
exports.putStepDown = "member/kyc/down/"
exports.postGetKyc = "member/kyc"
exports.putUpdateKycStatus = "member/kyc/status"

//admin
exports.getKycByStatus = "admin/kyc"
exports.getAllKycInfo = "admin/kyc/get/all"
exports.getAddFundHistory = 'admin/add_funds/get/all'
exports.getAllAddFundsTransactions = 'admin/add_funds/get/all/transactions'
exports.updateApproveAddFunds = 'admin/update/add/funds'
exports.deleteAllUserInfo = 'admin/delete/user'
exports.getAllExternalTxn = 'admin/get_external_transactions/all';
exports.approveExtenalTxnStatus = 'admin/external_transactions/approve';
exports.cancelExtenalTxnStatus = 'admin/external_transactions/cancel';
exports.verifyExtenalTxnStatus = 'admin/external_transactions/verify';
exports.getAllHedgeFundsTransactions = 'admin/hedge-fund/get/all';
exports.deleteHedgeFundTransaction = 'admin/hedge-fund/delete';
exports.updateHedgeFundTransaction = 'admin/hedge-fund/update';
exports.getClientList = 'admin/get_client_list/all';
exports.getActivityLogs = 'admin/get_activity_logs/all';

//wallet
exports.postSecurityQuestion = 'wallet/get_security_question';
exports.postVerifyInternalDetails = 'wallet/verify_internal_user_details';
exports.postVerifyExternalDetails = 'wallet/verify_external_user_details';
exports.postSendAttempt = 'wallet/send_attempt_reached';
exports.postWalletSend = 'wallet/send_currency_internal';
exports.postWalletSendExternal = 'wallet/send_currency_external';
exports.postWalletDetails = 'wallet/view_wallet_balance';
exports.postTransactionHistory = 'wallet/transaction_history';
exports.postAddFunds = 'wallet/manual_add_funds';
exports.postUpdateStatus = 'wallet/update/status/cancel';
exports.postMemberUpdateStatus = 'wallet/update/status/cancel/member';
exports.postGetAddFundHistory = 'wallet/add_fund/history';
exports.postUploadDepositSlip = 'wallet/add_fund/upload/deposit_slip'
exports.postWalletDetailsOptions = 'wallet/view_balance_options';
exports.postConvertCurrency = 'wallet/convert_currency';
exports.postRequestEmail = 'wallet/account_request_email'; // id number
exports.postOTPForgotSecurity = 'wallet/account_request_otp'; // otp
exports.postResetSecurity = 'wallet/reset_security_question_answer';
exports.postChangePassword = 'member/change_password';
exports.postViewOneFee = 'wallet/view_one_fee';
exports.postViewReceiver = 'wallet/view_receiver';
exports.postHedgeFund = 'wallet/hedge_fund';
exports.postHedgeFundList = 'wallet/hedge_fund/list'
exports.postSupportedCCY = 'member/supported_currency';
exports.postAddNewCCY = 'member/new_currency';
exports.postManageTransactions = 'wallet/external_transactions';
exports.postManageDeposit = 'wallet/manage_deposit';
exports.postSendErrorCounter = 'wallet/send_error_counter';
exports.postGenerateOTP = 'wallet/generate_otp';
exports.postHedgeFund = 'wallet/hedge_fund'
exports.postHedgeFund2 = 'wallet/hedge_fund/2'
exports.getCurrentDeposit = 'wallet/current_deposit';

// developer
exports.verifyDeveloper = 'developer/users/verify';
exports.postSuperAdmin = 'developer/create/admin'


exports.getTransactionReport = 'admin/transaction/report'
exports.getClientTransactionReport = 'wallet/transaction/report'
// server
exports.postServerDate = 'server/date';

