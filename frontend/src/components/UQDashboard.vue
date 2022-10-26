<template>
  <div class="bg-white cont-shadows" style="border-radius: 30px">
    <div class="text-center text-h6 q-mb-md bg-default color-default" id="header-h6">
      <p class="deposit-css q-py-lg">
        <b style="letter-spacing: 1px">Accounts Tab</b>
      </p>
    </div>
    <div class="q-pa-md">
      <!-- Tab View -->
      <div class="q-gutter-y-md" style="max-width: 100%" inline dense>
        <q-card>
          <q-tabs
            v-model="tab"
            class="text-black"
            active-color="orange"
            indicator-color="transparent"
            narrow-indicator
            align="center"
          >
            <div
              v-for="(wallet, index) in wallet_details"
              :key="wallet._id"
              style="font-size: 200px; border-right: 1px solid #e6e6e6;"
            >
              <q-tab
                style="width: 83px; letter-spacing: 1px;"
                class="font-bebas"
                :name="wallet.currency"
                :label="wallet.currency"
                @click="getSelectedCurrency(
                  wallet.currency, 
                  wallet.decimal_places, 
                  index, 
                  wallet.balance, 
                  wallet.is_fiat
                )"
              />
            </div>
          </q-tabs>
        </q-card>
      </div>

      <!-- Balance and Conversion Rate -->
      <div class="text-center q-mt-lg" v-if="is_show_balance">
        <q-icon size="50px" name="img:wallets/wallet-icon.png" />
        <div class="q-ml-md">
          <span id="balance">
            <strong
              class="font-bebas"
              style="letter-spacing: 1px; font-size: 30px"
            >
              {{ tab }} 
              {{ balance[index].toLocaleString('en-US', { 
                minimumFractionDigits: decimals[index], 
                maximumFractionDigits: decimals[index]}) 
              }}
            </strong>
            <div v-if="tab != 'USD'" style="font-size: 14px">
              <i class="fas fa-exchange-alt"></i>
              {{ "USD" + " " + (currency_balance * conversion[tab]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </div>
          </span>
        </div>

      <!-- Total Balance in USD -->
      <div style="font-size: 16px" class="text-center" ><span class="font-raleway">Total Account Balance in USD:    </span> <strong class="font-bebas q-ml-xs" style="font-size:22px"> ${{ (total_wallet).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) }}</strong>
      </div>

        <!-- Forgot Security Buttons -->
        <div class="text-center q-mt-lg" v-if="is_account_locked">
          <h6 class="q-pb-md" style="font-size: 20px">Forgot Security Question and Password</h6>
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
                @click="is_show_forgot_security_2 = true"
                class="full-width"
                outline
                color="accent"
              >OTP</q-btn>
            </div>
          </div>
        </div>
      </div>

    <!-- Forgot Security 1 Dialog -->
    <q-dialog v-model="is_show_forgot_security_1">
      <q-card style="width: 400px">
        <q-card-section>
          <div v-if="!res">
            <u-q-reset-via-id-number @success="fromIdNumberComponent"></u-q-reset-via-id-number>
          </div>
          <div class="text-center" v-else>
            <i class="fas fa-envelope" style="font-size: 70px;"></i>
            <p class="field q-mt-md" style="font-weight: bold;font-size:20px;">Check your email!</p>
            <p class="field text-center">
              We just sent you an email with a link to reset your security question and answer.
            </p>
            <q-btn color="accent" v-close-popup>Close</q-btn>
          </div>
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
              <u-q-reset-via-otp @success="fromOTPComponent"></u-q-reset-via-otp>
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
</template>

<script>
import {
  postWalletDetailsOptions,
} from "../references/url";
import UQResetViaIdNumber from "./UQResetViaIdNumber";
import UQResetViaOtp from "./UQResetViaOtp";

export default {
  data() {
    return {
      res: null,
      tab: "USD",
      index: 0,
      decimal: 2,
      wallet_details: [],
      conversion: {},
      from_options: [],
      balance: [],
      decimals: [],
      is_fiat: [],
      total_wallet: 0,
      currency_balance: 0,
      is_account_locked: false,
      is_show_balance: true,
      is_show_forgot_security_1: false,
      is_show_forgot_security_2: false,
    };
  },

  components: {
    UQResetViaIdNumber,
    UQResetViaOtp,
  },

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
        this.conversion        = response.data.conversion;
        this.is_account_locked = response.data.is_account_locked;
      });

      this.total_wallet = 0;
      for (let i = 0; i < this.wallet_details.length; i++) {
        this.from_options.push(this.wallet_details[i].currency);
        this.balance.push(
          this.wallet_details[i].balance /
            10 ** this.wallet_details[i].decimal_places
        );
        this.decimals.push(this.wallet_details[i].decimal_places);
        this.is_fiat.push(this.wallet_details[i].is_fiat);
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

    async getSelectedCurrency(currency, decimal, index, balance, is_fiat)
    {
      this.tab              = currency;
      this.decimal          = decimal;
      this.index            = index;
      this.currency_balance = (balance / 10 ** decimal);
      this.is_fiat          = is_fiat;

      let details = {
        currency: currency,
        decimal:  decimal,
        index:    index,
        balance:  this.currency_balance,
        is_fiat:  is_fiat
      }

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
      };
    },

  },
};
</script>

<style>
.hide {
  display: none;
}
div .q-tab__label {
  font-size: 30px;
}
</style>
