<template>
  <div>
    <!-- content -->
    <div class="cont-shadows" id="convert-container">
      <div v-if="!is_show_confirmation" class="q-gutter-md" inline>
        <div
          class="text-center text-h6 q-mb-md bg-default color-default"
          id="header-h6"
          style="border-radius: 20px 20px 0 0"
        >
          <p class="deposit-css q-py-lg">
            <b>Convert</b>
          </p>
        </div>
        <div class="q-pa-lg">
          <q-form @submit="toggleConfirmation()">
            <p class="font-raleway">Convert from:</p>

            <!-- desktop form -->
            <div id="desktop-form" class="row">
              <div class="col-3">
                <q-select
                  @input="val => { onChange() }"
                  v-model="form_data.from_currency"
                  outlined
                  :options="from_options"
                />
              </div>
              <div class="col-9">
                <q-input
                  v-model.number="form_data.amount"
                  @input="val => { amountChange() }"
                  type="text"
                  required
                  outlined
                  label="Amount to convert"
                  :rules="
                [
                  val => val * conversion[form_data.from_currency] >= 100 || 'Minimum conversion amount is $100 equivalent',
                  val => val <= balance[from_options.indexOf(form_data.from_currency)] || 'Insufficient Balance'
                ]"
                  :mask="'#.' + '#'.repeat([decimal[from_options.indexOf(form_data.from_currency)]])"
                  fill-mask="0"
                  reverse-fill-mask
                />
              </div>
            </div>

            <!-- <div class="text-right">
          <q-btn @click="fullAmount">Full Amount</q-btn>
            </div>-->

            <div class="text-right q-mt-md">
              Balance:
              <span class="q-ml-xs" style="letter-spacing: 1px; font-size:20px">
                <b>{{ balance[from_options.indexOf(form_data.from_currency)].toLocaleString('en-US', {minimumFractionDigits: decimal[from_options.indexOf(form_data.from_currency)], maximumFractionDigits: decimal[from_options.indexOf(form_data.from_currency)]}) }} {{ form_data.from_currency }}</b>
              </span>
            </div>

            <br />
            <p class="font-raleway">Convert to:</p>
            <div id="desktop-form" class="row">
              <div class="col-3">
                <q-select
                  @input="val => { onChange2() }"
                  v-model="form_data.to_currency"
                  outlined
                  :options="to_options"
                />
              </div>
              <div class="col-9">
                <q-input
                  v-model="equivalent"
                  type="text"
                  :label="fee.charge_type == 'Fixed' ? 'Equivalent (Inclusive of Transaction Fee)' : 'Equivalent'"
                  readonly
                  outlined
                />
              </div>
            </div>

            <div class="text-right q-mt-md">
              Balance:
              <span class="q-ml-xs" style="letter-spacing: 1px; font-size:20px">
                <b>{{ balance[this.from_options.indexOf(this.form_data.to_currency)].toLocaleString('en-US', {minimumFractionDigits: decimal[from_options.indexOf(form_data.to_currency)], maximumFractionDigits: decimal[from_options.indexOf(form_data.to_currency)]}) }} {{ form_data.to_currency }}</b>
              </span>
            </div>

            <!-- <div v-if="fee.charge_type == 'Fixed'">Fee: {{ '$' + fee.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
            </div>-->

            <div class="text-center q-mt-lg font-raleway" style="font-size: 18px">Conversion Rate</div>
            <hr
              style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));"
            />
            <div class="text-center font-bebas" style=" letter-spacing: 1px; font-size:20px">
              1.00 {{ form_data.from_currency }} ~ {{ (rate).toLocaleString('en-US', {minimumFractionDigits:
              rate < 1 ? 6 : decimal[from_options.indexOf(form_data.to_currency)], maximumFractionDigits: rate < 1 ? 8 : decimal[from_options.indexOf(form_data.to_currency)] }) }} {{ form_data.to_currency }}
            </div>
            <div class="q-mt-md conversion2">
              <div id="note-text" class="bg-amber-2 q-pa-lg">
                <strong>
                  Note:
                  <br />Please keep in mind that the prices of currencies are volatile. Prices may go up or go down anytime.
                </strong>
              </div>
            </div>
            <div class="text-center q-mt-md q-px-xl">
              <q-btn class="q-mb-md" type="submit" color="accent" @click="scrollWin()">Convert</q-btn>
            </div>
          </q-form>
        </div>
      </div>
      <div class="confirmation">
        <div v-if="is_show_confirmation && !is_show_send_success" class="q-pa-lg text-center texty">
          <p class="q-mt-lg">
            You are about to convert
            <strong>{{ form_data.from_currency + " " + form_data.amount.toLocaleString('en-US', {minimumFractionDigits: decimal[from_options.indexOf(form_data.from_currency)], maximumFractionDigits: decimal[from_options.indexOf(form_data.from_currency)]}) }}</strong> to
            <strong>{{form_data.to_currency + " " + equivalent }}</strong>
            <br />Click confirm to continue.
          </p>
          <div class="text-center q-mt-xl q-mb-md">
            <q-btn
              class="q-mr-sm"
              style="width: 90px"
              color="accent"
              outline
              type="button"
              @click="backToConvert"
            >Back</q-btn>
            <q-btn
              class="bg-default color-default q-ml-sm"
              type="button"
              @click="submitConversion"
            >Confirm</q-btn>
          </div>
        </div>
      </div>

        <!-- Sent Success Message -->
        <div v-if="is_show_send_success" class="q-pa-lg success__form">
          <div>
            <span class="text__title">
              <div class="row">
                <div class="col-10">
                  <span class="text-bold font-monseratt">
                  CONGRATULATIONS
                  </span>
                  <br>
                   <span class="font-monseratt">
                  Conversion was successful
                  </span>
                </div>
                <div class="col-2 text-right">
                  <q-btn
                    to="/home/dashboard"
                    icon="fas fa-times"
                    round
                    class="close-btn-ico"
                    unelevated
                  ></q-btn>
                </div>
              </div>
            </span>
          </div>
          <div style="font-size: 20px" class="q-mt-md balance-left">
            <span class="font-monseratt text-bold">
            Current Balance:
            </span>
            <br />
            <b>
              <div
                class="row q-mt-sm q-pa-sm"
              >
                <div class="col-sm-6 col-12"><span class="text-weight-regular">From</span><br>{{form_data.from_currency }}</div>
                <div class="right__left col-sm-6 col-12 q-mt-md">{{ result_from }}</div>
              </div>
              <div class="row q-pa-sm">
                <br />
                <div class="col-sm-6 col-12"><span class="text-weight-regular">To</span><br>{{form_data.to_currency }}</div>
                <div class="right__left col-sm-6 col-12 q-mt-md">{{result_to }}</div>
              </div>
            </b>
          </div>
          <div class="row q-py-md" style="font-size: 16px">
          <div class="font-monseratt text-bold col-sm-6 col-12">Transaction Date: </div>
          <div class="col-sm-6 col-12 right__left font-monseratt text-bold">{{ moment( date ).tz("Europe/London").format('MM/DD/YYYY') }} {{ moment( date ).tz("Europe/London").format('hh:mm A') }}</div>
          </div>
          <br>
          <q-separator size="2px" />
          <div class="q-pa-md text-center text-bold font-raleway">
            <i>
            Thank you for your continued patronage of the Lexicon Bank online banking platform, we will continue to serve you to the best of our abilities. Lexicon Bank uses realtime currency convertion rates to ensure that all of out client get the full benefit of the service they are using.</i>
          </div>
        </div>
      </div>
    <!-- <div v-else class="cont-shadows" id="convert-container">
      <div class="q-pa-lg text-center texty">
        <p class="q-mt-lg">
          You currently have one (1) account as of now.
          <br />Please add an account to access this feature.
        </p>
      </div>
    </div> -->
  </div>
</template>
<script>
import {
  postConvertCurrency,
  postWalletDetailsOptions,
  postViewOneFee,
  postWalletDetails,
} from "../references/url";
import moment from "moment-timezone";

export default {
  data: () => ({
    form_data: {
      from_currency: "",
      to_currency: "",
      amount: 0,
    },
    equivalent: 0,
    from_options: [],
    to_options: [],
    wallet_details: {},
    conversion: {},
    balance: [],
    decimal: [],
    fee: [],
    rate: 0,
    result_from: 0,
    result_to: 0,
    is_show_confirmation: false,
    is_show_send_success: false,
    result_from: 0,
    result_to: 0,
    date: '',
    moment: moment,
  }),
  async mounted() {
    await this.viewOneFee();
    await this.viewWalletOptions();
  },
  methods: {
    async viewWalletOptions() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        this.wallet_details = response.data.wallet;
        this.conversion = response.data.conversion;
      });
      for (let i = 0; i < this.wallet_details.length; i++) {
        this.from_options.push(this.wallet_details[i].currency);
        this.balance.push(
          this.wallet_details[i].balance /
            10 ** this.wallet_details[i].decimal_places
        );
        this.decimal.push(this.wallet_details[i].decimal_places);
      }
      this.to_options = [...this.from_options];
      // let obj = this.$store.state.user.selected_currency;
      this.form_data.from_currency = this.from_options[0];
      this.to_options.splice(
        this.from_options.indexOf(this.form_data.from_currency),
        1
      );
      this.form_data.to_currency = this.to_options[0];

      if (this.fee.charge_type == "Percentage") {
        this.rate =
          (((100 - this.fee.value) / 100) *
            this.conversion[this.form_data.from_currency]) /
          this.conversion[this.form_data.to_currency];
      } else {
        this.rate =
          this.conversion[this.form_data.from_currency] /
          this.conversion[this.form_data.to_currency];
      }
    },

    async viewOneFee() {
      this.$q.loading.show();
      let res = await this.$_post(postViewOneFee, { fee_type: "Conversion" });
      this.fee = res.data;
      this.$q.loading.hide();
    },

    async onChange() {
      this.to_options = [...this.from_options];
      this.to_options.splice(
        this.from_options.indexOf(this.form_data.from_currency),
        1
      );
      this.form_data.to_currency = this.to_options[0];
      // this.form_data.amount = 0;
      // this.equivalent = null;

      if (this.fee.charge_type == "Percentage") {
        this.rate =
          (((100 - this.fee.value) / 100) *
            this.conversion[this.form_data.from_currency]) /
          this.conversion[this.form_data.to_currency];
      } else {
        this.rate =
          this.conversion[this.form_data.from_currency] /
          this.conversion[this.form_data.to_currency];
      }
      await this.amountChange();
    },

    async onChange2() {
      // this.form_data.amount = null;
      // this.equivalent = null;

      if (this.fee.charge_type == "Percentage") {
        this.rate =
          (((100 - this.fee.value) / 100) *
            this.conversion[this.form_data.from_currency]) /
          this.conversion[this.form_data.to_currency];
      } else {
        this.rate =
          this.conversion[this.form_data.from_currency] /
          this.conversion[this.form_data.to_currency];
      }
      await this.amountChange();
    },

    async amountChange() {
      let charge =
        this.fee.value / this.conversion[this.form_data.from_currency];
      if (this.fee.charge_type == "Percentage") {
        this.equivalent = (this.form_data.amount * this.rate).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: this.decimal[
              this.from_options.indexOf(this.form_data.to_currency)
            ],
            maximumFractionDigits: this.decimal[
              this.from_options.indexOf(this.form_data.to_currency)
            ],
          }
        );
      } else if (
        this.fee.charge_type == "Fixed" &&
        this.form_data.amount > charge
      ) {
        this.equivalent = (
          (this.form_data.amount - charge) *
          this.rate
        ).toLocaleString("en-US", {
          minimumFractionDigits: this.decimal[
            this.from_options.indexOf(this.form_data.to_currency)
          ],
          maximumFractionDigits: this.decimal[
            this.from_options.indexOf(this.form_data.to_currency)
          ],
        });
      } else if (!this.fee.charge_type) {
        this.equivalent = (this.form_data.amount * this.rate).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: this.decimal[
              this.from_options.indexOf(this.form_data.to_currency)
            ],
            maximumFractionDigits: this.decimal[
              this.from_options.indexOf(this.form_data.to_currency)
            ],
          }
        );
      } else {
        this.equivalent = 0;
      }
    },

    async submitConversion() {
      this.$q.loading.show();
      let res = await this.$_post(postConvertCurrency, this.form_data);
      this.date = res.data.date;

      // this.date = moment(  ).tz("Europe/London").format('mm/dd/yyyy, hh:mm A');

      let from = await this.$_post(postWalletDetails, {
        abbreviation: this.form_data.from_currency,
      });
      let to = await this.$_post(postWalletDetails, {
        abbreviation: this.form_data.to_currency,
      });
      this.$q.loading.hide();

      if (res) {
        let from_index = this.from_options.indexOf(
          this.form_data.from_currency
        );
        let to_index = this.from_options.indexOf(this.form_data.to_currency);

        // this.result_from = (((this.balance[from_index] * 10 ** this.decimal[from_index]) - Math.floor(this.form_data.amount * 10 ** this.decimal[from_index])) / 10 ** this.decimal[from_index]).toLocaleString('en-US', {minimumFractionDigits: this.decimal[from_index], maximumFractionDigits: this.decimal[from_index]});

        // this.result_to = (((this.balance[to_index] * 10 ** this.decimal[to_index]) + Math.floor(this.form_data.amount * this.rate * 10 ** this.decimal[to_index])) / 10 ** this.decimal[to_index]).toLocaleString('en-US', {minimumFractionDigits: this.decimal[to_index], maximumFractionDigits: this.decimal[to_index]});

        this.result_from = (
          from.data.balance.balance /
          10 ** this.decimal[from_index]
        ).toLocaleString("en-US", {
          minimumFractionDigits: this.decimal[from_index],
          maximumFractionDigits: this.decimal[from_index],
        });

        this.result_to = (
          to.data.balance.balance /
          10 ** this.decimal[to_index]
        ).toLocaleString("en-US", {
          minimumFractionDigits: this.decimal[to_index],
          maximumFractionDigits: this.decimal[to_index],
        });

        this.is_show_send_success = true;
      }
    },

    async toggleConfirmation() {
      this.is_show_confirmation = !this.is_show_confirmation;
      window.scrollTo(0, 0);
    },

    async backToConvert() {
      this.is_show_confirmation = !this.is_show_confirmation;
      this.form_data.amount = 0;
      this.equivalent = 0;
    },

    async fullAmount() {
      this.form_data.amount = this.balance[
        this.from_options.indexOf(this.form_data.from_currency)
      ];
    },
        scrollWin() {
        window.scrollTo(0, 0);
      }
  },
};
</script>

<style>
.success__form {
  background-image: url(../../public/icons/lexicon07-opacity.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100px 100px;
}
.text__title {
  font-size: 23px;
}
.right__left
{
  text-align: right;
}
.conversion2 {
  padding: 0 130px;
}
.texty {
  font-size: 20px;
}
.close-btn-ico {
  transition: transform 0.5s;
}
.close-btn-ico:hover {
  transform: rotate(180deg);
}
#convert-container {
  background: white;
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
#convert-container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
</style>

<style>
@media (max-width: 795px) {
  .conversion2 {
    padding: 0 90px;
  }
}
@media (max-width: 737px) {
  .conversion2 {
    padding: 0 50px;
  }
}
@media (max-width: 665px) {
  .conversion2 {
    padding: 0 20px;
  }
  @media (max-width: 599px) {
          .right__left
      {
        text-align: left;
      }
       .text__title {
        font-size: 18px;
      }
  }
}
</style>