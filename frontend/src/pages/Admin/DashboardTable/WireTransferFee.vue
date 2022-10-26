=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <div>
      <q-card class="my-card dashboard-cards">
        <q-card-section class="text-center">
          <div class="text-grey font-raleway" id="header-font">
            <b>
              <i class="fas fa-wave-square q-mr-md q-pa-sm"></i>
              WIRE TRANSFER FEE
            </b>
          </div>
          <p class="font-bebas" id="p-font-wire-transfer-fee">
            <b v-if=" this.default_data[2].charge_type == 'Percentage' ">
              {{ this.default_data[2].value == 0 ? 'No fee' : this.default_data[2].value }}
              <span
                v-if=" this.default_data[2].value != 0 "
              >{{ this.default_data[2].charge_type == 'Percentage' ? '%' : '$'}}</span>
            </b>

            <b v-if=" this.default_data[2].charge_type == 'Fixed' ">
              <span
                v-if=" this.default_data[2].value != 0 "
              >{{ this.default_data[2].charge_type == 'Percentage' ? '%' : '$'}}</span>
              {{ this.default_data[2].value == 0 ? 'No fee' : this.default_data[2].value }}
            </b>

            <b v-if=" this.default_data[2].value == 0">
              <span
                v-if=" this.default_data[2].value != 0 "
              >{{ this.default_data[2].charge_type == 'Percentage' ? '%' : '$'}}</span>
              {{ this.default_data[2].value == 0 ? 'No fee' : this.default_data[2].value }}
            </b>
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { postViewFees } from "../../../references/url";

export default {
  data: () => ({
    default_data: [],
  }),

  mounted() {
    this.viewFees();
  },
  methods: {
    async viewFees() {
      setTimeout(async () => {
        this.$q.loading.show();
        await this.$_post(postViewFees).then((res) => {
          this.$q.loading.hide();
          this.default_data = res.data;
        });
      }, 50);
    },
  },
};
</script>
<style>
.bg-table {
  background-color: rgb(255, 186, 62);
}
.fa-wave-square {
  font-size: 25px;
  border-radius: 50%;
  background-color: #2f4c7e;
  color: #fff;
}
#header-font {
  font-size: 18px;
}

#p-font-wire-transfer-fee {
  font-size: 50px;
}
</style>
