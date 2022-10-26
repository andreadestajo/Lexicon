<template>
  <q-card id="hedge__container">
    <!-- Form -->

    <q-form @submit="confirm = true">
      <div
        class="text-center text-h6 q-mb-md bg-default color-default"
        id="header-h6"
        style="border-radius: 20px 20px 0 0"
      >
        <p class="deposit-css q-py-lg">
          <b>HEDGE FUND</b>
        </p>
      </div>
      <div class="q-pa-md">
        <div class="justify-center row">
          <p class="bg-amber-2 text-center q-pa-md" style="width: 60%; border-radius: 5px">
            <b>
              Note: Minimum Investement amount is USD 200,000.00.
              <br />Minimun Annual Return is 10%.
              <br />(Lexicon Bank will contact you regarding the final rate.)
            </b>
          </p>
        </div>
        <div class="text-h5 font-raleway q-mb-md">
          <b>Choose your Investment Fund</b>
        </div>

        <div style="cursor: pointer;">
          <div
            outline
            style="height: 80px; padding: 20px; margin-bottom: 10px;"
            class="active-wallet-hedge"
            :v-model="asian_fund"
            @click="go(asian_fund)"
          >
            <div class="row">
              <div class="col flex flex-center q-ml-lg">
                <strong
                  class="q-mr-lg font-bebas"
                  id="fund-text"
                  style=" font-weight: 400;"
                >Asian Fund</strong>
              </div>
              <q-separator vertical />
              <div class="col flex flex-center">
                <span style="font-size: 20px; font-weight: 450;" class="font-raleway">USD</span>
              </div>
            </div>
          </div>

          <div
            :v-model="sterling_fund"
            @click="go(sterling_fund)"
            outline
            style="height: 80px; padding: 20px; margin-bottom: 10px;"
            class="active-wallet-hedge"
          >
            <div class="row">
              <div class="col flex flex-center q-ml-lg">
                <strong
                  class="q-mr-lg font-bebas fund-text-sterling"
                  style=" font-weight: 400;"
                >Sterling Fund</strong>
              </div>
              <q-separator vertical />
              <div class="col flex flex-center">
                <span style="font-size: 20px; font-weight: 450;" class="font-raleway">GBP</span>
              </div>
            </div>
          </div>

        <div
            :v-model="euro_fund"
            @click="go(euro_fund)"
            outline
            style="height: 80px; padding: 20px; margin-bottom: 10px;"
            class="active-wallet-hedge"
          >
            <div class="row">
              <div class="col flex flex-center q-ml-lg">
                <strong
                  id="fund-text"
                  class="q-mr-lg font-bebas"
                  style="font-weight: 400;"
                >EURO FUND</strong>
              </div>
              <q-separator vertical />
              <div class="col flex flex-center">
                <span style="font-size: 20px; font-weight: 450;" class="font-raleway">EUR</span>
              </div>
            </div>
          </div>
        </div>

        <!-- end of version 2 -->

        <!-- end of pop up button -->
      </div>
    </q-form>
    <!-- end of form -->
    <!-- Dialog Confirmation -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="question_answer" color="accent" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to proceed to hedge fund?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <div class="text-center">
            <q-btn
              flat
              type="submit"
              color="accent"
              unelevated
              class="full-width"
              @click="submitHandler"
            >Yes</q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- end of Dialog Confirmation -->
    <!-- Sent Success Message -->
    <q-dialog v-model="alert" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 800px; max-width: 80vw;">
        <div class="text-center text-h6 q-mb-md bg-default color-default" id="header-h6">
          <p class="deposit-css q-py-lg">
            <b>{{form_data.fund_type}}</b>
            <q-btn
              v-close-popup
              @click="cancelBtn()"
              icon="fas fa-times"
              round
              size="19px"
              class="close-btn-ico flex q-mr-md float-right"
              unelevated
            ></q-btn>
          </p>
        </div>
        <q-card-section class="text-center q-pb-none q-pa-md">
          <div
            class="text-h6 q-mt-md font-raleway text-weight-bolder"
          >From which account(s) do you want to fund your investment?</div>
        </q-card-section>
        <q-card-section class="text-center">
          <div>
            <div class="q-pa-sm">
              <div>
                <div v-for="wallet in wallet_details" :key="wallet._id">
                  <div v-if="wallet.balance > 0">
                    <div class="cont-shadows q-mb-md q-pa-md">
                      <div class="row q-col-gutter-lg">
                        <div class="col-12 col-sm-3 q-mt-lg text-left">
                          <span class="text-h6">
                            <b id="currency-move" class="q-mr-xs">
                              {{wallet.currency }} {{(wallet.balance / 10 ** wallet.decimal_places).toLocaleString("en-US", {
                              minimumFractionDigits:wallet.decimal_places, maximumFractionDigits: wallet.decimal_places})}}
                            </b>
                            <q-icon id="mobile-exchange" size="15px" name="fas fa-exchange-alt"></q-icon>
                          </span>
                        </div>
                        <div id="desktop-exchange" class="col-12 col-sm-2 q-mt-lg">
                          <q-icon size="15px" name="fas fa-exchange-alt"></q-icon>
                        </div>
                        <div class="col-12 col-sm-3 text-right q-mt-lg">
                          <span class="text-h6 q-ml-sm" style="color: #21ba45;">
                            <b>USD {{ (wallet.balance / 10 ** wallet.decimal_places * conversion[wallet.currency]).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2 }) }}</b>
                          </span>
                        </div>
                        <div class="col-12 col-sm-4">
                          <q-input
                            outlined
                            v-model.number="indiv_amount[wallet.currency]"
                            @input="proceed()"
                            label="Amount in USD"
                            mask="#.##"
                            type="text"
                            class="q-mt-md"
                            fill-mask="0"
                            reverse-fill-mask
                            color="accent"
                            :rules="[
                  val => val < wallet.balance / 10 ** wallet.decimal_places * conversion[wallet.currency] || 'Insufficient Balance']"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- desktop balance and routes -->
              <div id="desktop-balance-container" class="row">
                <div class="col">
                  <div class="text-left">
                    <span id="balance-label-text" class="text-h6">
                      Total Balance:
                      <b>
                        USD
                        {{(remainingWallet).toLocaleString("en-US", {
                        minimumFractionDigits:2, maximumFractionDigits: 2})}}
                      </b>
                    </span>
                  </div>
                  <div class="text-left">
                    <span id="balance-label-text" class="text-h6">
                      Total Investment:
                      <b>
                        USD
                        {{totalInvested.toLocaleString("en-US", {
                        minimumFractionDigits:2, maximumFractionDigits: 2})}}
                      </b>
                    </span>
                  </div>
                </div>

                <!-- routes -->
                <div class="col">
                  <q-card-actions align="right" class="bg-white" id="btn-status-cancel">
                    <q-btn
                      label="Proceed"
                      style="width: 65%"
                      @click="submitHandler()"
                      class="q-mb-md bg-default color-default"
                    />
                    <!-- <q-btn label="Cancel " @click="cancelBtn()" class color="accent" outline v-close-popup /> -->
                  </q-card-actions>
                </div>
              </div>

              <!-- mobile balance and routes -->
              <div id="mobile-balance-container" class="column">
                <div class="col">
                  <div class="text-left">
                    <span id="balance-label-text" class="text-h6">
                      Total Balance:
                      <b>
                        USD
                        {{(remainingWallet).toLocaleString("en-US", {
                        minimumFractionDigits:2, maximumFractionDigits: 2})}}
                      </b>
                    </span>
                  </div>
                  <div class="text-left">
                    <span id="balance-label-text" class="text-h6">
                      Total Investment:
                      <b>
                        USD
                        {{totalInvested.toLocaleString("en-US", {
                        minimumFractionDigits:2, maximumFractionDigits: 2})}}
                      </b>
                    </span>
                  </div>
                </div>

                <!-- routes -->
                <div class="col">
                  <q-card-actions class="bg-white" id="btn-status-cancel">
                    <q-btn
                      label="Proceed"
                      @click="submitHandler()"
                      class="q-mb-md bg-default color-default full-width"
                    />
                    <!-- <q-btn label="Cancel " @click="cancelBtn()" class color="accent" outline v-close-popup /> -->
                  </q-card-actions>
                </div>
              </div>
            </div>
          </div>
          <!-- End of  Check status and Cancel Button -->
        </q-card-section>
        <!-- End of Sent Success Message -->
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import fiat from "../references/fiat";
import hedgeFundList from "../references/hedge_fund_list";
import { postHedgeFund2, postWalletDetailsOptions } from "../references/url";

export default {
  // props: ["abbreviation"],
  data: () => ({
    indiv_amount: {},
    asian_fund: " Asian Fund",
    sterling_fund: "Sterling Fund",
    euro_fund: "Euro Fund",
    invested: 0,
    hedgeFundList: hedgeFundList,
    alert: false,
    hedge_fund_list: "USD",
    form_data: {
      amount: "",
      abbreviation: "",
      fund_type: "",
    },
    from_options: [],
    balance: [],
    decimal: [],
    options: [],
    wallet_details: {},
    total_wallet: 0,
    conversion: {},
    confirm: false,
    update_data: null,
    add_fund_info: "",
    fiatOptions: fiat,
    is_show_send_success: false,
    is_show_error: false,
    is_show_error_2: false,
    a: 0,
    remainingBalance: 0,
  }),
  components: {},
  async mounted() {
    await this.viewWalletOptions();
  },
  computed: {
    totalInvested() {
      return this.a;
    },
    remainingWallet() {
      this.remainingBalance = this.total_wallet - this.a;
      if (this.remainingBalance <= 0) {
        this.remainingBalance = 0;
      }
      return this.remainingBalance;
    },
  },
  methods: {
    async cancelBtn() {
      this.indiv_amount = {};
    },
    async go(fundType) {
      if (fundType == "Sterling Fund") {
        this.form_data.abbreviation = "GBP";
      } else if (fundType == "Euro Fund") {
        this.form_data.abbreviation = "EUR";
      } else {
        this.form_data.abbreviation = "USD";
      }
      this.alert = true;
      this.form_data.fund_type = fundType;

      // console.log(fundType);
      // console.log("WEW");
    },
    async getIndex(index, currency) {
      this.indiv_amount[index].currency = currency;
    },
    async proceed() {
      this.a = Object.values(this.indiv_amount).reduce((total, num) => {
        return total + num;
      });
    },

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

        if (this.wallet_details[i].currency == "USD") {
          this.total_wallet +=
            this.wallet_details[i].balance /
            10 ** this.wallet_details[i].decimal_places;
        } else {
          this.total_wallet +=
            (this.wallet_details[i].balance /
              10 ** this.wallet_details[i].decimal_places) *
            this.conversion[this.wallet_details[i].currency];
        }
      }
    },
    async submitHandler() {
      // alert("kahit ano");
      if (this.remainingBalance >= 25000 && this.a >= 200000) {
        this.$q.loading.show();
        this.form_data.indiv_amount = this.indiv_amount;
        this.form_data.amount = this.a;
        this.form_data.fund_type = this.form_data.fund_type.toUpperCase();
        console.log(this.form_data);

        let res = await this.$_post(postHedgeFund2, this.form_data);

        this.$q.loading.hide();
        if (res.data.message == "success") {
          this.triggerPositiveCanceled("top", `${this.form_data.fund_type}`);
          this.add_fund_info = res.data;
          this.$router.push({ name: "dashboard" });
        }
      } else if (this.remainingBalance < 25000) {
        this.triggerRemainingBalance("top");
      } else if (this.a < 200000) {
        this.triggerMin("top");
      } else {
      }
    },

    triggerMin(position) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `Minimun investment must be 200,000 USD`,
      //   position,
      // });
      this.$q.notify({
        message:
          '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Minimun investment must be USD 200,000.</div>',
        position: "top",
        color: "white",
        html: true,
      });
    },
    triggerRemainingBalance(position) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `Your balance must not less than  25,000 USD`,
      //   position,
      // });
      this.$q.notify({
        message:
          '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Your balance must not less than  USD 25,000.</div>',
        position: "top",
        color: "white",
        html: true,
      });
    },
    triggerPositiveCanceled(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Funding for ${orderNumber} complete.`,
      //   position,
      // });
      this.$q.notify({
        message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Funding for ${orderNumber} completed.</div>`,
        position: "top",
        color: "white",
        html: true,
      });
    },
    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      let res = await this.$_post(postUpdateStatus, this.add_fund_info);
      this.$q.loading.hide();
      if (res.data.message == "success") {
        this.add_fund_info.status_payment = "canceled";
        this.triggerPositiveCanceled("top", orderNumber);
      } else {
        console.log("STATUS ERROR");
      }
    },
  },
};
</script>
<style>
.deposit-css {
  font-size: 35px;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1px;
}
#hedge__container {
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
  
}
#hedge__container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#pay {
  font-weight: bolder;
}
#badge {
  background-color: white;
  color: black;
}
#amount {
  font-weight: bolder;
}
#header-h6 {
  font-size: 16px;
}
h6 {
  margin: 0;
  font-size: 14px;
}
#coins-fee {
  background-color: #d0dbd4;
  padding: 10px;
  color: black;
}

#amount-due {
  background-color: #84968b;
  padding: 10px;
  color: black;
}
#span-receive {
  color: #009e3e;
  font-weight: bold;
}
#btn-status-cancel {
  padding: 10px 0 10px 0;
}
.active-wallet-hedge {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  transition: 0.5s;
}
.active-wallet-hedge:hover {
  border-left: 8px solid #2f4c7e;
  box-shadow: 0 4px 8px 0 rgba(47, 76, 126, 0.6), 0 6px 20px 0 rgba(47, 76, 126, 0.6);
}

.currency_list {
  cursor: pointer;
}
.hide {
  display: none;
}
.btn-transactions {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  background: #2f4c7e;
  color: white;
}
.cont-shadows {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}
.close-btn-ico {
  transition: transform 0.5s;
}
.close-btn-ico:hover {
  transform: rotate(180deg);
}
#fund-text {
  font-size: 20px;
}
.fund-text-sterling {
  font-size: 20px;
}
</style>

<style>
@media (max-width: 599px) {
  #desktop-exchange {
    display: none;
  }
  #desktop-balance-container {
    display: none;
  }
  #currency-move {
    margin-left: 10px;
  }
}
@media (min-width: 598px) {
  #mobile-exchange {
    display: none;
  }
  #mobile-balance-container {
    display: none;
  }
}
@media (max-width: 783px) {
  #balance-label-text {
    font-size: 15px;
  }
}
@media (max-width: 431px) {
  #fund-text {
    font-size: 15px;
  }
  .fund-text-sterling {
    font-size: 12px;
  }
}
</style>