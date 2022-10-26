<template>
  <div>
    <!-- Form -->
    <q-form @submit="submitHandler">
      <!-- <div class="text-center text-h4">
        {{(this.form_data.amount / 10 ** 2).toLocaleString("en-US", {
        minimumFractionDigits: 2})}} {{this.form_data.abbreviation}}
      </div>-->
      <div class="text-center text-h4">{{this.form_data.amount}}{{this.form_data.abbreviation}}</div>
      <div class="field q-mt-lg">
        <!-- <q-input
          outlined
          dense
          placeholder="Amount"
          v-model="form_data.amount"
          type="number"
          min="0"
          step="any"
          required
        />-->

        <q-input
          outlined
          dense
          v-model.number="form_data.amount"
          label="Amount"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          hint="Input amount greater than zero"
          lazy-rules
          :rules="[val => typeof val == 'number' || 'Input number only']"
          min="0"
          step="any"
          required
        />
      </div>

      <div class="field q-mt-lg">
        <q-select
          required
          label="Wallet"
          :options="fiatOptions"
          v-model="form_data.abbreviation"
          class="q-mt-sm"
        />
      </div>

      <!-- remarks -->
      <div class="q-mt-sm" style="max-width: 100%">
        <q-input v-model="form_data.remarks" label="Remarks (Optional)" filled autogrow />
      </div>
      <!-- end of remarks -->

      <!-- pop up button  -->
      <q-btn label="Confirm" color="accent" @click="confirm = true" class="full-width q-mt-md" />
      <!-- end of pop up button -->
    </q-form>
    <!-- end of form -->

    <!-- Dialog Confirmation -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="question_answer" color="primary" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to proceed to add fund?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="accent" v-close-popup />
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
      <q-card style="width: 400px">
        <q-card-section class="text-center q-pb-none">
          <q-avatar icon="check" color="primary" text-color="white" />
          <div class="text-h6 q-mt-md">Complete Your Payment</div>
        </q-card-section>
        <q-card-section class="text-center">
          Order#
          <span class="text-weight-bolder">{{this.add_fund_info.order_number}}</span>
          <br />Account Number:
          <span class="text-weight-bolder">000123582121</span>
          <br />Please pay
          <span
            id="pay"
          >{{Intl.NumberFormat().format(this.form_data.amount)}}{{this.form_data.abbreviation}}</span> within 1 day.
          <br />
          <br />Status ------------
          <span class="text-weight-bolder">{{this.add_fund_info.status_payment}}</span>
          <br />Receiving Wallet -----------
          <span
            class="text-weight-bolder"
          >{{this.form_data.abbreviation}} Wallet</span>
          <br />You will receive ------------
          <span
            class="text-weight-bolder"
          >{{this.form_data.amount}}{{this.form_data.abbreviation}}</span>
        </q-card-section>
        <!-- End of Sent Success Message -->

        <!-- Check status and Cancel Button -->
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            label="Check Status"
            color="accent"
            class="full-width"
            @click="$router.replace('../Documentation/wallet_add_funds_history')"
          />
          <q-btn
            v-if="this.add_fund_info.status_payment === 'pending'"
            outline
            label="Cancel Order"
            color="accent"
            class="full-width q-mt-md"
            @click="cancelHandler(add_fund_info.order_number)"
          />
        </q-card-actions>
        <!-- End of  Check status and Cancel Button -->
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import fiat from "../references/fiat";
import { postAddFunds, postUpdateStatus } from "../references/url";

export default {
  data: () => ({
    form_data: {
      abbreviation: "",
      amount: "",
      remarks: ""
    },
    confirm: false,
    update_data: null,
    add_fund_info: "",
    fiatOptions: fiat,
    is_show_send_success: false,
    is_show_error: false,
    is_show_error_2: false
  }),
  components: {},
  async mounted() {},
  methods: {
    async submitHandler() {
      this.$q.loading.show();
      this.form_data.user_id = this.$user_info._id;
      this.form_data.full_name = this.$user_info.full_name;

      let res = await this.$_post(postAddFunds, this.form_data);
      // console.log(this.form_data.amount);
      console.log(this.form_data.amount < 200);
      // console.log(this.form_data.amount === "");
      // return;
      this.$q.loading.hide();
      if (res.data.message == "success") {
        this.is_show_send_success = true;
        this.add_fund_info = res.data;
      } else if (
        this.form_data.amount === "" ||
        this.form_data.abbreviation.length == 0
      ) {
        this.triggerNegativeLength("top");
      } else if (this.form_data.amount <= 200) {
        this.triggerNegativeAmount("top");
      }
    },
    triggerNegativeLength(position) {
      this.$q.notify({
        type: "negative",
        message: `You need to fill up the forms!`,
        position
      });
    },
    triggerNegativeAmount(position) {
      this.$q.notify({
        type: "negative",
        message: `Amount must be greater than or equal to 200!`,
        position
      });
    },
    triggerPositiveCancelled(position, orderNumber) {
      this.$q.notify({
        type: "positive",
        message: `Your Order Number ${orderNumber} Successfully cancelled!`,
        position
      });
    },
    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      let res = await this.$_post(postUpdateStatus, this.add_fund_info);
      this.$q.loading.hide();
      if (res.data.message == "success") {
        this.add_fund_info.status_payment = "Cancelled";
        this.triggerPositiveCancelled("top", orderNumber);
      } else {
        console.log("STATUS ERROR");
      }
    }
  }
};
</script>
<style>
#pay {
  font-weight: bolder;
}
</style>