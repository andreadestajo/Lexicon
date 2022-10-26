module.exports =
    [
        {
            key: 'documentation_landing',
            label: 'Introduction',
            icon: 'fa fa-question',
            route: 'documentation_landing',
        },
        // {
        //     key: 'authenticator',
        //     label: 'Authenticator',
        //     icon: 'fa fa-key',
        //     route: 'authentication',
        // },
        {
            key: 'landing',
            label: 'Landing Page',
            icon: 'fa fa-home',
            sub:
                [
                    { label: 'Login & Logout', route: 'documentation_login' },
                    { label: 'Registration', route: 'documentation_registration' },
                    { label: 'Forgot Password', route: 'documentation_forgot_password' },
                    { label: 'Reset Password', route: 'documentation_reset_password' },
                    { label: 'Contact Us Form', route: 'documentation_contact_us' },
                    { label: 'KYC', route: 'documentation_kyc' },
                    { label: 'SMS', route: 'documentation_sms' }
                ]
        },
        {
            key: 'member',
            label: 'Member',
            icon: 'fa fa-users',
            sub:
                [
                    { label: 'Update Profile', route: 'documentation_update_profile' },
                    { label: 'Change Password', route: 'documentation_change_password' },
                    { label: 'KYC', route: 'documentation_kyc' },
                    { label: 'Notification', route: 'documentation_notification' },
                    { label: 'Account Verification', route: 'account_verification' }
                ]
        },
        {
            key: 'admin',
            label: 'Admin',
            icon: 'fa fa-users',
            sub:
                [
                    { label: 'KYC Submits', route: 'admin_kyc' },
                    { label: 'Add Funds History', route: 'documentation_admin_add_funds_history' },
                    { label: 'Reports', route: 'documentation_admin_reports' },
                    { label: 'Add Currency', route: 'documentation_admin_add_currency' },
                    { label: 'Conversion Frequency', route: 'documentation_admin_conversion_frequency' },
                    { label: 'Fees', route: 'documentation_admin_update_fee' },
                    { label: 'User Rights', route: 'user_rights' },
                    { label: 'Admin Login', route: 'admin_login' },
                    { label: 'Permissions', route: 'permissions' },
                    { label: 'Transaction Approval', route: 'admin_transaction_approval' },
                    { label: 'Add Account', route: 'admin_add_account' },
                    { label: 'Hedge Fund ', route: 'documentation_admin_hedge_fund' },
                ]
        },
        {
            key: 'wallet',
            label: 'Wallet',
            icon: 'fa fa-wallet',
            sub:
                [
                    // { label: 'Send', route: 'documentation_wallet_send' },
                    // { label: 'Receive', route: 'documentation_wallet_receive' },
                    { label: 'Dashboard', route: 'documentation_dashboard' },
                    { label: 'Transaction History', route: 'documentation_wallet_history' },
                    { label: 'Add Funds', route: 'documentation_add_funds' },
                    { label: 'Add Funds V.2', route: 'documentation_add_funds_v2' },
                    { label: 'Add Funds History', route: 'documentation_add_funds_history' },
                    { label: 'Forgot Security via OTP', route: 'documentation_reset_security_otp' },
                    { label: 'Forgot Security via Id Number', route: 'documentation_reset_security_id_number' },
                    { label: 'Manage Transactions', route: 'documentation_manage_transactions' },
                    { label: 'Hedge Fund', route: 'documentation_hedge_fund' },
                    { label: 'Hedge Fund', route: 'documentation_hedge_fund' },
                    { label: 'Hedge Fund 2', route: 'documentation_hedge_fund_2' },
                    { label: 'Hedge Fund 3', route: 'documentation_hedge_fund_3' },
                    { label: 'Transaction Reports', route: 'documentation_transaction_reports' },
                ]
        },
    ]
