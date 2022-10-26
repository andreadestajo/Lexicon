// import RouteGuard             from './route_guards'
const routes = [
  {
    path: "/",
    component: () => import("layouts/FrontLayout.vue"),
    children: [
      {
        name: "root",
        path: "",
        component: () => import("pages/Front/Landing.vue")
      },
      {
        name: "front_login",
        path: "login",
        component: () => import("pages/Front/Login.vue")
      },
      {
        name: "under_maintenance",
        path: "maintenance",
        component: () => import("pages/UnderMaintenance.vue")
      },
      {
        name: "front_forgot",
        path: "forgot",
        component: () => import("pages/Front/Forgot.vue")
      },
      {
        name: "front_reset_password",
        path: "reset_password",
        component: () => import("pages/Front/ResetPassword.vue")
      },
      {
        name: "admin_login",
        path: "admin/login",
        component: () => import("pages/Front/AdminLogin.vue")
      },
      {
        name: "account_verification",
        path: "verification",
        component: () => import("pages/Front/AccountVerification.vue")
      },
      // { name: 'front_login', path: 'landing', component: () => import('pages/Front/Login.vue') },
      { name: 'reset_security', path: 'reset-security', component: () => import('pages/Front/ResetSecurity.vue') },
      // { name: 'reset_security_otp', path: 'reset-security-otp', component: () => import('pages/Front/ResetSecurityOtp.vue') },
      {
        name: 'terms_and_conditions',
        path: 'terms_and_conditions',
        component: () => import("pages/Front/TermsAndConditions.vue")
      },
      {
        name: "developer_login",
        path: "developer/login",
        component: () => import("pages/Front/DeveloperLogin.vue")
      },
    ]
  },
  {
    path: "/documentation",
    component: () => import("layouts/DocumentationLayout.vue"),
    children: [
      { name: 'documentation_hedge_fund', path: 'hedge_fund', component: () => import('pages/Documentation/HedgeFund.vue') },
      { name: 'documentation_hedge_fund_2', path: 'hedge_fund_2', component: () => import('pages/Documentation/HedgeFund2.vue') },
      { name: 'documentation_hedge_fund_3', path: 'hedge_fund_3', component: () => import('pages/Documentation/HedgeFund3.vue') },
      {
        name: "documentation_landing",
        path: "",
        component: () => import("pages/Documentation/Landing.vue")
      },
      {
        name: "documentation_login",
        path: "login",
        component: () => import("pages/Documentation/Login.vue")
      },
      {
        name: "documentation_registration",
        path: "registration",
        component: () => import("pages/Documentation/Registration.vue")
      },
      {
        name: "documentation_forgot_password",
        path: "forgot_password",
        component: () => import("pages/Documentation/ForgotPassword.vue")
      },
      {
        name: "documentation_reset_password",
        path: "reset_password",
        component: () => import("pages/Documentation/ResetPassword.vue")
      },
      {
        name: "documentation_update_profile",
        path: "update_profile",
        component: () => import("pages/Documentation/UpdateProfile.vue")
      },
      {
        name: "documentation_kyc",
        path: "kyc",
        component: () => import("pages/Documentation/Kyc.vue")
      },
      {
        name: "documentation_change_password",
        path: "change_password",
        component: () => import("pages/Documentation/ChangePassword.vue")
      },
      {
        name: "documentation_wallet_send",
        path: "wallet_send",
        component: () => import("pages/Documentation/WalletSend.vue")
      },
      {
        name: "documentation_wallet_receive",
        path: "wallet_receive",
        component: () => import("pages/Documentation/WalletReceive.vue")
      },
      {
        name: "documentation_wallet_history",
        path: "wallet_history",
        component: () => import("pages/Documentation/WalletHistory.vue")
      },
      {
        name: "documentation_dashboard",
        path: "dashboard",
        component: () => import("pages/Documentation/Dashboard.vue")
      },
      {
        name: "documentation_add_funds",
        path: "wallet_add_funds",
        component: () => import("pages/Documentation/WalletAddFunds.vue")
      },
      {
        name: "documentation_add_funds_v2",
        path: "wallet_add_funds_v2",
        component: () => import("pages/Documentation/WalletAddFundsV2.vue")
      },
      {
        name: "documentation_add_funds_history",
        path: "wallet_add_funds_history",
        component: () => import("pages/Documentation/WalletAddFundsHistory.vue")
      },
      {
        name: "documentation_notification",
        path: "notification",
        component: () => import("pages/Documentation/Notification.vue")
      },
      // {
      //   name: "documentation_reset_security_otp",
      //   path: "reset_security_question_answer_otp",
      //   component: () => import("pages/Documentation/ResetSecurityOTP.vue")
      // },
      // {
      //   name: "documentation_reset_security_id_number",
      //   path: "reset_security_question_answer_id_number",
      //   component: () => import("pages/Documentation/ResetSecurityIdNumber.vue")
      // },
      {
        name: "documentation_manage_transactions",
        path: "manage_transactions",
        component: () => import("pages/Documentation/ManageTransactions.vue")
      },
      {
        name: "documentation_manage_deposit",
        path: "manage_deposit",
        component: () => import("pages/Documentation/ManageDeposit.vue")
      },
      {
        name: "documentation_hedge_fund",
        path: "hedge_fund",
        component: () => import("pages/Documentation/HedgeFund.vue")
      },
      {
        name: "documentation_sms",
        path: "sms",
        component: () => import("pages/Documentation/Sms.vue")
      },


      { name: 'documentation_admin_reports', path: 'reports', component: () => import('pages/Documentation/Reports.vue') },
      { name: 'documentation_transaction_reports', path: 'transaction_reports', component: () => import('pages/Documentation/TransactionReports.vue') },
    ]
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      // { name: 'admin_kyc_information', path: 'get_all_kyc', component: () => import('pages/Admin/KycInformation.vue') },
      {
        name: "admin_kyc",
        path: "kyc",
        component: () => import("pages/Admin/KycSubmits.vue")
      },
      {
        name: "admin_dashboard",
        path: "dashboard",
        component: () => import("pages/Admin/AdminDashboard.vue")
      },
      {
        name: "admin_kyc_submits",
        path: "kyc/submits",
        component: () => import("pages/Admin/AdminKycSubmits.vue")
      },
      {
        name: "admin_add_funds_transactions",
        path: "transactions/add-funds",
        component: () => import("pages/Admin/AdminTransactions.vue")
      },
      {
        name: "admin_wire_transfer_transactions",
        path: "transactions/transfer",
        component: () => import("pages/Admin/DashboardTable/WireTransfer.vue")
      },
      {
        name: "admin_clients",
        path: "client-list",
        component: () => import("pages/Admin/AdminClientList.vue")
      },
      {
        name: "admin_activity_log",
        path: "activity-logs",
        component: () => import("pages/Admin/AdminActivityLogs.vue")
      },
      {
        name: "admin_users",
        path: "users",
        component: () => import("pages/Admin/AdminUsers.vue")
      },
      {
        name: "admin_wire_transfer",
        path: "wire-transfer",
        component: () => import("pages/Admin/AdminWireTransfer.vue")
      },
      {
        name: "admin_settings",
        path: "settings",
        component: () => import("pages/Admin/AdminSettings.vue")
      },
      {
        name: "admin_reports",
        path: "reports",
        component: () => import("pages/Admin/DashboardTable/AdminReport.vue")
      },
      {
        name: "documentation_admin_add_funds_history",
        path: "admin_add_funds",
        component: () => import("pages/Admin/AdminAddFundsHistory.vue")
      },
      // {
      //   name: "admin_transaction_approval",
      //   path: "transaction_approval",
      //   component: () => import("pages/Admin/TransactionApproval.vue")
      // },
      {
        name: "documentation_admin_add_currency",
        path: "add_currency",
        component: () => import("pages/Admin/AddCurrency.vue")
      },
      {
        name: "documentation_admin_conversion_frequency",
        path: "conversion_frequency",
        component: () => import("pages/Admin/ConversionFrequency.vue")
      },
      {
        name: "documentation_admin_update_fee",
        path: "update_fee",
        component: () => import("pages/Admin/UpdateFee.vue")
      },
      // addmin userRights
      {
        name: "user_rights",
        path: "user_rights",
        component: () => import("pages/Admin/UserAccess.vue")
      },
      {
        name: "admin_login",
        path: "admin_login",
        component: () => import("pages/Admin/AdminLogin.vue")
      },
      {
        name: "permissions",
        path: "permissions",
        component: () => import("pages/Admin/Permissions.vue")
      },
      {
        name: "admin_add_account",
        path: "admin_add_account",
        component: () => import("components/Admin/UQAdminAddAccount.vue")
      },
      { name: "admin_hedge_fund", path: 'hedge_fund', component: () => import('pages/Admin/DashboardTable/AdminHedgeFund.vue') },
    ]
  },
  {
    path: "/member",
    component: () => import("layouts/LayoutBar.vue"),
    children: [
      // { name: 'member_update_profile', path: 'update_profile', component: () => import('pages/Member/Dashboard.vue') },
      // { name: 'front_login', path: 'landing', component: () => import('pages/Front/Login.vue') },
      {
        name: "kyc_personal_information",
        path: "kyc_personal_information",
        component: () => import("../pages/Member/Kyc.vue")
      }
    ]
  },
  {
    path: "/member",
    component: () => import("layouts/FrontLayout.vue"),
    children: [
      // { name: 'member_update_profile', path: 'update_profile', component: () => import('pages/Member/Dashboard.vue') },
      // { name: 'front_login', path: 'landing', component: () => import('pages/Front/Login.vue') },
      {
        name: "kyc_personal_information",
        path: "kyc_personal_information",
        component: () => import("../pages/Member/Kyc.vue")
      }
    ]
  },
  {
    path: "/wallet",
    component: () => import("layouts/LayoutBar.vue"),

    children: [
      {
        name: "add_funds_history",
        path: "wallet_add_funds_history_v2",
        component: () => import("pages/Member/AddFundsHistory.vue")
      }
      //  { name: 'add_funds_history', path: 'wallet_add_funds_history_v2', component: () => import('pages/Dashboard/AddFundHistory.vue') },
    ]
  },
  {
    path: "/home",
    component: () => import("layouts/NavbarLayout.vue"),
    // beforeEnter: RouteGuard.beforeEnterMember,
    children: [
      {
        name: "dashboard",
        path: "dashboard",
        component: () => import("pages/Dashboard/Dashboard.vue")
      },
      {
        name: "hedge3",
        path: "hedgev3",
        component: () => import("components/HedgeFund3.vue")
      },
      {
        name: "deposit",
        path: "deposit",
        component: () => import("pages/Dashboard/Deposit.vue")
      },
      {
        name: "add_funds_history_nav",
        path: "add-funds/history",
        component: () => import("pages/Dashboard/Status.vue")
      },
      // { name: 'transfer_fund', path: 'transfer', component: () => import('pages/Dashboard/TransferFund.vue') },
      {
        name: "hedgefund",
        path: "hedgefund",
        component: () => import("pages/Dashboard/HedgeFund2.vue")
      },
      {
        name: "lexicon_token",
        path: "lexicon/token",
        component: () => import("pages/Dashboard/lexicontoken.vue")
      },
      {
        name: "visa_card",
        path: "visacard",
        component: () => import("pages/Dashboard/visacard.vue")
      },
      {
        name: "add_account",
        path: "add/account",
        component: () => import("pages/Dashboard/addaccount.vue")
      },
      {
        name: "transfer-fund",
        path: "transfer-fund",
        component: () => import("pages/Dashboard/TransferFund.vue")
      },
      {
        name: "wire-transfer",
        path: "wire-transfer",
        component: () => import("pages/Dashboard/WireTransfer.vue")
      },
      {
        name: "history",
        path: "history",
        component: () => import("pages/Dashboard/History.vue")
      },
      {
        name: "convert",
        path: "convert",
        component: () => import("pages/Dashboard/Convert.vue")
      },
      {
        name: "transaction",
        path: "transaction",
        component: () => import("pages/Dashboard/ManageTransaction.vue")
      },
      {
        name: "loader",
        path: "load",
        component: () => import("components/UQLoading.vue")
      },
      {
        name: "transaction_reports",
        path: "transaction/reports",
        component: () => import("pages/Dashboard/TransactionReports.vue")
      },

      //  { name: 'add_funds_history', path: 'wallet_add_funds_history_v2', component: () => import('pages/Dashboard/AddFundHistory.vue') },
    ]
  },
  {
    path: "/home",
    component: () => import("layouts/LayoutBar.vue"),
    // beforeEnter: RouteGuard.beforeEnterMember,
    children: [
      {
        name: "settings",
        path: "profile",
        component: () => import("pages/Dashboard/Profile.vue")
      }
      //  { name: 'add_funds_history', path: 'wallet_add_funds_history_v2', component: () => import('pages/Dashboard/AddFundHistory.vue') },
    ]
  },
  {
    path: "/developer",
    component: () => import("layouts/DeveloperLayout.vue"),
    children: [
      {
        name: "developer_dashboard",
        path: "dashboard",
        component: () => import("pages/Developer/DeveloperDashboard.vue")
      },
      {
        name: "developer_database",
        path: "database",
        component: () => import("pages/Developer/DeveloperDatabase.vue")
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
