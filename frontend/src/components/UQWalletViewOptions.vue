<template>
  <div>
    <div class="wallet__container">
      <div class="text-center text-h6 q-mb-md bg-default color-default" style="border-radius: 20px 20px 0px 0px" id="header-h6">
        <p class="deposit-css q-py-lg">
          <b style="letter-spacing: 1px">Accounts</b>
        </p>
      </div>
      <div class="q-pa-md">
        <!-- View Options -->
        <div>
          <!-- Forgot Security Buttons -->
          <div class="text-center q-pb-lg q-mb-lg question__lock" v-if="is_account_locked">
            <div class="q-pa-md">
              <div id="note-text" class="bg-amber-2 q-pa-lg">
                <strong>
                  To enable Fund Transfer/Hedge Fund functionalities, kindly choose one (1) from below options on how to reset your Security Question and Answer.
                </strong>
              </div>
            </div>
            <div class="row">
              <div class="col q-px-md">
                <q-btn
                  @click="is_show_forgot_security_1 = true"
                  class="full-width q-mr-lg"
                  color="accent"
                >ID Number</q-btn>
              </div>
              <div class="col q-px-md">
                <q-btn
                  @click="requestOTP()"
                  class="full-width"
                  outline
                  color="accent"
                >Request OTP</q-btn>
              </div>
            </div>
          </div>
          
          <!-- List of Currency -->
          <div v-for="(wallet, index) in wallet_details" :key="wallet._id" style="cursor: pointer;">
            <div
            @click="getSelectedCurrency(
            wallet.currency, 
            wallet.decimal_places, 
            index, 
            wallet.balance,
            wallet.is_fiat
          )"
              class="currency-list"
              :class="index == indexNumber ? 'active-wallet' : '' "
            >
              <q-btn
                flat
                icon="img:details.png"
                round
                id="mobile-info"
                size="20px"
                @click="is_show_receive =  true"
              />
              <div class="row">
                <!-- :class="{'active-wallet': index == indexNumber}" -->
                <div id="desktop-info" class="col-2 flex flex-center">
                  <q-btn
                    flat
                    icon="img:details.png"
                    round
                    size="20px"
                    style="margin-top: 0px"
                    @click="is_show_receive =  true"
                  />
                </div>
                <div class="col-sm-4 col-12 flex flex-center">
                  <span
                    style="font-size: 20px; font-weight: 450;"
                    class="font-raleway"
                  >{{ wallet.currency }}</span>
                </div>
                <span
                  v-if="wallet.currency == 'USD'"
                  id="balance-position"
                  class="col-sm-6 col-12 wallet-balance-container"
                >
                  <strong style="font-size: 25px;">
                    {{ (wallet.balance / 10 ** wallet.decimal_places).toLocaleString("en-US", { maximumFractionDigits: wallet.decimal_places, minimumFractionDigits: wallet.decimal_places
                    }) }}
                  </strong>
                </span>
                <div class="col-12 col-sm-6" id="balance-position">
                  <strong style="font-size: 25px;">
                    <b v-if="wallet.currency !== 'USD'">
                      {{ (wallet.balance / 10 ** wallet.decimal_places).toLocaleString("en-US", { maximumFractionDigits: wallet.decimal_places, minimumFractionDigits: wallet.decimal_places
                      }) }}
                    </b>

                    <div
                      v-if="wallet.currency == 'USD'"
                      style="font-size: 14px; display: none"
                      class="text-right"
                    ></div>
                    <div v-else id="balance-position" style="font-size: 14px;">
                      <i class="fas fa-exchange-alt"></i>
                      <strong
                        style="font-size: 14px; margin-left: 10px;"
                      >USD {{ (wallet.balance / 10 ** wallet.decimal_places * conversion[wallet.currency]).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2 }) }}</strong>
                    </div>
                  </strong>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div style="font-size: 16px" class="text-right q-mr-md">
            <span class="font-raleway q-mr-sm">Total Account Balance in USD:</span>
            <strong
              style="font-size:30px"
            >{{ (total_wallet).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) }}</strong>
          </div>
        </div>

        <!-- Send Form Dialog -->
        <q-dialog v-model="is_show_send_form" persistent>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">{{ wallet_details[indexNumber].currency }}</div>
              <q-space />
              <q-btn
                :class="{'hide': is_show_send_success }"
                icon="close"
                flat
                round
                dense
                v-close-popup
              />
            </q-card-section>

            <q-card-section align="center" style="width: 450px;">
              <div v-if="!is_show_send_success && is_account_locked">
                <span style="font-size: 20px; font-weight: 400; letter-spacing: 3px;">SEND</span>
              </div>

              <u-q-wallet-send
                @success="fromSendComponent"
                :tab="currency"
                :tab_currency_index="indexNumber"
                :decimal="decimal"
                :currency_balance="currency_balance"
                :conversion="conversion"
              ></u-q-wallet-send>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Receive Dialog -->
        <q-dialog v-model="is_show_receive">
          <q-card style="width: 400px">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">{{ wallet_details[indexNumber].currency_name }}</div>
              <q-space />
              <q-btn icon="fas fa-times" round class="close-btn-ico" unelevated v-close-popup></q-btn>
            </q-card-section>

            <q-card-section>
              <u-q-wallet-receive
                :tab_currency_index="indexNumber"
                :wallet_details="wallet_details"
              ></u-q-wallet-receive>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Forgot Security 1 Dialog -->
        <q-dialog v-model="is_show_forgot_security_1">
          <q-card style="width: 400px">
            <q-card-section>
              <div v-if="!res">
                <u-q-reset-via-id-number @success="fromIdNumberComponent"></u-q-reset-via-id-number>
              </div>
              <div class="text-center" v-else>
                <i class="fas fa-envelope" style="font-size: 70px;"></i>
                <!-- <i class="far fa-thumbs-up" style="font-size: 70px;"></i> -->
                <p class="field q-mt-md" style="font-weight: bold;font-size:20px;">Check your email!</p>
                <p
                  class="field text-center"
                >We just sent you an email with a link to reset your security question and answer.</p>
                <q-btn color="accent" v-close-popup>Close</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Forgot Security 2 Dialog -->
        <q-dialog v-model="is_show_forgot_security_2">
          <q-card style="width: 400px">
            <q-card-section>
              <div v-if="!res">
                <u-q-reset-via-otp 
                  @success="fromOTPComponent"
                >
                </u-q-reset-via-otp>
              </div>
              <div class="text-center" v-else>
                <i class="fas fa-envelope" style="font-size: 70px;"></i>
                <!-- <i class="far fa-thumbs-up" style="font-size: 70px;"></i> -->
                <p class="field q-mt-md" style="font-weight: bold;font-size:20px;">Check your email!</p>
                <p
                  class="field text-center"
                >We just sent you an email with a link to reset your security question and answer.</p>
                <q-btn color="accent" v-close-popup>Close</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { postWalletDetailsOptions, postGenerateOTP } from "../references/url";
import UQWalletReceive from "./UQWalletReceive";
import UQResetViaIdNumber from "./UQResetViaIdNumber";
import UQResetViaOtp from "./UQResetViaOtp";

export default {
  name: "UQWalletViewOptions",
  data() {
    return {
      res: null,
      is_show_forgot_security_1: false,
      is_show_forgot_security_2: false,
      is_show_receive: false,
      is_account_locked: false,
      is_fiat: true,
      currency: "USD",
      currency_balance: null,
      decimal: 2,
      indexNumber: 0,
      total_wallet: 0,
      conversion: {},
      wallet_details: [],
      kyc_status: ""
    };
  },

  components: {
    UQWalletReceive,
    UQResetViaIdNumber,
    UQResetViaOtp,
  },

  created() {},

  async mounted() {
    await this.viewWalletOptions();
    await this.saveState();
  },

  methods: {
    async fromIdNumberComponent(res) {
      this.res = res;
    },

    async fromOTPComponent(res) {
      this.res = res;
    },

    async viewWalletOptions() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        this.wallet_details    = response.data.wallet;
        this.is_account_locked = response.data.is_account_locked;
        this.conversion        = response.data.conversion;
        this.kyc_status        = response.data.kyc_status;
      });

      this.total_wallet = 0;
      for (let i = 0; i < this.wallet_details.length; i++) {
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

    async getSelectedCurrency(currency, decimal, index, balance, is_fiat) {
      this.currency = currency;
      this.decimal = decimal;
      this.indexNumber = index;
      this.currency_balance = balance / 10 ** decimal;
      this.is_fiat = is_fiat;

      let details = {
        currency: currency,
        decimal: decimal,
        index: index,
        balance: this.currency_balance,
        is_fiat: is_fiat,
      };

      this.$store.state.user.selected_currency = details;
    },

    async saveState()
    {
      this.$store.state.user.wallet =
      {
        dashboard:          this.wallet_details,
        conversion:         this.conversion,
        total_balance:      this.total_wallet,
        is_account_locked:  this.is_account_locked,
        kyc_status:         this.kyc_status
      };
    },

    async requestOTP()
    {
      this.is_show_forgot_security_2 = true;
      
      if(!this.res)
      {
        let res = await this.$_post(postGenerateOTP);
      }
    },

  },
};
</script>

<style>
.wallet__container {
   border-radius: 30px;
  border: 2px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
  background: #fff;
}
.wallet__container:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#balance-position {
  text-align: right;
}
.close-btn-ico {
  transition: transform 0.5s;
}
.close-btn-ico:hover {
  transform: rotate(180deg);
}
.currency-list {
  border-radius: 5px;
  height: auto;
  padding: 20px 20px 20px 20px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 5px 0.5px grey;
  transition: 0.5s;
}
.active-wallet {
  box-shadow: 0px 0px 2px 3px #2f4c7e; 
}
.question__lock
{
   border: 2px solid #2f4c7e;
  border-left: 5px solid #2f4c7e;
  border-radius: 10px;
}
.currency_list {
  cursor: pointer;
}
.hide {
  display: none;
}
.wallet-balance-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.btn-transactions {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  background: #2f4c7e;
  color: white;
}
</style>

<style>
@media (max-width: 599px) {
  #balance-position {
    text-align: center;
  }
  #desktop-info {
    display: none;
  }
  .wallet-balance-container {
    justify-content: center;
  }
}
@media (min-width: 600px) {
  #mobile-info {
    display: none;
  }
}
</style>