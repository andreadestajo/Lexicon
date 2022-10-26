=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <!-- **Author: VP -->
    <!-- content -->
    <div>
      <q-markup-table flat bordered>
        <thead class="bg-default font-monseratt">
          <tr>
            <th colspan="5">
              <div class="row no-wrap text-center">
                <div class="text-h4 text-white q-mx-auto">Current Fees</div>
              </div>
            </th>
          </tr>
          <tr class="text-white text-weight-bolder" id="table-header-fee">
            <th class="text-left">Fee Type</th>
            <th class="text-left">Status</th>
            <th class="text-left">Charge Type</th>
            <th class="text-right">Value</th>
            <th class="text-right">Action</th>
          </tr>
        </thead>
        <tbody class="font-monseratt">
          <tr v-for="data in default_data" :key="data._id">
            <td class="text-left">{{ data.fee_type }}</td>
            <td class="text-left">{{ data.is_enabled ? "Fee Included" : "No Fee"}}</td>
            <td class="text-left">{{ data.charge_type }}</td>
            <td
              class="text-right"
            >{{ data.charge_type == "Fixed" ? "$" + data.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : data.charge_type == "Percentage" ? data.value + "%" : "" }}</td>
            <td class="text-right">
              <q-btn
                flat
                class="text-white"
                @click="editFee(data.fee_type, data.is_enabled, data.charge_type, data.value)"
              >
                <i class="fas fa-pen"></i>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-dialog v-model="alert" persistent>
        <q-card class="edit-container">
          <q-card-section>
            <div class="text-h4 q-mb-md font-monseratt edit-fees-container">Edit Fees</div>
            <hr class="q-mb-md" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div>
              <q-form @submit="updateFee()">
                <q-input
                  class="full-width q-mb-sm font-monseratt"
                  outlined
                  dense
                  readonly
                  v-model="form_data.fee_type"
                  label="Fee Type"
                  required
                />

                <q-btn-toggle
                  @input="enableInput"
                  v-model="form_data.is_enabled"
                  spread
                  class="q-mb-sm font-monseratt btn-toggle"
                  no-caps
                  unelevated
                  toggle-color="accent"
                  color="white"
                  text-color="accent"
                  :options="[
                {label: 'Include Fee', value: true,},
                {label: 'No Fee', value: false}
                ]"
                />
                <q-select
                  color="accent"
                  v-if="form_data.is_enabled"
                  @input="chargeInput"
                  class="font-monseratt"
                  outlined
                  dense
                  v-model="form_data.charge_type"
                  label="Charge Type"
                  :options="['Percentage', 'Fixed']"
                  :rules="[val => !!val || '* Field is required']"
                  required
                />
                <q-select
                  color="accent"
                  v-if="form_data.is_enabled"
                  outlined
                  dense
                  required
                  class="font-monseratt"
                  v-model="form_data.value"
                  :options="form_data.charge_type == 'Percentage' ? valueList.Percentage : valueList.Fixed"
                  :rules="[val => !!val || '* Field is required']"
                  label="Value"
                >
                  <template
                    v-slot:append
                  >{{ form_data.charge_type == "Fixed" ? "$" : form_data.charge_type == "Percentage" ? "%" : ""}}</template>
                </q-select>
                <div class="row justify-end font-oswald">
                  <div class="col-3 q-mr-md">
                    <q-btn
                      type="submit"
                      unelevated
                      class="full-width update-btn"
                      color="accent"
                    >Update</q-btn>
                  </div>
                  <div class="col-2 q-mr-sm">
                    <q-btn label="Close" color="accent" outline v-close-popup />
                  </div>
                </div>
              </q-form>
            </div>
          </q-card-section>

          <q-card-actions align="right"></q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { postUpdateFee, postViewFees } from "../../references/url";
import feeList from "../../references/fee_list";
import valueList from "../../references/value_list";

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
#table-header-fee {
  background: #2f4c7e !important;
}
.fa-pen {
  color: #2f4c7e;
  font-size: 18px;
}
.edit-container {
  padding: 30px 60px;
}
.edit-fees-container {
  width: 400px;
}
.update-btn {
  letter-spacing: 1px;
  font-size: 14px;
}
.btn-toggle {
  border: 1px solid accent;
}
</style>
