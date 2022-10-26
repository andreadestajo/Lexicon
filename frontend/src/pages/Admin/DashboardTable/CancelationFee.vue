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
              CANCELLATION FEE
            </b>
          </div>
          <p id="p-font-cancellation-fee" class="font-bebas">
            <b v-if=" this.default_data[3].charge_type == 'Percentage' ">
              {{ this.default_data[3].value == 0 ? 'No fee' : this.default_data[3].value }}
              <span
                v-if=" this.default_data[3].value != 0 "
              >{{ this.default_data[3].charge_type == 'Percentage' ? '%' : '$'}}</span>
            </b>

            <b v-if=" this.default_data[3].charge_type == 'Fixed' ">
              <span
                v-if=" this.default_data[3].value != 0 "
              >{{ this.default_data[3].charge_type == 'Percentage' ? '%' : '$'}}</span>
              {{ this.default_data[3].value == 0 ? 'No fee' : this.default_data[3].value }}
            </b>

            <b v-if=" this.default_data[3].value == 0">
              <span
                v-if=" this.default_data[3].value != 0 "
              >{{ this.default_data[3].charge_type == 'Percentage' ? '%' : '$'}}</span>
              {{ this.default_data[3].value == 0 ? 'No fee' : this.default_data[3].value }}
            </b>
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { postUpdateFee, postViewFees } from "../../../references/url";
import feeList from "../../../references/fee_list";
import valueList from "../../../references/value_list";

export default {
  data: () => ({
    form_data: {
      fee_type: "",
      is_enabled: true,
      charge_type: null,
      value: 0,
    },
    fee_options: feeList,
    value_options: [],
    is_show_success: false,
    is_show_fee: true,
    default_data: [],
    alert: false,
    valueList: valueList,
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

    async chargeInput() {
      if (this.form_data.charge_type == "Percentage") {
        this.value_options = this.valueList.Percentage;
      } else {
        this.value_options = this.valueList.Fixed;
      }
      this.form_data.value = this.value_options[0];
    },

    async enableInput() {
      this.form_data.charge_type = null;
      this.form_data.value = 0;
    },

    async updateFee() {
      let res = await this.$_post(postUpdateFee, this.form_data);
      if (res) {
        await this.viewFees();
        // this.$q.notify({
        //   type: `positive`,
        //   message: `Fee updated successfully.`,
        //   position: "top",
        // });
        this.$q.notify({
            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Fee updated successfully.</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
        this.alert = false;
      }
    },

    async backToFees() {
      window.location.reload();
    },

    async editFee(fee_type, is_enabled, charge_type, value) {
      this.form_data.fee_type = fee_type;
      this.form_data.is_enabled = is_enabled;
      this.form_data.charge_type = charge_type;
      this.form_data.value = value;
      this.alert = true;
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

#p-font-cancellation-fee {
  font-size: 50px;
}
</style>
