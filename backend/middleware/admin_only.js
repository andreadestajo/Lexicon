const jwt      = require('jsonwebtoken');
const MDB_USER = require('../models/MDB_USER');

module.exports = (req, res, next) =>
{
    let mdb_user = new MDB_USER();

    let token       = req.headers.authorization;
    let token_mixer = process.env.ADMIN_TOKEN_MIXER;

    jwt.verify(token, token_mixer, async function(err, decoded)
    {
        if (err)
        {
            return res.status(500).send({ auth: false, message: 'You are not authorized.' });
        } 
        else
        {
            let admin_info = await mdb_user.doc(decoded._id);
            req.user_info = admin_info;

            next();
        }
    });
}