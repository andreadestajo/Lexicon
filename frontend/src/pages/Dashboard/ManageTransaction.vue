<template>
  <div class="admin-table">
    <div class="row justify-center q-ma-lg">
      <div class="col-12">
        <div class="q-gutter-y-md" style="max-width: 2000px">
          <q-card class="manage__container">
            <div class="text-center text-h6 bg-default color-default font-bebas" id="header-h6">
              <p class="q-py-lg q-mb-none">
                Manage Transactions
              </p>
            </div>
            <q-tabs
              v-model="tab"
              dense
              class="text-white bg-default"
              active-color="warning"
              indicator-color="warning"
              align="justify"
            >
              <q-tab id="text-sizing" name="deposit">DEPOSIT</q-tab>
              <q-tab id="text-sizing" name="wire-transfer">WIRE TRANSFER</q-tab>
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel class="q-pa-none" name="wire-transfer">
                <div>
                  <div
                    style="-webkit-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.25);"
                  >
                    <u-q-manage-transactions></u-q-manage-transactions>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel class="q-pa-none" name="deposit">
                <div>
                  <div
                    style="-webkit-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.25);"
                  >
                    <u-q-manage-deposit></u-q-manage-deposit>
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
import UQManageTransactions from "../../components/UQManageTransactions";
import UQManageDeposit from "../../components/UQManageDeposit";

export default {
  components: {
    UQManageTransactions,
    UQManageDeposit,
  },
  data: () => ({
    tab: "deposit",
  }),
};
</script>

<style>
.manage__container {
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
  .manage__container {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#header-h6 {
  font-size: 35px;
}
.q-tab__label {
  font-size: 24px !important;
}
#text-sizing {
  font-size: 25px;
  font-weight: bold;
}
</style>

<style>
.admin-table {
  padding: 20px 150px;
}
</style>

<style>
@media (max-width: 1000px) {
  .admin-table {
    padding: 20px 50px;
  }
}
@media (max-width: 587px) {
  .admin-table {
    padding: 20px 10px;
  }
  #text-sizing {
    font-size: 18px;
  }
}
</style>