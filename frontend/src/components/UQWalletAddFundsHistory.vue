<template>
  <div class="history-bg">
    <div class="text-center text-h6 q-mb-md bg-default color-default" style="border-radius: 20px 20px 0 0" id="header-h6">
      <p class="deposit-css q-py-lg">
        <b>Deposit History</b>
      </p>
    </div>
    <div class="q-px-md q-pt-sm q-pb-md">
      <div class="q-gutter-y-md q-mb-lg" style="z-index: -999">
        <!-- <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-black font-bebas"
          active-color="orange"
          indicator-color="orange"
          align="justify"
          narrow-indicator
          style="letter-spacing: 1px;"
        >
          <q-tab @click="getTransactionHistory()" name="USD" label="USD" />
          <q-separator vertical />
          <q-tab @click="getTransactionHistory()" name="PHP" label="PHP" />
        </q-tabs>
        <q-separator />
        </q-card>-->
        <div class="q-mt-md">
          <div v-if="transaction_list.length == 0" class="text-center">
            <p>
              <b>No existing transaction</b>
            </p>
          </div>

          <div class v-for="transaction in transaction_list" :key="transaction._id">
            <!-- approve -->
            <div
              class="q-mb-md"
              v-if="transaction.status == 'Approved'"
              style="border-left: 4px solid green; border-radius: 5px"
            >
              <div
                style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.20);"
                class="row items-start q-pa-md"
                v-if="is_shown_history"
              >
                <div class="col-12 col-sm-6">
                  <div class="column items-start">
                    <div
                      class="col font-monseratt"
                      v-if="transaction.transaction_method == 'manual'"
                    >
                      <!-- Icons -->
                      <div class="row">
                        <div class="col">
                          <span v-if="transaction.status == 'Approved'">
                            <!-- <i class="fas fa-check-circle" style="color:green; font-size: 30px"></i> -->
                            <q-icon size="40px" name="img:add-funds-history/check.png" />
                          </span>
                        </div>
                        <div class="col">
                          <!-- end of icons -->
                          <!-- <div class="col" style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ new Date(transaction.date_created).toLocaleDateString() }}</b>
                          </div> -->
                          <div class="col" style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ moment(transaction.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</b>
                          </div>

                          <!-- <div
                            style="font-size: 13px; width: 80px"
                          >{{ new Date(transaction.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</div> -->
                          <div
                            style="font-size: 13px; width: 80px"
                          >{{ moment(transaction.date_created).tz("Europe/London").format('HH:mm') }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- order number -->
                    <div class="row q-pt-lg">
                      <div class="col-4.5">Ref. No:</div>
                      <div class="col-7.5">
                        <div class="font-raleway" v-if="transaction.transaction_method == 'manual'">
                          <strong class="q-ml-xs">{{transaction.orderNumber}}</strong>
                        </div>
                      </div>
                    </div>
                    <!-- end of order number -->

                    <!-- CANCEL ORDER BUTTON PER TRANSACTION -->
                    <!-- @click="cancelHandler(transaction.orderNumber)" -->
                    <br />
                    <q-separator id="desktop-items" />
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="column" id="items-in-end">
                    <!-- status -->
                    <div class="font-monseratt" v-if="transaction.transaction_method == 'manual'">
                      <div
                        class="text-green"
                        style="font-size: 20px"
                        v-if="transaction.status === 'Approved'"
                      >Received</div>
                    </div>
                    <!-- end of status -->
                    <br id="mobile-items" />
                    <!-- Via {{ transaction.transaction_method }} -->
                    <div
                      class="col"
                      v-if="transaction.transaction_method == 'manual'"
                      style="color: green; letter-spacing: 1px; font-size:20px"
                    >
                      <span v-if="transaction.status === 'Approved'">
                        <strong style="font-size: 30px">
                          {{ (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                          minimumFractionDigits:transaction.decimal_places}) }}
                        </strong>
                        {{transaction.currency_abbreviation }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="q-mb-md"
              v-if="transaction.status == 'Mark as paid'"
              style="border-left: 4px solid #ffa21f;"
            >
              <div
                style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.20);"
                class="row items-start q-pa-md"
                v-if="is_shown_history"
              >
                <div class="col-12 col-sm-6">
                  <div class="column items-start">
                    <div
                      class="col font-monseratt"
                      v-if="transaction.transaction_method == 'manual'"
                    >
                      <!-- Icons -->
                      <div class="row">
                        <div class="col">
                          <span v-if="transaction.status == 'Mark as paid'">
                            <!-- <i class="fas fa-clock" style="color:red; font-size: 30px"></i> -->
                            <q-icon size="40px" name="img:add-funds-history/pending.png" />
                          </span>
                        </div>
                        <!-- end of icons -->
                        <div class="col">
                          <!-- end of icons -->
                          <!-- <div class="col" style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ new Date(transaction.date_created).toLocaleDateString() }}</b>
                          </div> -->
                          <div class="col" style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ moment(transaction.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</b>
                          </div>

                          <!-- <div
                            style="font-size: 13px; width: 80px"
                          >{{ new Date(transaction.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</div> -->
                          <div
                            style="font-size: 13px; width: 80px"
                          >{{ moment(transaction.date_created).tz("Europe/London").format('HH:mm') }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="row q-pt-lg">
                      <div class="col-4.5">Ref. No:</div>
                      <div class="col-7.5">
                        <div class="font-raleway" v-if="transaction.transaction_method == 'manual'">
                          <strong class="q-ml-xs">{{transaction.orderNumber}}</strong>
                        </div>
                      </div>
                    </div>

                    <!-- end of status -->

                    <!-- CANCEL ORDER BUTTON PER TRANSACTION -->
                    <!-- @click="cancelHandler(transaction.orderNumber)" -->

                    <div v-if="transaction.status === 'Mark as paid'">
                      <q-dialog v-model="cancel" persistent>
                        <q-card class="q-pa-lg">
                          <q-card-section class="text-center q-pb-none">
                            <q-avatar icon="question_answer" color="accent" text-color="white" />
                            <div class="q-mt-md">are you sure you want to cancel your add funds?</div>
                          </q-card-section>
                          <q-card-section>
                            <div class="text-center row justify-around">
                              <div class="col-5">
                                <q-btn
                                  @click="cancelHandler(transaction.orderNumber)"
                                  color="accent"
                                  unelevated
                                  class="full-width q-mt-md"
                                  v-close-popup
                                >Yes</q-btn>
                              </div>
                              <div class="col-5">
                                <q-btn
                                  outline
                                  unelevated
                                  label="No"
                                  color="accent"
                                  class="full-width q-mt-md"
                                  v-close-popup
                                />
                              </div>
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-dialog>
                    </div>

                    <!-- END CANCEL TRANSACTION BUTTON -->
                    <br />
                    <q-separator id="desktop-items" />
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="column" id="items-in-end">
                    <!-- status -->
                    <div class="font-monseratt" v-if="transaction.transaction_method == 'manual'">
                      <div
                        class="text-orange font-monseratt"
                        style="font-size: 20px"
                        v-if="transaction.status === 'Mark as paid'"
                      >Awaiting Funds</div>
                    </div>
                    <!-- end of status -->
                    <br />
                    <!-- Via {{ transaction.transaction_method }} -->
                    <div
                      class="col"
                      v-if="transaction.transaction_method == 'manual'"
                      style="color: #ffa21f; letter-spacing: 1px; font-size:20px"
                    >
                      <span v-if="transaction.status === 'Mark as paid'">
                        <strong style="font-size: 30px">
                          {{ (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                          minimumFractionDigits:transaction.decimal_places}) }}
                        </strong>
                        {{transaction.currency_abbreviation }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cancelled -->

            <div
              class="q-mb-md"
              v-if="transaction.status == 'Canceled'"
              style="border-left: 4px solid red; border-radius: 5px"
            >
              <div
                style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.20);"
                class="row items-start q-pa-md"
                v-if="is_shown_history"
              >
                <div class="col-12 col-sm-6">
                  <div class="column items-start">
                    <div
                      class="col font-monseratt"
                      v-if="transaction.transaction_method == 'manual'"
                    >
                      <!-- Icons -->
                      <div class="row">
                        <div class="col">
                          <span v-if="transaction.status == 'Canceled'">
                            <!-- <i class="fas fa-times-circle" style="color:red; font-size: 30px"></i> -->
                            <q-icon size="40px" name="img:add-funds-history/ex.png" />
                          </span>
                        </div>
                        <div class="col">
                          <!-- end of icons -->
                          <!-- <div style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ new Date(transaction.date_created).toLocaleDateString() }}</b>
                          </div> -->
                          <div class="col" style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ moment(transaction.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</b>
                          </div>

                          <!-- <div
                            style="font-size: 13px; width: 80px"
                          >{{ new Date(transaction.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</div> -->
                          <div
                            style="font-size: 13px; width: 80px"
                          >{{ moment(transaction.date_created).tz("Europe/London").format('HH:mm') }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- order number -->
                    <div class="row q-pt-lg">
                      <div class="col-4.5">Ref. No:</div>
                      <div class="col-7.5">
                        <div class="font-raleway" v-if="transaction.transaction_method == 'manual'">
                          <strong class="q-ml-xs">{{transaction.orderNumber}}</strong>
                        </div>
                      </div>
                    </div>
                    <!-- end of order number -->

                    <!-- end of status -->

                    <!-- CANCEL ORDER BUTTON PER TRANSACTION -->
                    <!-- @click="cancelHandler(transaction.orderNumber)" -->

                    <!-- END CANCEL TRANSACTION BUTTON -->
                    <br />
                    <q-separator id="desktop-items" />
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="column" id="items-in-end">
                    <!-- status -->
                    <div class="font-monseratt" v-if="transaction.transaction_method == 'manual'">
                      <div
                        style="font-size: 20px"
                        class="text-red font-monseratt"
                        v-if="transaction.status === 'Canceled'"
                      >{{transaction.status}}</div>
                    </div>
                    <br id="mobile-items" />
                    <!-- Via {{ transaction.transaction_method }} -->
                    <div
                      v-if="transaction.transaction_method == 'manual'"
                      style="color: red; letter-spacing: 1px; font-size:20px"
                    >
                      <span v-if="transaction.status === 'Canceled'">
                        <strong style="font-size: 30px">
                          {{ (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                          minimumFractionDigits:transaction.decimal_places}) }}
                        </strong>
                        {{transaction.currency_abbreviation }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending -->
            <div
              class="q-mb-md"
              v-if="transaction.status == 'pending'"
              style="border-left: 4px solid #ffa21f; border-radius: 5px"
            >
              <div
                style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.20);"
                class="row items-start q-pa-md"
                v-if="is_shown_history"
              >
                <div class="col-12 col-sm-6">
                  <div class="column items-start">
                    <div
                      class="col font-monseratt"
                      v-if="transaction.transaction_method == 'manual'"
                    >
                      <!-- Icons -->
                      <div class="row">
                        <div class="col">
                          <span v-if="transaction.status == 'pending'">
                            <!-- <i class="fas fa-clock" style="color:red; font-size: 30px"></i> -->
                            <q-icon size="40px" name="img:add-funds-history/pending.png" />
                          </span>
                        </div>
                        <!-- end of icons -->
                        <div class="col">
                          <!-- <div style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ new Date(transaction.date_created).toLocaleDateString() }}</b>
                          </div> -->
                          <div class="col" style="font-size: 13px; letter-spacing: 1px;">
                            <b>{{ moment(transaction.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</b>
                          </div>

                          <!-- <div
                            style="font-size: 13px; width: 80px"
                          >{{ new Date(transaction.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</div> -->
                          <div
                            style="font-size: 13px; width: 80px"
                          >{{ moment(transaction.date_created).tz("Europe/London").format('HH:mm') }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row q-pt-lg">
                      <div class="col-4.5">Ref. No:</div>
                      <div class="col-7.5">
                        <div class="font-raleway" v-if="transaction.transaction_method == 'manual'">
                          <strong class="q-ml-xs">{{transaction.orderNumber}}</strong>
                        </div>
                      </div>
                    </div>

                    <div class="col" v-if="transaction.transaction_method == 'manual'">
                      <q-chip
                        style="background: #ffa21f"
                        class="text-white font-monseratt"
                        v-if="transaction.status === 'Mark as paid'"
                      >{{transaction.status}}</q-chip>
                    </div>
                    <!-- end of status -->

                    <!-- CANCEL ORDER BUTTON PER TRANSACTION -->
                    <!-- @click="cancelHandler(transaction.orderNumber)" -->

                    <div v-if="transaction.status === 'pending'">
                      <q-dialog v-model="cancel" persistent>
                        <q-card class="q-pa-lg">
                          <q-card-section class="text-center q-pb-none">
                            <q-avatar icon="question_answer" color="accent" text-color="white" />
                            <div class="q-mt-md">are you sure you want to cancel your add funds?</div>
                          </q-card-section>
                          <q-card-section>
                            <div class="text-center row justify-around">
                              <div class="col-5">
                                <q-btn
                                  @click="cancelHandler(transaction.orderNumber)"
                                  color="accent"
                                  unelevated
                                  class="full-width q-mt-md"
                                  v-close-popup
                                >Yes</q-btn>
                              </div>
                              <div class="col-5">
                                <q-btn
                                  outline
                                  unelevated
                                  label="No"
                                  color="accent"
                                  class="full-width q-mt-md"
                                  v-close-popup
                                />
                              </div>
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-dialog>
                    </div>

                    <!-- END CANCEL TRANSACTION BUTTON -->
                    <br />
                    <q-separator id="desktop-items" />
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="column" id="items-in-end">
                    <div
                      class="col font-bebas"
                      v-if="transaction.transaction_method == 'manual'"
                      style="color: red; letter-spacing: 1px; font-size:20px"
                    >
                      <span v-if="transaction.status === 'Canceled'">
                        <s>
                          {{ (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                          minimumFractionDigits:transaction.decimal_places}) + " " + transaction.currency_abbreviation }}
                        </s>
                      </span>
                    </div>

                    <div
                      class="col font-monseratt"
                      v-if="transaction.transaction_method == 'manual'"
                    >
                      <div
                        class="text-orange font-monseratt"
                        style="font-size: 20px"
                        v-if="transaction.status === 'pending'"
                      >Awaiting Funds</div>
                    </div>
                    <br id="mobile-items" />
                    <!-- Via {{ transaction.transaction_method }} -->

                    <div
                      v-if="transaction.transaction_method == 'manual'"
                      style="color: #ffa21f; letter-spacing: 1px; font-size:20px"
                    >
                      <span
                        v-if=" transaction.status === 'pending' || transaction.status === 'Mark as paid'"
                      >
                        <strong style="font-size: 30px">
                          {{ (transaction.amount / 10 ** transaction.decimal_places).toLocaleString("en-US", {
                          minimumFractionDigits:transaction.decimal_places}) }}
                        </strong>
                        {{transaction.currency_abbreviation }}
                      </span>
                    </div>

                    <div v-if="transaction.status === 'pending'">
                      <q-dialog v-model="confirm" persistent>
                        <q-card class="q-pa-lg">
                          <q-card-section class="text-center q-pb-none">
                            <q-avatar icon="cloud_upload" color="accent" text-color="white" />
                            <div class="q-mt-md">
                              Upload here your Deposit Slip together with your Order#. Write it on your deposit slip.
                              <br />(ex. Order#: Lexicon-asfdv123)
                            </div>
                          </q-card-section>
                          <q-card-section>
                            <q-form enctype="multipart/form-data">
                              <q-input
                                type="file"
                                v-model="form_data.deposit_slip_path"
                                @change="uploadFile1"
                                :rules="[val => !!val]"
                                accept="image/jpeg, image/jpg, image/png"
                                ref="file"
                                class="q-mt-md"
                              />
                              <div class="text-center row">
                                <div class="col-12">
                                  <q-btn
                                    color="accent"
                                    unelevated
                                    class="full-width q-mt-md"
                                    @click="uploadDeposit(transaction._id, transaction.orderNumber)"
                                  >Submit proof</q-btn>
                                </div>
                                <div class="col-12">
                                  <q-btn
                                    outline
                                    unelevated
                                    label="Cancel"
                                    color="accent"
                                    class="full-width q-mt-md"
                                    v-close-popup
                                  />
                                </div>
                              </div>
                            </q-form>
                          </q-card-section>
                        </q-card>
                      </q-dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="transaction_list.length >= skip + 3"
          class="text-center q-mt-xl q-mb-sm"
          style="font-size: 16px"
        >
          <a
            class="bg-default color-default q-pa-md"
            style="text-decoration: none; border-radius: 5px"
            @click="proceedTransactionHistory()"
          >See more</a>
        </div>
        <div
          v-else-if="transaction_list.length > 0"
          class="text-center q-mt-lg"
          style="font-size: 15px"
        >
          <p class="font-raleway">End of transaction</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  postGetAddFundHistory,
  postUpdateStatus,
  postUploadDepositSlip,
} from "../references/url";
import Vue from "vue";
import VueSimpleAlert from "vue-simple-alert";
import moment from 'moment-timezone';

Vue.use(VueSimpleAlert);

export default {
  data: () => ({
    moment: moment,
    form_data: {
      deposit_slip_path: "",
    },
    cancel: false,
    confirm: false,
    transaction_list: [],
    skip: 0,
    tab: "USD",
    is_shown_history: false,
    confirm: false,
  }),
  mounted() {
    this.getTransactionHistory();
  },
  methods: {
    triggerPositiveUpload(position, ordernumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Your Order Number ${ordernumber} Successfully uploaded!`,
      //   position,
      // });
      this.$q.notify({
          message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Your deposit slip is successfully submitted.</div>`,
          position: 'top',
          color: 'white',
          html: true,
      });
    },
    triggerPositiveCanceled(position, ordernumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Your Order Number ${ordernumber} Successfully canceled!`,
      //   position,
      // });
      this.$q.notify({
          message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Your deposit is successfully canceled.</div>`,
          position: 'top',
          color: 'white',
          html: true,
      });
    },
    triggerNegativeUpload(position) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `You need to choose a file`,
      //   position,
      // });
      this.$q.notify({
          message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to choose a file.</div>`,
          position: 'top',
          color: 'white',
          html: true,
      });
    },
    uploadFile1(event) {
      this.form_data.deposit_slip_path = event.target.files[0];
      // console.log(event);
    },
    async getTransactionHistory() {
      if (this.$token) {
        setTimeout(async () => {
          this.skip = 0;
          this.is_shown_history = false;
          this.$q.loading.show();
          await this.$_post(postGetAddFundHistory, {
            user_id: this.$user_info._id,
            abbreviation: this.tab,
          }).then((res) => {
            this.$q.loading.hide();
            this.transaction_list = res.data;
          });
          this.is_shown_history = true;
        }, 50);
      }
    },

    async proceedTransactionHistory() {
      if (this.$token) {
        setTimeout(async () => {
          this.skip += 3;
          await this.$_post(postGetAddFundHistory, {
            user_id: this.$user_info._id,
            abbreviation: this.tab,
            skip: this.skip,
          }).then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              this.transaction_list.push(res.data[i]);
            }
          });
        }, 50);
      }
    },
    async uploadDeposit(id, orderNumber) {
      this.$q.loading.show();
      if (this.form_data.deposit_slip_path == "") {
        this.triggerNegativeUpload("top", orderNumber);
      } else {
        const fd = new FormData();
        fd.append("deposit_slip_path", this.form_data.deposit_slip_path);
        fd.append("id", id);

        let res = await this.$_post(postUploadDepositSlip, fd);
        console.log(res);
        if (res) {
          this.triggerPositiveUpload("top", orderNumber);
          this.getTransactionHistory();
        }
      }
      this.$q.loading.hide();
    },
    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      let res = await this.$_post(postUpdateStatus, {
        order_number: orderNumber,
      });
      if (res) {
        console.log("SUCCESS FULLY CANCELED");
        this.getTransactionHistory();
        this.triggerPositiveCanceled("top", orderNumber);
      }

      this.$q.loading.hide();
    },
  },
};
</script>


<style>
.q-tab__label {
  font-size: 30px;
}
.history-bg {
  background: white;
  border-radius: 30px;
   border: 2px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
.history-bg:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
#items-in-end {
  text-align: right;
}
</style>

<style>
@media (max-width: 599px) {
  #items-in-end {
    text-align: left;
  }
  #mobile-items {
    display: none;
  }
}
@media (min-width: 600px) {
  #desktop-items {
    display: none;
  }
}
</style>