const MDB_CURRENCY = require('../models/MDB_CURRENCY');

module.exports = class CurrencyClass {
	constructor(currency_information) {
		this.mdb_currency = new MDB_CURRENCY();
		this.currency_information = currency_information;
	}

	async createCurrency() {
		let res = {};

		try {

			let add_form =
			{
				is_fiat: this.currency_information.is_fiat,
				number_code: this.currency_information.number_code,
				abbreviation: this.currency_information.abbreviation,
				name: this.currency_information.name,
				decimal_places: this.currency_information.decimal_places
			}
			let exists = await this.mdb_currency.findByAbbreviation(this.currency_information.abbreviation)

			if(!exists)
			{
				res.status = "success";
				await this.mdb_currency.add(add_form);
			}
			else
			{
				res.status = "error";
				res.message = "Currency already existed.";
			}

		}
		catch (error) {
			res.status = "error";
			res.message = error.message;
		}

		return res;
	}
	async supported_currency()
	{
		let res = {};

		try
		{
			res.status = "success";
			res.data = await this.mdb_currency.findSupportedCurrency();
		}
		catch(error)
		{
			res.status = "error";
			res.message = error.message;
		}
		return res;
	}
	async getNumberCode()
	{
		let res = {};

		try
		{
			res.status = "success";
			res.data   = await this.mdb_currency.findByAbbreviation(this.currency_information.abbreviation);
		}
		catch(error)
		{
			res.status = "error";
			res.message = error.message;
		}
		return res;
	}
}