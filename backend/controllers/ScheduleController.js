const WalletClass = require('../classess/WalletClass');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;


const scheduleSave = new CronJob('*/5 * * * *', async () =>
{
	let wallet_class = new WalletClass();
	await wallet_class.saveConversion();
}, null, false)
scheduleSave.start();

const scheduleResetLimit = new CronJob('0 7 * * *', async () =>
{
	let wallet_class = new WalletClass();
	await wallet_class.resetDailyLimit();
}, null, false)
scheduleResetLimit.start();

module.exports = 
{
	async setTimeSchedule(req, res)
	{
		let body = req.body.time;
		try
		{
			let time;
			if(body === "5 minutes")
			{
				time = "*/5 * * * *"
			}
			else if(body === "10 minutes")
			{
				time = "*/10 * * * *"
			}
			else if(body === "15 minutes")
			{
				time = "*/15 * * * *"
			}
			else if(body === "20 minutes")
			{
				time = "*/20 * * * *"
			}
			else if(body === "30 minutes")
			{
				time = "*/30 * * * *"
			}
			else
			{
				time = "0 * * * *"
			}
			res.send({ message: "success" });
			await module.exports.saveTime(body);
			scheduleSave.setTime(new CronTime(time));
			return scheduleSave.start();
		}
		catch(error)
		{
			res.status(400).send({ message: error.message });
		}
	},

	async saveTime(frequency)
	{
		let wallet_class = new WalletClass({ frequency: frequency });
		await wallet_class.saveFrequency();
	}
}

