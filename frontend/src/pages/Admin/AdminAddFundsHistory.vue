<template>
  <div class="q-pa-md q-mt-xl kyc-table">
    <q-markup-table>
      <thead class="bg-teal text-white">
        <tr>
          <th colspan="12">
            <div class="row no-wrap items-center">
              <div class="text-h4 q-ml-md text-white">Add Funds History</div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-center">Full Name</th>
          <th class="text-center">Order Number</th>
          <th class="text-center">Transaction Method</th>
          <th class="text-center">Deposit Slip</th>
          <th class="text-center">Remarks</th>
          <th class="text-center">Wallet</th>
          <th class="text-center">Amount</th>
          <th class="text-center">Amount with fee</th>
          <th class="text-center">Date and Time</th>
          <th class="text-center">Status</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="funds in add_funds_list" :key="funds._id">
          <td class="text-center">{{funds.full_name}}</td>
          <td class="text-center">{{funds.orderNumber}}</td>
          <td class="text-center">{{funds.transaction_method}}</td>
          <td class="text-center">{{funds.deposit_slip_path}}</td>
          <td class="text-center">{{funds.remarks}}</td>
          <td class="text-center">{{funds.currency_abbreviation}}</td>

          <td class="text-center">
            {{(funds.amount / 10 ** funds.decimal_places).toLocaleString("en-US", {
            minimumFractionDigits:funds.decimal_places})}} {{funds.currency_abbreviation}}
          </td>
          <td class="text-center">
            {{(funds.amount_fee).toLocaleString("en-US", {
            minimumFractionDigits:funds.decimal_places})}} {{funds.currency_abbreviation}}
          </td>
          <!-- <td class="text-center">{{funds.amount_fee }} {{funds.currency_abbreviation}}</td> -->
          <!-- <td
            class="text-center"
          >{{ new Date(funds.date_created).toLocaleDateString() }} at {{ new Date(funds.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}
          </td> -->
          <td
            class="text-center"
          >{{ moment(funds.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} at {{ moment(funds.date_created).tz("Europe/London").format('HH:mm') }}
          </td>
          <td
            class="text-center text-bold"
            style="color:red"
            v-if="funds.status == 'pending' || funds.status == 'canceled' || funds.status == 'mark as paid'"
          >{{funds.status}}</td>

          <td
            class="text-center text-bold"
            style="color:green"
            v-if="funds.status == 'approved'"
          >{{funds.status}}</td>

          <td class="text-center q-gutter-sm">
            <q-btn
              color="accent"
              label="Approve"
              v-if="funds.status === 'pending' || funds.status === 'mark as paid'"
              @click="approveHandler(funds.user_id, funds.orderNumber, funds.currency_abbreviation, funds.amount, funds.decimal_places, funds.status)"
            />
            <q-btn
              color="red"
              glossy
              label="Cancel"
              @click="cancelHandler(funds.orderNumber)"
              v-if="funds.status === 'pending'"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import {
  getAddFundHistory,
  postUpdateStatus,
  updateApproveAddFunds,
} from "../../references/url";
import Vue from "vue";
import VueSimpleAlert from "vue-simple-alert";
import moment from 'moment-timezone';

Vue.use(VueSimpleAlert);
export default {
  data() {
    return {
      filter: "",
      add_funds_list: [],
    };
  },
  mounted() {
    this.getAddFundsHistory();
  },
  methods: {
    async getAddFundsHistory() {
      this.$q.loading.show();
      let res = await this.$_post(getAddFundHistory);
      this.add_funds_list = res.data;
      this.$q.loading.hide();
      // console.log(res);
    },
    triggerPositiveCanceled(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Your Order Number ${orderNumber} Successfully canceled!`,
      //   position,
      // });
      this.$q.notify({
            message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Deposit successfully canceled. + </div>`,
            position: 'top',
            color: 'white',
            html: true,
        });
    },
    triggerNegativeApproved(position, orderNumber) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `Your Order Number ${orderNumber} can't approve because it is not in 'mark as paid' status!`,
      //   position,
      // });
      this.$q.notify({
            message: `<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Deposit can't approve because it is not in 'mark as paid' status. + </div>`,
            position: 'top',
            color: 'white',
            html: true,
        });
    },
    triggerPositiveApproved(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Your Order Number ${orderNumber} Successfully approved!`,
      //   position,
      // });
      this.$q.notify({
            message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Deposit successfully approved. + </div>`,
            position: 'top',
            color: 'white',
            html: true,
        });
    },

    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      await this.$_post(postUpdateStatus, { order_number: orderNumber });
      this.$confirm("Are you sure you want to cancel your order?").then(
        (res) => {
          if (res === true) {
            this.getAddFundsHistory();
            this.triggerPositiveCanceled("top", orderNumber);
          }
        }
      );
      this.$q.loading.hide();
    },
    async approveHandler(
      user_id,
      orderNumber,
      currency_abbreviation,
      amount,
      decimal_places,
      status
    ) {
      this.$q.loading.show();
      await this.$_post(updateApproveAddFunds, {
        user_id: user_id,
        orderNumber: orderNumber,
        currency_abbreviation: currency_abbreviation,
        amount: amount,
        decimal_places: decimal_places,
        status: status,
      });
      this.$confirm(
        "Are you sure you want to approve this deposit?"
      ).then((res) => {
        if (res === true && status === "mark as paid") {
          this.getAddFundsHistory();
          this.triggerPositiveApproved("top", orderNumber);
        } else {
          console.log("Cant approuve your order");
          this.triggerNegativeApproved("top", orderNumber);
        }
      });
      this.$q.loading.hide();
    },
  },
};
</script>
<style>
</style>
