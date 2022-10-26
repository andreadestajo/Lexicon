const MONGOOSE  = require('../config/mongo');
const MODEL     = require('./MODEL');
const Schema    = MONGOOSE.Schema;


let schema         = new Schema({
    otp : {
        type:       String,
        required:   true
    },
    email: {
        type:       String,
        required:   true
    },
    expiration: {
        type:       Date,
        default:    Date.now,
        index: {
            unique:  true,
            expires: '5m'
          }
    },
});

class MDB_VERIFY_OTP extends MODEL {
    constructor() {
        super('verify_otp', schema);
    }

    // async addOtp(data = {}, exp)
    // {
    //     try 
    //     {
    //         this.schema = new Schema({
    //             otp : {
    //                 type:       String,
    //                 required:   true
    //             },
    //             email: {
    //                 type:       String,
    //                 required:   true,
    //                 index: {
    //                     unique:  true,
    //                     dropDups: true,
    //                 }
    //             },
    //             expiration: {
    //                 type:       Date,
    //                 default:    Date.now,
    //                 index: {
    //                     expireAfterSeconds: 60
    //                 }
    //             },
    //         });
    //         this.schema
    //         // this.schema.path('my.expiration').index({ expires: 60 });
    //         // this.schema.tree.expiration.index = {unique: true, expires: exp};
    //         // this.schema.obj.expiration.index = {unique: true, expires: exp};
    //         // console.log(this.schema.tree.expiration.index);
    //         // console.log("******************************");
    //         // console.log(this.schema.obj.expiration.index);
    //         // console.log("******************************");
    //         // console.log(this.schema.paths.expiration);
    //         // console.log(this.schema)

    //         const collection     = this.collection;
    //         // sets object to insert
    //         const modelObj       = new collection(data);

    //         // confirms the insertion
    //         const modelRes       = await modelObj.save();

    //         return modelRes;
            
    //     } 
    //     catch (error) 
    //     {
    //         console.log(error);
    //         return error;
    //     }
    // }

    async findByEmailAndOtp(email, otp)
    {
        const res = await this.collection.findOne({ email: email, otp: otp });
        return res ? res.toJSON() : null;
    }
}

module.exports = MDB_VERIFY_OTP;