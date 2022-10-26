const dotenv = require('dotenv').config();
const ip = require('ip');
const moment = require('moment-timezone');

module.exports = class ServerClass {
    constructor() {

    }

    static async is_staging_server() {
        try {
            if (dotenv.error) {
                throw dotenv.error;
            }
            const localhost = ip.address();
            const staging_ip_address = process.env.SERVER_HOST;
            return await localhost == staging_ip_address ? true : false;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static get_date() {
        return new Date();
    }
}