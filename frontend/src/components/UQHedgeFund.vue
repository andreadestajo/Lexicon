<template>
  <div>
    <!-- Form -->

    <q-form @submit="confirm = true">
      <div class="text-center text-h6 q-mb-md bg-default color-default" id="header-h6">
        <p class="deposit-css q-py-lg">
          <b>HEDGE FUND</b>
        </p>
      </div>
      <div class="q-pa-md">
        <div style="padding: 0 100px">
          <div class="column">
            <div class="col">
              <q-select
                name="preferred_genre"
                v-model="form_data.fund_type"
                :options="hedgeFundList"
                color="accent"
                filled
                label="Select Fund"
                behavior="menu"
              />
            </div>
            <div class="col q-pt-md">
              <q-select
                name="preferred_genre"
                v-model="form_data.abbreviation"
                :options="options"
                color="accent"
                filled
                label="Select Account"
                behavior="menu"
              />
            </div>
            <div class="col q-pt-md">
              <div class="field">
                <q-input
                  outlined
                  v-model.number="form_data.amount"
                  @input="val => { call()}"
                  label="Amount"
                  mask="#.##"
                  type="text"
                  fill-mask="0"
                  reverse-fill-mask
                  color="accent"
                  :rules="[
                  val => val * conversion[form_data.abbreviation] >= 200000 || 'Minimum conversion amount is $200,000.00 equivalent',
                  val => val <= balance[from_options.indexOf(form_data.abbreviation)] || 'Insufficient Balance']"
                  required
                />
              </div>
              <div class="text-h4 text-right">
                <span id="amount">
                  {{(this.form_data.amount).toLocaleString("en-US", {
                  minimumFractionDigits:2})}}
                </span>
                <q-badge align="top" id="badge">{{form_data.abbreviation}}</q-badge>
              </div>
              <q-btn
                type="submit"
                label="Proceed"
                class="full-width q-mt-md bg-default color-default"
              />
            </div>
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
    <q-dialog
      v-model="is_show_send_success"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px; max-width: 80vw;" class="q-pa-md">
        <q-card-section
          class="text-center q-pb-none"
          v-if="this.add_fund_info.status_payment == 'pending'"
        >
          <q-avatar icon="check" class="bg-default" text-color="white" />
          <div class="text-h6 q-mt-md font-raleway text-weight-bolder">Bank Transfer Details</div>
        </q-card-section>
        <q-card-section class="text-center">
          <div v-if="this.add_fund_info.status_payment == 'pending'">
            <div class="q-pa-md">
              <q-markup-table>
                <tbody>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">Bank</td>
                    <td class="text-left font-monseratt">BDO</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">Swift Code</td>
                    <td class="text-left font-monseratt">CPAUSUS44</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">Beneficiary</td>
                    <td class="text-left font-monseratt">FXCM</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">Beneficiary Address</td>
                    <td
                      class="text-left font-monseratt"
                    >100 Field Point Road, Greenwich, CT 06830, United States</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">Beneficiary Account Number</td>
                    <td class="text-left font-monseratt">0912312321</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">REF</td>
                    <td class="text-left font-monseratt">{{this.add_fund_info.order_number}}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-monseratt text-weight-bold">Amount</td>
                    <td
                      class="text-left font-monseratt"
                    >{{form_data.abbreviation}} {{Intl.NumberFormat().format(this.form_data.amount)}}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>

          <div v-if="this.add_fund_info.status_payment == 'canceled'">
            Your Order Number starts with
            <span class="text-bold">{{this.add_fund_info.order_number}}</span> was Canceled
          </div>

          <!-- Check status and Cancel Button -->
          <!-- routes -->
          <q-card-actions align="right" class="bg-white q-mt-md" id="btn-status-cancel">
            <q-btn
              v-if="this.add_fund_info.status_payment === 'pending' || this.add_fund_info.status_payment === 'canceled' "
              label="Check Status"
              class="full-width q-mb-md bg-default color-default"
              @click="$router.push({name: 'transaction'})"
            />
            <q-btn
              v-if="this.add_fund_info.status_payment === 'pending'"
              label="Cancel Order"
              class="full-width"
              color="accent"
              outline
              @click="cancelHandler(add_fund_info.order_number)"
            />
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
import hedgeFundList from "../references/hedge_fund_list";
import { postHedgeFund, postWalletDetailsOptions } from "../references/url";

export default {
  // props: ["abbreviation"],
  data: () => ({
    hedgeFundList: hedgeFundList,

    hedge_fund_list: "USD",
    form_data: {
      abbreviation: "USD",
      amount: 0,
      remarks: "",
      fund_type: "",
    },
    from_options: [],
    balance: [],
    decimal: [],
    options: [],
    wallet_details: {},
    conversion: {},
    confirm: false,
    update_data: null,
    add_fund_info: "",
    fiatOptions: fiat,
    is_show_send_success: false,
    is_show_error: false,
    is_show_error_2: false,
  }),
  components: {},
  async mounted() {
    console.log(this.$user_info.wallet_address.indexOf(this.abbreviation)); //-1
    console.log(this.$user_info.wallet_address);
    console.log(this.abbreviation);
    // console.log(this.$user_info.wallet[0].currency);
    console.log(this.$user_info.wallet.length);
    await this.viewWalletOptions();
    console.log(this.wallet_details);
    console.log(this.conversion);
    this.getAccount();
  },
  methods: {
    async call() {
      console.log(this.form_data.amount);
    },
    async getAccount() {
      for (let i = 0; i < this.$user_info.wallet.length; i++) {
        this.options.push(this.$user_info.wallet[i].currency);
      }
    },
    async viewWalletOptions() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        this.wallet_details = response.data.wallet;
        this.conversion = response.data.conversion;
        // console.log(this.wallet_details);
        //  val => val <= balance[from_options.indexOf(form_data.abbreviation)] || 'Insufficient Balance'  ]
        console.log(this.balance);
        console.log(this.conversion[this.form_data.abbreviation]);
      });
      for (let i = 0; i < this.wallet_details.length; i++) {
        this.from_options.push(this.wallet_details[i].currency);
        this.balance.push(
          this.wallet_details[i].balance /
            10 ** this.wallet_details[i].decimal_places
        );
        this.decimal.push(this.wallet_details[i].decimal_places);
      }
    },
    async submitHandler() {
      this.$q.loading.show();
      this.form_data.user_id = this.$user_info._id;
      this.form_data.full_name = this.$user_info.full_name.toUpperCase();
      this.form_data.abbreviation = this.form_data.abbreviation.toUpperCase();
      this.form_data.fund_type = this.form_data.fund_type.toUpperCase();

      let res = await this.$_post(postHedgeFund, this.form_data);

      this.$q.loading.hide();
      if (res.data.message == "success") {
        this.triggerPositiveCanceled("top", `${this.form_data.abbreviation}`);
        this.add_fund_info = res.data;
      }
    },
    triggerNegativeLength(position) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `You need to fill up the forms!`,
      //   position,
      // });
      this.$q.notify({
          message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to fill up the forms."</div>',
          position: 'top',
          color: 'white',
          html: true,
      });
    },
    triggerNegativeAmount(position) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `Amount must be greater than or equal to 300,000USD!`,
      //   position,
      // });
      this.$q.notify({
          message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Amount must be greater than or equal to USD 300,000."</div>',
          position: 'top',
          color: 'white',
          html: true,
      });
    },
    triggerPositiveCanceled(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Your Order Number ${orderNumber} Successfully canceled!`,
      //   position,
      // });
      this.$q.notify({
          message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Your Hedge Fund is successfully canceled.</div>`,
          position: 'top',
          color: 'white',
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