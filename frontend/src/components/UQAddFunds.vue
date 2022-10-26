<template>
  <div>
    <!--Manual and Paypal Button  -->
    <div v-if="isManual == false" class="row">
      <div class="col">
        <q-btn class="q-mt-md" color="accent" label="Manual add fund" @click="isManual=true" />
      </div>
      <div class="col">
        <PayPal class="q-mt-md" amount="10.00" currency="USD" :client="credentials"></PayPal>
      </div>
    </div>
    <!-- End of Manual and Paypal Button -->

    <!-- Manual add funds component -->
    <div v-model="isManual" v-else>
      <u-q-manual-add-funds />
      <q-btn
        type="submit"
        @click="isManual = false"
        color="secondary"
        unelevated
        class="full-width q-mt-md"
        outline
      >Back</q-btn>
    </div>
    <!-- end of Manual add funds component -->
  </div>
</template>
<script>
import fiat from "../references/fiat";
import { postAddFunds } from "../references/url";
import UQManualAddFunds from "../components/UQManualAddFunds";
import PayPal from "vue-paypal-checkout";

export default {
  data: () => ({
    form_data: {
      abbreviation: "",
      amount: ""
    },
    isManual: false,
    fiatOptions: fiat
  }),
  paypal: {
    sandbox:
      "Ad1voWYq3VL8J4jy6zWARKwz4tjbuDl_TFBa3WQqy_DwAFWd7hkU4i99jijGqaoqU3E-ODqXDayVnOdl",
    production: ""
  },
  aStyle: {
    label: "pay",
    size: "small",
    shape: "rect",
    color: "gold"
  },
  components: {
    UQManualAddFunds,
    PayPal
  },
  methods: {}
};
</script>