<template>
  <div
    style="background: white;"
    id="send__container"
  >
    <!-- Send Component -->
    <div>
      <div v-if="!is_show_send_security && !is_show_convert_confirmation">
        <!-- Balance -->
        <div class="text-center icon bg-default color-default" style="border-radius: 20px 20px 0 0">
          <span id="balance">
            <div id="header-h6">
              <b>
                <p class="deposit-css-transfer q-py-md">
                  TRANSFER FUND
                  <span id="title-remove">TO ANOTHER LEXICON ACCOUNT</span>
                </p>
              </b>
            </div>
          </span>
        </div>
        <div id="transfer-container">
          <div class="q-pl-md text-left">
            <span id="transfer-title">Balance:</span>
            <strong
              id="transfer-balance"
              class="q-ml-sm"
            >{{ currency_balance.toLocaleString('en-US', {minimumFractionDigits: decimal, maximumFractionDigits: decimal}) }}</strong>
            <q-badge align="top" style="background: transparent;" class="text-black">{{ tab }}</q-badge>
            <div v-if="tab != 'USD'" style="font-size: 12px">
              <i class="fas fa-exchange-alt"></i>
              {{ "USD " + (currency_balance * conversion[tab]).toLocaleString('en-US', { minimumFractionDigits: 2,
              maximumFractionDigits: 2 })
              }}
            </div>
          </div>
          <div class="field q-mt-md">
            <div>
              <q-form @submit="initialSendCheck()">
                <div class="row q-col-gutter-md">
                  <div class="col-sm-6 col-12">
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
                    ></q-select>
                  </div>
                  <div class="col-sm-6 col-12">
                    <q-input
                      @input="getName"
                      v-model="form_data.receiver_public_key"
                      type="text"
                      :label="is_fiat ? 'Account Number' : 'Wallet Address' "
                      :hint="is_fiat ? 'Receiver account number' : 'Receiver wallet address' "
                      required
                      outlined
                      :rules="[val => !!val || '* Field is required']"
                    />
                  </div>

                  <div class="col-sm-6 col-12">
                    <q-input
                      :loading="input_loading"
                      outlined
                      readonly
                      v-model="receiver_name"
                      label="Account Name"
                      required
                      :rules="[val => !!val || '* Field is required']"
                    />
                  </div>
                  <!-- :mask="'#.' + '#'.repeat([decimal])" -->
                  <div class="col-sm-6 col-12">
                    <div>
                      <q-input
                        outlined
                        v-model.number="form_data.amount"
                        label="Amount"
                        mask="#.##"
                        fill-mask="0"
                        reverse-fill-mask
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
                  </div>
                  <div class="field col-12">
                    <div>
                      <q-input v-model="form_data.remarks" label="Remarks (optional)" outlined />
                    </div>
                  </div>
                  <div>
                    <br />
                    <div
                      v-if="showQRScanner == true"
                      :class="{ 'fullscreen': fullscreen }"
                      ref="wrapper"
                    >
                      <qrcode-stream @decode="onDecode" @init="onInit" />
                    </div>
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div id="btn-submits" class="text-center col-sm-6 col-12">
                    <q-btn
                      type="submit"
                      icon="fas fa-paper-plane"
                      stack
                      class="bg-default full-width color-default"
                      unelevated
                      :loading="loading2"
                    >
                      <span id="label-remove">Send</span>
                    </q-btn>
                  </div>
                  <div id="btn-submits-2" class="text-center col-sm-6 col-12">
                    <q-btn
                      @click="showScanner()"
                      class="full-width"
                      type="button"
                      color="accent"
                      stack
                      icon="fas fa-qrcode"
                      outline
                      unelevated
                    >
                      <span id="label-remove">Scan QR Code</span>
                    </q-btn>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </div>
      <!-- End of Send Component -->

      <!-- Security Question and Password -->
      <div
        v-if="is_show_send_security == true && is_show_send_success == false && is_show_send_attempt == false"
        class="security-container"
      >
        <q-form @submit="sendCurrency()">
          <div>
            <label class="font-size-standard">Security Question & Password Validation</label>
            <div class="row q-col-gutter-md">
              <div class="q-mt-md col-12">
                <q-select
                  filled
                  v-model="form_data.security_question"
                  :options="questions_list"
                  class
                  behaviour="menu"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form_data.security_answer"
                  type="text"
                  outlined
                  label="Answer"
                  :rules="[val => !!val || '* Field is required']"
                  class
                />
              </div>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
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
                <span style="color: red">Warning: 1 Remaining Attempt.</span>
              </div>
            </div>
            <!-- End of Error Message -->
            <div class="col-12 text-right">
              <q-btn
                style="height: 55px"
                type="submit"
                unelevated
                class="bg-default color-default"
                :loading="loading2"
              >Submit</q-btn>
            </div>
          </div>
        </q-form>
      </div>

      <!-- Sent Success Message -->
      <div v-if="is_show_send_success == true">
        <div class="form-container">
          <div class="row">
            <div style="font-size: 20px;" class="q-mb-md col-11">
              <b>{{ res.data.description }}</b>
            </div>
            <div class="col-1">
              <q-btn
                @click="backToDashboard()"
                icon="fas fa-times"
                round
                class="close-btn-ico"
                unelevated
              ></q-btn>
            </div>
          </div>
          <div class="q-pa-md" style="background: #f6f6f6;">
            <div>
              <span>
                <div class="q-pb-sm q-pt-sm">
                  <span id="amount-details-text" class="float-left">Current Balance:</span>
                  <strong id="amount-details-text" class="float-right">
                    {{ res.data.currency_abbreviation }} {{ (res.data.balance_after / 10 ** res.data.decimal_places).toLocaleString("en-US", {
                    minimumFractionDigits: res.data.decimal_places
                    })
                    }}
                  </strong>
                </div>
              </span>
              <br />
              <q-separator />
            </div>
            <div v-if="res.data.conversion_rate">
              <span>
                <div class="q-pb-sm q-pt-sm">
                  <span id="amount-details-text" class="float-left">Rate:</span>
                  <strong
                    id="amount-details-text"
                    class="float-right"
                  >{{ res.data.conversion_rate }}</strong>
                </div>
              </span>
              <br />
              <q-separator />
            </div>
          <div>
             
            <!-- <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Date & Time:</span>
              <strong id="amount-details-text" class="float-right">{{ moment(res.data.date_created).format('DD-MMM-YYYY') }} -
              {{ new Date(res.data.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</strong>
            </div> -->
            <div class="q-pb-sm q-pt-sm">
              <span id="amount-details-text" class="float-left">Date & Time:</span>
              <strong id="amount-details-text" class="float-right">{{ moment(res.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} -
              {{ moment(res.data.date_created).tz("Europe/London").format('HH:mm') }}</strong>
            </div>
            <br />
            <q-separator />
            <div>
              <span>
                <div class="q-pb-sm q-pt-sm">
                  <span id="amount-details-text" class="float-left">Reference Code:</span>
                  <strong
                    id="amount-details-text"
                    class="float-right"
                  >{{ res.data.reference_number }}</strong>
                </div>
              </span>
            </div>
            <br />
            <q-separator />
            <div class="q-pb-md" v-if="res.data.remarks !== '' ">
              <span>
                <div class="q-pb-sm q-pt-sm">
                  <span id="amount-details-text" class="float-left">Remarks:</span>
                  <strong id="amount-details-text" class="float-right">{{ res.data.remarks }}</strong>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversion Fee Confirmation -->
      <div class="confirmation">
        <div v-if="is_show_convert_confirmation" class="q-pa-lg text-center texty">
          <p class="q-mt-lg"></p>
          <h5>
            You are about to transfer funds to another currency.
            <br />Conversion rate will be applied. Would you like to continue?
          </h5>
          <!-- </p> -->
          <div class="text-center q-mt-xl q-mb-md">
            <q-btn
              class="q-mr-sm"
              color="accent"
              outline
              type="button"
              @click="toggleConfirmation"
            >Back</q-btn>
            <q-btn
              class="bg-default color-default q-ml-sm"
              type="button"
              @click="confirmSend"
            >Continue</q-btn>
          </div>
        </div>
      </div>

      <!-- Lock Account -->
      <div class="q-py-xl" v-if="is_show_send_attempt == true">
        <span class="font-raleway" style="font-size: 20px; font-weight: 400; letter-spacing: 1px;">
          <b>Fund transfer is temporarily disabled.</b>
        </span>
        <div class="text-center q-mt-lg">
          <q-btn @click="backToDashboard()" color="accent" unelevated class="q-px-xl">OK</q-btn>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import {
  postWalletDetailsOptions,
  postViewReceiver,
  postVerifyInternalDetails,
  postSecurityQuestion,
  postSendErrorCounter,
  postSendAttempt,
  postWalletSend,
} from "../references/url";
import sendQuestions from "../references/sendQuestion";
import { QrcodeStream } from "vue-qrcode-reader";
import moment from "moment-timezone";

export default {
  data() {
    return {
      moment: moment,
      loading2: false,
      form_data: {
        receiver_public_key: "",
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
      decimal: 2,
      currency_balance: 0,
      currency_list: [],
      is_fiat: true,
      is_show_send_security: false,
      is_show_send_success: false,
      isPwd: true,
      is_show_send_attempt: false,
      is_show_convert_confirmation: false,
      is_other_currency: false,
      questions_list: sendQuestions,
      send_attempt: null,

      size: 300,
      result: "",
      showQRScanner: false,
      fullscreen: true,
      receiver_name: null,
      input_loading: false,
      rcv_ccy: "",
    };
  },

  computed: {},

  // async beforeUpdate()
  // {
  //   console.log("beforeUpdate")
  // },
  // async updated()
  // {
  //   console.log("updated")
  // },

  async mounted() {
    await this.viewWalletOptions();
    // await this.getVuexStorage();
    await this.getAllCurrency();
  },

  components: { QrcodeStream },

  methods: {
    onDecode(result) {
      this.form_data.receiver_public_key = result;
      this.showQRScanner = false;
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },

    showScanner() {
      this.showQRScanner = true;
    },

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

    async sendCurrency() {
      // this.$q.loading.show();
      this.loading2 = true;
      this.form_data.abbreviation = this.tab;
      let res = await this.$_post(postWalletSend, this.form_data);
      // this.$q.loading.hide();
      this.loading2 = false;

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
    },

    async backToDashboard() {
      window.location.href = "https://enabler.link/lexicon/#/home/dashboard";
    },

    async initialSendCheck() {
      this.loading2 = true;
      // this.$q.loading.show();
      let res = await this.$_post(postVerifyInternalDetails, {
        receiver_public_key: this.form_data.receiver_public_key,
        abbreviation: this.tab,
        amount: this.form_data.amount,
      });
      // this.$q.loading.hide();
      this.loading2 = false;
      if (res.status == undefined) {
        this.is_show_send_security = false;
      } else {
        if (this.tab === this.rcv_ccy) {
          this.loading2 = false;
          await this.confirmSend();
          window.scrollTo(0, 0);
        } else {
          this.is_show_convert_confirmation = true;
        }
      }
    },

    async getName() {
      this.is_other_currency = false;
      this.input_loading = true;
      let res = await this.$_post(postViewReceiver, {
        public_key: this.form_data.receiver_public_key,
      });
      if (res) {
        this.receiver_name = res.data.full_name;
        let index = res.data.wallet.findIndex(
          (x) => x.wallet_address == this.form_data.receiver_public_key
        );
        this.rcv_ccy = res.data.wallet[index].currency;
        if (this.rcv_ccy !== this.tab) {
          this.is_other_currency = true;
        }
      }
      this.input_loading = false;
    },

    async toggleConfirmation() {
      this.is_show_convert_confirmation = !this.is_show_convert_confirmation;
      this.form_data.amount = 0;
    },

    async confirmSend() {
      this.is_show_convert_confirmation = false;
      this.is_show_send_security = true;

      setTimeout(() => {
        this.$_post(postSecurityQuestion).then((response) => {
          if (!this.questions_list.includes(response.data)) {
            let randomIndex = Math.floor(Math.random() * 5);
            this.questions_list.splice(randomIndex, 0, response.data);
          }
        });
      }, 50);
    },
  },
};
</script>

<style>
#send__container {
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
#send__container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#balance,
.font-size-standard {
  font-size: 16px;
}
#transfer-balance {
  font-size: 35px;
}
.deposit-css-transfer {
  font-size: 35px;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 2px;
}
#amount-details-text {
  font-size: 20px;
}
#header-h6 {
  font-size: 16px;
}
.fa-wallet {
  font-size: 27px;
}

div.q-tab__label {
  font-size: 18px;
}
.fullscreen {
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
#btn-submits-2 {
  margin-bottom: 20px;
}
#transfer-container {
  padding: 0 100px;
}
#transfer-title {
  font-size: 25px;
}
.form-container {
  padding: 30px 50px;
}
.security-container {
  padding: 20px 100px;
}
</style>

<style>
@media (max-width: 810px) {
  #transfer-container {
    padding: 0 60px;
  }
}
@media (max-width: 686px) {
  #title-remove {
    display: none;
  }
}
@media (max-width: 686px) {
  #transfer-container {
    padding: 0 20px;
  }
}
@media (max-width: 577px) {
  .security-container {
    padding: 20px 30px;
  }
}
@media (max-width: 457px) {
  #transfer-balance {
    font-size: 25px;
  }
  #transfer-title {
    font-size: 20px;
  }
}
@media (max-width: 393px) {
  #transfer-balance {
    font-size: 20px;
  }
  #transfer-title {
    font-size: 17px;
  }
}
@media (max-width: 393px) {
  #label-remove {
    display: none;
  }
}
@media (max-width: 600px) {
  .form-container {
    padding: 30px 10px;
  }
}
@media (max-width: 510px) {
  #amount-details-text {
    font-size: 15px;
  }
}
@media (max-width: 395px) {
  #amount-details-text {
    font-size: 12px;
  }
}
</style>