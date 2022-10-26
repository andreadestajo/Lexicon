<template>
  <div
    style="background: white;"
    id="external__container"
  >
    <!-- Send Component -->
    <div v-if="is_show_send_security == false">
      <div>
        <!-- Balance -->
        <div class="text-center icon bg-default color-default" style="border-radius: 20px 20px 0 0">
          <!-- <i class="fa fa-wallet q-mr-sm"></i> -->
          <span id="balance">
            <div id="header-h6">
              <b>
                <p class="deposit-css-transfer q-py-md font-bebas">WIRE TRANSFER</p>
              </b>
            </div>
          </span>
        </div>

        <div class="wire-cont">
          <div class="text-left">
            <!-- <i class="fa fa-wallet q-mr-sm"></i> -->
            <div class="q-pl-md q-mb-lg text-left">
              <span id="balance-title" class="q-mr-sm">Balance:</span>
              <strong
                id="wire-balance"
              >{{ currency_balance.toLocaleString('en-US', {minimumFractionDigits: decimal, maximumFractionDigits: decimal}) }}</strong>
              <q-badge align="top" style="background: transparent;" class="text-black">{{ tab }}</q-badge>
              <div v-if="tab != 'USD'" style="font-size: 12px">
                <i class="fas fa-exchange-alt"></i>
                {{ "USD " + (currency_balance * conversion[tab]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
              </div>
            </div>
          </div>

          <div>
            <q-form @submit="initialSendCheck()">
              <div class="row q-col-gutter-sm">
                <div class="col-sm-6 col-12 q-mb-md">
                  <q-select
                    class="full-width font-monseratt"
                    outlined
                    v-model="tab"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    behavior="menu"
                    label="Currency"
                    :rules="[val => !!val || '* Field is required']"
                    :options="currency_list"
                    @input="updateWalletInfo"
                    style="width: 250px"
                  ></q-select>
                </div>
                <div class="col-sm-6 col-12 q-mb-md">
                  <q-select
                    class="full-width font-monseratt"
                    outlined
                    v-model="form_data.bank"
                    use-input
                    hide-selected
                    color="accent"
                    fill-input
                    input-debounce="0"
                    behavior="menu"
                    label="Bank"
                    :rules="[val => !!val || '* Field is required']"
                    :options="banks_list"
                    @filter="filterFn"
                    style="width: 250px"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey font-monseratt">No results</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="field col-sm-6 col-12 q-mb-md">
                  <q-input
                    v-model="form_data.account_name"
                    type="text"
                    label="Account Name"
                    required
                    outlined
                    :rules="[val => !!val || '* Field is required']"
                  />
                </div>
                <div class="field col-sm-6 col-12 q-mb-md">
                  <q-input
                    v-model="form_data.account_number"
                    type="text"
                    label="Account Number"
                    required
                    color="accent"
                    outlined
                    :rules="[val => !!val || '* Field is required']"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="field col-sm-6 col-12 q-mb-md">
                  <q-input
                    outlined
                    v-model.number="form_data.amount"
                    label="Amount"
                    mask="#.##"
                    fill-mask="0"
                    reverse-fill-mask
                    color="accent"
                    min="0"
                    step="any"
                    :prefix="tab"
                    required
                    :rules="
                    [
                      val => val * conversion[tab] >= 100 || 'Minimum amount should be equivalent to USD 100.00',
                      val => val < currency_balance || 'Insufficient Balance'
                    ]"
                  />
                </div>
                <div class="field col-sm-6 col-12 q-mb-md">
                  <q-input
                    v-model="form_data.remarks"
                    label="Remarks (optional)"
                    outlined
                    color="accent"
                  />
                </div>
              </div>
              <div class="text-right q-mt-md">
                <q-btn
                  type="submit"
                  style="border-radius: 30px; width: 150px"
                  class="bg-default color-default q-mb-xl"
                  unelevated
                  @click="scrollWin()"
                >Send</q-btn>
              </div>
            </q-form>
          </div>
          <!-- <div v-else>
          <h5>NOT YET AVAILABLE FOR CRYPTO</h5>
          </div>-->
        </div>
      </div>
    </div>
    <!-- End of Send Component -->

    <!-- Security Question and Password Form -->
    <div
      v-if="is_show_send_security == true && is_show_send_success == false && is_show_send_attempt == false"
      class="q-mt-lg"
      id="security-question"
    >
      <q-form @submit="sendCurrency()">
        <div>
          <label class="font-size-standard">Security Question & Password Validation</label>
          <q-select
            filled
            v-model="form_data.security_question"
            :options="questions_list"
            class="q-mt-sm"
          />
          <q-input
            v-model="form_data.security_answer"
            type="text"
            outlined
            label="Answer"
            :rules="[val => !!val || '* Field is required']"
            class="q-mt-md"
          />
        </div>
        <div class="q-mt-md">
          <q-input
            v-model="form_data.password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            outlined
            :rules="[val => !!val || '* Field is required']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>

        <!-- Error Message -->
        <div>
          <div v-if="send_attempt == 1">
            <span style="color: red">Warning: 2 Remaining Attempts.</span>
          </div>
          <div v-if="send_attempt == 2">
            <span style="color: red">Warning: 1 Remaining Attempts.</span>
          </div>
        </div>
        <!-- End of Error Message -->

        <div class="q-mt-md">
          <q-btn
            type="submit"
            unelevated
            class="full-width bg-default color-default"
            :loading="loading2"
          >Submit</q-btn>
        </div>
      </q-form>
    </div>

    <!-- Sent Success Message -->
    <div v-if="is_show_send_success == true" class="q-pa-lg">
      <div class="q-pa-md">
        <div class="text-left">
          <span
            class="font-raleway"
            style="font-size: 23px; font-weight: 100; letter-spacing: 1px;"
          >
            <div class="row">
              <div class="col-10">
                <b id="amount-title" class="q-ml-md">Wire Transfer - In Process</b>
              </div>
              <div class="col-2 text-right">
                <q-btn
                  @click="backToDashboard()"
                  icon="fas fa-times"
                  class="close-btn-ico"
                  round
                  id="close-btn-amount"
                  unelevated
                ></q-btn>
              </div>
            </div>
          </span>
          <br />
        </div>
        <div style="background: #f6f6f6; font-size: 20px" class="q-pa-md">
          <span>
            <div class="q-pb-sm">
              <span id="amount-details-text" class="float-left">Balance:</span>
              <strong id="amount-details-text" class="float-right">
                {{ res.data.currency_abbreviation }} {{ (res.data.balance_after / 10 ** res.data.decimal_places).toLocaleString("en-US", {
                minimumFractionDigits: res.data.decimal_places, maximumFractionDigits: res.data.decimal_places
                })
                }}
              </strong>
            </div>
          </span>
          <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Sent:</span>
              <strong id="amount-details-text" class="float-right">
                <!-- {{ res.data.amount }} -->
                {{ res.data.currency_abbreviation }} {{ (res.data.amount / 10 ** res.data.decimal_places).toLocaleString("en-US", {
                minimumFractionDigits: res.data.decimal_places, maximumFractionDigits: res.data.decimal_places
                })
                }}
              </strong>
            </div>
          </span>
          <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Bank:</span>
              <strong id="amount-details-text" class="float-right">{{ res.data.bank }}</strong>
            </div>
          </span>
          <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Account Name:</span>
              <strong id="amount-details-text" class="float-right">{{ res.data.account_name }}</strong>
            </div>
          </span>
          <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Account Number:</span>
              <strong id="amount-details-text" class="float-right">{{ res.data.account_number }}</strong>
            </div>
          </span>
          <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Date & Time:</span>
              <!-- <strong id="amount-details-text" class="float-right">
                {{ moment(res.data.date_created).format('DD-MMM-YYYY') }} -
                {{ new Date(res.data.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}
              </strong> -->
              <strong id="amount-details-text" class="float-right">
                {{ moment(res.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} -
                {{ moment(res.data.date_created).tz("Europe/London").format('HH:mm') }}
              </strong>
            </div>
          </span>
          <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Reference Code:</span>
              <strong id="amount-details-text" class="float-right">{{ res.data.reference_number }}</strong>
            </div>
          </span>
          <!-- <br />
          <q-separator />
          <span>
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Status:</span>
              <strong id="amount-details-text" class="float-right">{{ res.data.status }}</strong>
            </div>
          </span>-->
          <br />
          <q-separator />
          <span v-if="res.data.remarks !== '' ">
            <div class="q-pb-lg q-pt-sm">
              <span id="amount-details-text" class="float-left">Remarks:</span>
              <strong id="amount-details-text" class="float-right">{{ res.data.remarks }}</strong>
            </div>
          </span>
        </div>
      </div>
      <div class="q-mt-md"></div>
    </div>

    <!-- Sending Disabled -->
    <div class="q-py-xl" v-if="is_show_send_attempt == true">
      <span class="font-raleway" style="font-size: 20px; font-weight: 400; letter-spacing: 1px;">
        <b>Fund transfer is temporarily disabled.</b>
      </span>
      <div class="text-center q-mt-lg">
        <q-btn @click="backToDashboard()" color="accent" unelevated class="q-px-xl">OK</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  postWalletDetailsOptions,
  postVerifyExternalDetails,
  postSecurityQuestion,
  postSendErrorCounter,
  postSendAttempt,
  postWalletSendExternal,
} from "../references/url";
import sendQuestions from "../references/sendQuestion";
import banks from "../references/banks";
import moment from "moment-timezone";

export default {
  data() {
    return {
      moment: moment,
      loading2: false,
      form_data: {
        bank: "",
        account_name: "",
        account_number: "",
        amount: null,
        remarks: "",
        security_question: "Select a question",
        security_answer: "",
        password: "",
      },
      res: {},
      wallet_details: [],
      conversion: {},
      tab: "",
      decimal: 0,
      currency_balance: 0,
      currency_list: [],
      is_fiat: true,
      is_show_send_security: false,
      is_show_send_success: false,
      is_show_send_attempt: false,
      isPwd: true,
      questions_list: sendQuestions,
      banks_list: banks,
      send_attempt: 0,
    };
  },

  async mounted() {
    await this.viewWalletOptions();
    // await this.getVuexStorage();
    await this.getAllCurrency();
  },

  methods: {
    async viewWalletOptions() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        this.wallet_details = response.data.wallet;
        this.conversion = response.data.conversion;
        this.send_attempt = response.data.send_attempt;
      });

      this.tab               = this.wallet_details[0].currency;
      this.decimal           = this.wallet_details[0].decimal_places;
      this.currency_balance  = this.wallet_details[0].balance / 10 ** this.decimal;
      this.is_fiat           = this.wallet_details[0].is_fiat;
    },

    // async getVuexStorage() {
    //     let vuex_selected = this.$selected_currency;

    //     this.tab               = vuex_selected.currency ? vuex_selected.currency : this.wallet_details[0].currency;
    //     this.decimal           = vuex_selected.decimal ? vuex_selected.decimal : this.wallet_details[0].decimal;
    //     this.currency_balance  = vuex_selected.balance ? vuex_selected.balance : this.wallet_details[0].balance;
    //     this.is_fiat           = vuex_selected.is_fiat ? vuex_selected.is_fiat : this.wallet_details[0].is_fiat;
    // },

    async getAllCurrency() {
      for (let i = 0; i < this.wallet_details.length; i++) {
        this.currency_list.push(this.wallet_details[i].currency);
      }
    },

    async updateWalletInfo() {
      let index = this.wallet_details.findIndex((x) => x.currency == this.tab);
      this.decimal = this.wallet_details[index].decimal_places;
      this.currency_balance =
        this.wallet_details[index].balance / 10 ** this.decimal;
      this.is_fiat = this.wallet_details[index].is_fiat;
    },

    async filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.banks_list = banks.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );

        if (this.banks_list.length == 0) {
          this.form_data.bank = val;
        }
      });
    },

    async sendCurrency() {
      this.loading2 = true;
      this.form_data.abbreviation = this.tab;
      let res = await this.$_post(postWalletSendExternal, this.form_data);

      this.res = res;

      if (res.status == undefined) {
        let res = await this.$_post(postSendErrorCounter);
        this.send_attempt = res.data.send_attempt;

        if (this.send_attempt == 3) {
          this.is_show_send_attempt = true;

          this.$_post(postSendAttempt, {
            is_account_locked: true,
          });
        }
      } else {
        this.loading2 = false;
        this.is_show_send_success = true;
        window.scrollTo(0, 0);
      }

      this.loading2 = false;
    },

    async backToDashboard() {
      window.location.href = "https://enabler.link/lexicon/#/home/dashboard";
    },

    async initialSendCheck() {
      // this.$q.loading.show();
      this.loading2 = true;
      let res = await this.$_post(postVerifyExternalDetails, {
        receiver_public_key: this.form_data.receiver_public_key,
        abbreviation: this.tab,
        amount: this.form_data.amount,
      });

      // this.$q.loading.hide();
      this.loading2 = false;

      if (res.status == undefined) {
        this.is_show_send_security = false;
      } else {
        this.loading2 = false;
        this.is_show_send_security = true;
        window.scrollTo(0, 0);

        setTimeout(() => {
          this.$_post(postSecurityQuestion).then((response) => {
            if (!this.questions_list.includes(response.data)) {
              let randomIndex = Math.floor(Math.random() * 5);
              this.questions_list.splice(randomIndex, 0, response.data);
            }
          });
        }, 50);
      }
    },
     scrollWin() {
        window.scrollTo(0, 0);
      }
  },
};
</script>

<style>
#external__container {
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
  
}
#external__container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#balance,
.font-size-standard {
  font-size: 16px;
}

#security-question {
  padding: 50px 200px;
}
.wire-cont {
  padding: 0 110px;
}
#wire-balance {
  font-size: 35px;
}
.fa-wallet {
  font-size: 27px;
}
#balance-title {
  font-size: 25px;
}
div.q-tab__label {
  font-size: 38px;
}
.deposit-css-transfer {
  font-size: 30px;
}
.fullscreen {
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.close-btn-ico {
  transition: transform 0.5s;
}
.close-btn-ico:hover {
  transform: rotate(180deg);
}
</style>

<style>
@media (max-width: 1218px) {
  #security-question {
    padding: 50px 150px;
  }
}
@media (max-width: 1181px) {
  .wire-cont {
    padding: 0 60px;
  }
}
@media (max-width: 1136px) {
  #amount-title {
    font-size: 18px;
  }
}
@media (max-width: 1106px) {
  #security-question {
    padding: 50px 110px;
  }
}
@media (max-width: 1113px) {
  .wire-cont {
    padding: 0 30px;
  }
}
@media (max-width: 766px) {
  #amount-details-text {
    font-size: 15px;
  }
}
@media (max-width: 478px) {
  #amount-title {
    font-size: 15px;
  }
}
@media (max-width: 462px) {
  #wire-balance {
    font-size: 25px;
  }
}
@media (max-width: 458px) {
  #security-question {
    padding: 50px 30px;
  }
}
@media (max-width: 426px) {
  #amount-details-text {
    font-size: 12px;
  }
  #close-btn-amount {
    font-size: 10px;
  }
  #amount-title {
    font-size: 11px;
  }
}
@media (max-width: 408px) {
  #wire-balance {
    font-size: 20px;
  }
  #balance-title {
    font-size: 20px;
  }
}
@media (max-width: 355px) {
  #balance-title {
    font-size: 15px;
  }
}
</style>