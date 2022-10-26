=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <q-card class="my-card dashboard-cards">
      <q-card-section class="text-center">
        <div class="text-grey font-raleway" id="header-font">
          <b>
            <i class="fas fa-exchange-alt q-mr-md q-pa-sm"></i>
            CONVERSION FREQUENCY
          </b>
        </div>
        <p class="font-bebas" id="p-font-frequency">
          <b>{{ frequency }}</b>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { postViewFrequency } from "../../../references/url";
import frequencyList from "../../../references/frequency_list";

export default {
  data: () => ({
    frequency: "",
  }),

  mounted() {
    this.viewConversionFrequency();
  },
  methods: {
    async viewConversionFrequency() {
      this.$q.loading.show();
      let res = await this.$_post(postViewFrequency);
      this.frequency = res.data.frequency;
      this.$q.loading.hide();
    },
  },
};
</script>
<style>
#header-font {
  font-size: 18px;
}
.fa-exchange-alt {
  font-size: 25px;
  border-radius: 50%;
  background-color: #2f4c7e;
  color: #fff;
}
#p-font-frequency {
  font-size: 50px;
}
</style>

