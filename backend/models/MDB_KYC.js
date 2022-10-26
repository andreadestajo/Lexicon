const MONGOOSE = require('../config/mongo');
const MODEL = require('./MODEL');
const Schema = MONGOOSE.Schema;

const schema = new Schema({
    user_id:
    {
        type: String,
        required: true
    },
    last_name:
    {
        type: String,
        default: ''
    },
    first_name:
    {
        type: String,
        default: ''
    },
    middle_name:
    {
        type: String,
        default: ''
    },
    gender:
    {
        type: String,
        default: ''
    },
    nationality:
    {
        type: String,
        default: ''
    },
    contact_code: {
        type: String,
        default: ''
    },
    contact:
    {
        type: String,
        default: ''
    },
    birthday: {
        type: Date,
        default: null
    },
    house_number: {
        type: String,
        default: ''
    },
    street_address:
    {
        type: String,
        default: ''
    },
    city:
    {
        type: String,
        default: ''
    },
    country:
    {
        type: String,
        required: true
    },
    zip_code:
    {
        type: String,
        default: ''
    },
    identification_card:
    {
        type: String,
        default: ''
    },
    id_image_path: {
        type: String,
        default: ''
    },
    selfie_image_path:
    {
        type: String,
        default: ''
    },
    id_number: {
        type: String,
        default: ''
    },
    has_id_expiry: {
        type: Boolean,
        default: true
    },
    id_expiry: {
        type: Date,
        default: null
    },
    security_question: {
        type: String,
        default: ''
    },
    security_answer: {
        type: String,
        default: ''
    },
    step: {
        type: Number,
        min: 1,
        max: 7,
        default: 1
    },
    status: {
        type: String,
        default: '',
        index: true
    },
    date_created: {
        type: Date,
        default: null
    },
    date_modified: {
        type: Date,
        default: null
    },
    remarks: {
        type: String,
        default: ''
    }
});

class MDB_KYC extends MODEL {
    constructor() {
        super('kyc', schema);
    }

    async findByUserId(user_id) {
        const res = await this.collection.findOne({ user_id });
        return res ? res.toJSON() : null;
    }

    async findByUserIdAndUpdate(user_id, update = {}) 
    {
        const res = await this.collection.findOneAndUpdate({user_id}, update, {
            new: true
        });
        return res ? res : null;
    }
  
    async findByUserIdFiltered(user_id)
    {
        const res   = await this.collection.findOne({ user_id: user_id }, "security_question security_answer" );
        return res ? res : null;
    }

    async findByIdNumber(id_number)
    {
        // console.log('user_id')
        // console.log(user_id)
        const res = await this.collection.findOneAndUpdate({ user_id }, update, {
            new: true
        });
        return res ? res.toJSON() : null;
    }
      
    async findByUserIdAndUpdateKycStep(user_id ,flag) 
    {
        try 
        {
            let doc = await this.collection.findOne({user_id});
            let res;
            if(flag == 0) 
            {
                doc.step--;
                res = doc.save();
            }
            else if(flag == 0) 
            {
                doc.step++;
                res = doc.save();
            }
    
            return res
        } 
        catch (error) 
        {
            return error
        }
    }
    async findByUserIdFiltered(user_id)
    {
        const res   = await this.collection.findOne({ user_id: user_id }, "security_question security_answer" );
        return res ? res : null;
    }

    async findByKycStatus(status, sort = {})
    {
        let res = {};
        try {
            let res   = await this.collection.find({status: status.toUpperCase()}).sort(sort);
            res.status = 'success'
            res.data    = res;
            return res;
        } catch (error) {
            res.status  = 'error';
            res.error   = error
            return res;
        }
    }
}
module.exports = MDB_KYC;