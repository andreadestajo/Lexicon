<template>
  <div>
    <!-- Form -->

    <q-form>
      <div
        class="text-center text-h6 q-mb-md bg-header color-default"
        style="border-radius: 20px 20px 0 0"
        id="header-h6"
      >
        <p class="deposit-css q-py-lg">
          <b>Deposit Amount</b>
        </p>
      </div>
      <div class="q-pa-md">
        <div id="deposit-container">
          <div class="text-h4 text-left q-mb-md">
            <span id="amount">
              {{(this.form_data.amount).toLocaleString("en-US", {
              minimumFractionDigits:2})}}
            </span>
            <q-badge align="top" id="badge">{{form_data.abbreviation}}</q-badge>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-select
                name="preferred_genre"
                v-model="form_data.abbreviation"
                :options="options"
                color="accent"
                filled
                label="Account"
              />
            </div>
            <div class="col-12 col-sm-6">
              <div class="field">
                <q-input
                  outlined
                  v-model.number="form_data.amount"
                  label="Amount"
                  mask="#.##"
                  fill-mask="0"
                  reverse-fill-mask
                  color="accent"
                  lazy-rules
                  :rules="[val => typeof val == 'number']"
                  min="0"
                  step="any"
                  required
                />
              </div>
            </div>
          </div>
          <div class="text-right">
            <q-btn
              style="border-radius: 30px"
              label="Proceed"
              @click="confirm = true"
              class="bg-default color-default"
            />
          </div>
        </div>
      </div>
      <!-- end of pop up button -->
    </q-form>
    <!-- end of form -->
    <!-- Dialog Confirmation -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-exclamation" color="accent" text-color="white" />
          <span class="q-ml-sm">
            You are about to deposit
            <b>{{form_data.abbreviation}} {{form_data.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</b>. Continue?
          </span>
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
    <q-dialog
      v-model="is_show_send_success"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px; max-width: 80vw;" class="q-pa-md">
        <q-card-section
          class="text-center q-pb-none"
          v-if="this.add_fund_info.status == 'pending'"
        >
          <q-avatar icon="check" class="bg-default" text-color="white" />
          <div class="text-h6 q-mt-md font-raleway text-weight-bolder">Lexicon Bank Details</div>
        </q-card-section>
        <q-card-section class="text-center">
          <div v-if="this.add_fund_info.status == 'pending'">
            <div class="q-pa-md">
              <q-markup-table>
                <tbody>
                  <tr>
                    <td class="text-left font-monseratt">Bank</td>
                    <td class="text-left font-monseratt text-weight-bold">HSBC</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt">Swift Code/IBAN</td>
                    <td class="text-left font-monseratt text-weight-bold">CPAUSUS44</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt">Beneficiary</td>
                    <td class="text-left font-monseratt text-weight-bold">LEXICON BANK</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt">Beneficiary Address</td>
                    <td
                      class="text-left font-monseratt text-weight-bold"
                    >100 Field Point Road, Greenwich, CT 06830, United States</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt">Beneficiary Account Number</td>
                    <td class="text-left font-monseratt text-weight-bold">0912312321</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt">Reference Code</td>
                    <td
                      class="text-left font-monseratt text-weight-bold"
                    >{{this.add_fund_info.orderNumber}}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt">Amount</td>
                    <td
                      class="text-left font-monseratt text-weight-bold"
                    >{{form_data.abbreviation}} {{this.form_data.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>

          <!-- <div v-if="this.add_fund_info.status == 'canceled'">
            Your Order Number starts with
            <span class="text-bold">{{this.add_fund_info.orderNumber}}</span> was Canceled
          </div> -->

          <!-- Check status and Cancel Button -->
          <!-- routes -->
          <q-card-actions align="right" class="bg-white q-mt-md" id="btn-status-cancel">
            <div class="row">
              <div class="col q-mr-md" style="width: 200px">
                <q-btn
                  v-if="this.is_pending == true"
                  label="Check Status"
                  outline
                  color="accent"
                  class="full-width q-mb-md"
                  @click="$router.push({name: 'transaction'})"
                />
              </div>
              <!-- <div class="col q-mr-md">
                <q-btn
                  v-if="this.add_fund_info.status === 'pending'"
                  label="Cancel Order"
                  class="full-width"
                  color="accent"
                  outline
                  @click="cancelHandler(add_fund_info.orderNumber)"
                />
              </div>-->
              <div class="col q-mr-md">
                <q-btn label="Close" class="full-width" color="accent" @click="closeHandler" />
              </div>
            </div>
          </q-card-actions>
          <!-- End of  Check status and Cancel Button -->
        </q-card-section>
        <!-- End of Sent Success Message -->
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import fiat from "../references/fiat";
// import { postAddFunds, postUpdateStatus } from "../references/url";
import { postAddFunds, postUpdateStatus, getCurrentDeposit } from "../references/url";
import { postWalletDetailsOptions } from "../references/url";

export default {
  props: ["abbreviation"],
  data: () => ({
    fee: {
      usd_fee: 3,
      php_fee: 15,
    },
    form_data: {
      abbreviation: "USD",
      amount: "0.00",
      remarks: "",
    },
    options: [],
    confirm: false,
    update_data: null,
    add_fund_info: "",
    fiatOptions: fiat,
    is_show_send_success: false,
    is_show_error: false,
    is_show_error_2: false,
    is_pending: false,
  }),
  components: {},
  async mounted() {
    // console.log(this.$user_info.wallet_address.indexOf(this.abbreviation)); //-1
    // console.log(this.$user_info.wallet_address);
    // console.log(this.abbreviation);
    // console.log(this.$user_info.wallet[0].currency)
    // console.log(this.$user_info.wallet.length)
    await this.getAccount();
  },
  methods: {
    async getAccount() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        for (let i = 0; i < response.data.wallet.length; i++) {
          this.options.push(response.data.wallet[i].currency);
        }
      });
      // for (let i = 0; i < this.$user_info.wallet.length; i++) {
      //   this.options.push(this.$user_info.wallet[i].currency);
      // }
    },
async submitHandler() {
      this.$q.loading.show();
      this.form_data.user_id = this.$user_info._id;
      this.form_data.full_name = this.$user_info.full_name.toUpperCase();

      this.form_data.abbreviation = this.form_data.abbreviation.toUpperCase();

      let res = await this.$_post(postAddFunds, this.form_data);
      console.log(res);
      if (res.status == 200) 
      {
        await this.getDetails();
        this.$q.loading.hide();
      } 
      else if(this.form_data.amount === "" || this.form_data.abbreviation.length == 0) 
      {
        this.triggerNegativeLength("top");
      } 
      else if(this.form_data.amount <= 200) 
      {
        this.triggerNegativeAmount("top");
      }
    },

    async getDetails()
    {
      let res = await this.$_post(getCurrentDeposit, {user_id: this.$user_info._id});
      if(res.status == 200)
      {
        this.is_show_send_success = true;
        this.add_fund_info = res.data;
      }
    },

    triggerNegativeLength(position) {
      this.$q.notify({
        message:
          '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to fill up the forms.</div>',
        position: "top",
        color: "white",
        html: true,
      });
    },
    triggerNegativeAmount(position) {
      this.$q.notify({
        message:
          '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Amount must be greater than or equal to 200.</div>',
        position: "top",
        color: "white",
        html: true,
      });
    },
    triggerPositiveCanceled(position, orderNumber) {
      this.$q.notify({
        message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Your deposit is successfully canceled.</div>`,
        position: "top",
        color: "white",
        html: true,
      });
    },
    async closeHandler() {
      this.is_show_send_success = false;
      this.confirm = false;
      this.form_data.amount = "";
    },
    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      let res = await this.$_post(postUpdateStatus, this.add_fund_info);
      this.$q.loading.hide();
      if (res.data.message == "success") {
        this.add_fund_info.status = "canceled";
        this.triggerPositiveCanceled("top", orderNumber);
      } else {
        console.log("STATUS ERROR");
      }
    },
  },
};
</script>
<style>
#deposit-container {
  padding: 0 80px;
}
.bg-header {
  background: #2f4c7e;
}
.deposit-css {
  font-size: 35px;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1px;
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
</style>

<style>
@media (max-width: 539px) {
  #deposit-container {
    padding: 0 10px;
  }
}
</style>
