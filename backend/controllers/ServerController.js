const ServerClass   = require('../classess/ServerClass');

module.exports = {
    get_date (req, res)
    {
        res.json({
            message: 'success',
            data: ServerClass.get_date()
        })
    }
}