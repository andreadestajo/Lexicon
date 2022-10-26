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
    <div v-if="!is_show_success" class="field q-pa-xl">
      <div class="q-mb-sm">
        <strong class="font-monseratt">Current Frequency: {{ frequency }}</strong>
      </div>
      <q-form @submit="setConversionFrequency()">
        <q-select
          color="accent"
          class="q-mb-sm full-width"
          outlined
          dense
          v-model="form_data.time"
          use-input
          behavior="menu"
          hide-selected
          fill-input
          input-debounce="0"
          label="Conversion Frequency"
          :options="frequencyOptions"
          :rules="[val => !!val || '* Field is required']"
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey font-monseratt">No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <div class="row">
          <div class="col-12 text-center">
            <q-btn
              rounded
              type="submit"
              unelevated
              class="q-mt-lg full-width btn-set-frequency font-oswald"
              color="accent"
            >Set Conversion Frequency</q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import {
  postSetConversionFrequency,
  postViewFrequency,
} from "../../references/url";
import frequencyList from "../../references/frequency_list";

export default {
  data: () => ({
    form_data: {
      time: "",
    },
    frequencyOptions: frequencyList,
    is_show_success: false,
    frequency: "",
  }),

  mounted() {
    this.viewConversionFrequency();
  },
  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.frequencyOptions = frequencyList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.frequencyOptions = frequencyList.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    async setConversionFrequency() {
      this.$q.loading.show();
      let res = await this.$_post(postSetConversionFrequency, this.form_data);
      this.$q.loading.hide();
      if (res) {
        // this.is_show_success = true;
        await this.viewConversionFrequency();
        // this.$q.notify({
        //   type: `positive`,
        //   message: `Conversion Frequency Updated Successfully.`,
        //   position: "top",
        // });
        this.$q.notify({
            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Conversion Frequency Updated Successfully.</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
      }
    },

    async backToConvert() {
      window.location.reload();
    },

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
.btn-set-frequency {
  letter-spacing: 1px;
  font-size: 15px;
}
</style>