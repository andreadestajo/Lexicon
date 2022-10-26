=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div class="admin-table">
    <div class="row justify-center q-ma-lg">
      <div class="col-12">
        <div class="q-gutter-y-md">
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-white bg-default font-oswald"
              active-color="warning"
              indicator-color="warning"
              align="justify"
              narrow-indicator
            >
              <q-tab name="fees" label="Fees" />
              <q-tab name="conversion_frequency" label="Conversion Frequency" />
              <q-tab name="add_currency" label="Add Currency" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" class="q-mb-xl" animated>
              <q-tab-panel name="fees">
                <div class="fee-container">
                  <div class="shadow-card">
                    <u-q-fee></u-q-fee>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="conversion_frequency">
                <div class="conversion-frequency-container">
                  <div class="shadow-card">
                    <u-q-conversion-frequency></u-q-conversion-frequency>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="add_currency">
                <div class="add-currency-container">
                  <div class="shadow-card">
                    <u-q-add-currency></u-q-add-currency>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddCurrency from "../../pages/Admin/AddCurrency";
import AddCurrencyTable from "../../pages/Admin/DashboardTable/AddCurrencyTable";
import UQAddCurrency from "../../components/global_settings/UQAddCurrency";
import UQConversionFrequency from "../../components/global_settings/UQConversionFrequency";
import UQFee from "../../components/global_settings/UQFee";

export default {
  data: () => ({ tab: "fees" }),

  components: { UQAddCurrency, UQFee, UQConversionFrequency, AddCurrencyTable },
};
</script>
<style>
.q-tab__label {
  font-size: 20px !important;
}
</style>

<style>
.add-currency-container {
  padding: 30px 150px;
}
.conversion-frequency-container {
  padding: 30px 280px;
}
.fee-container {
  padding: 30px 100px;
}
.admin-table {
  padding: 20px 150px;
}
.shadow-card {
  -webkit-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.25);
}

@media (max-width: 1023px) {
  .fee-container,
  .conversion-frequency-container,
  .add-currency-container {
    padding: 0px !important;
  }
}
</style>