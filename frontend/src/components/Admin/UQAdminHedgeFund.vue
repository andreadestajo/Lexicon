 =========================================
Title: Design
Author: Pergentino S. Galang II
Date: 14 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <div class>
      <div class>
        <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
          <template slot="table_rows" slot-scope="props">
            <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
            <q-td key="full_name">{{props.data.full_name}}</q-td>
            <q-td key="fund_type">{{props.data.fund_type}}</q-td>
            <q-td key="currency_abbreviation">{{props.data.currency_abbreviation}}</q-td>
            <q-td key="amount" align="right">
              {{(props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
              minimumFractionDigits:props.data.decimal_places})}}
            </q-td>
            <q-td key="status" align="center" v-if="props.data.status == 'Approved'">
              <q-badge color="positive" class="q-pa-sm awaiting-funds">Approved</q-badge>
            </q-td>

               <q-td align="center"  key="status" v-if="props.data.status == 'pending'">
              <q-badge color="warning" class="q-pa-sm">Pending</q-badge>
            </q-td>

            <q-td align="center">
              <q-btn
                v-if="props.data.status === 'Mark as paid' || props.data.status === 'pending'"
                flat
                class="q-mr-md text-white"
                @click="viewKyc(props.data)"
              >
                <i class="fas fa-eye q-mr-sm"></i>
              </q-btn>
            </q-td>
          </template>
        </u-q-table>
      </div>
    </div>

    <u-q-modal ref="kyc_modal" :is_persistent="true" :modal_data="modal.kyc_details">
      <div class="text-h6" slot="modal-header">Hedge Fund Transaction Details</div>
      <div slot="modal-content" slot-scope="props">
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>FULL NAME</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.full_name}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>DATE AND TIME CREATED</q-item-label>
            </q-item-section>
            <q-item-section>
              <!-- <q-item-label>{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} at {{ new Date(props.data.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</q-item-label> -->
              <q-item-label>{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} at {{ moment(props.data.date_created).tz("Europe/London").format('HH:mm') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>AMOUNT</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{(props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
                minimumFractionDigits:props.data.decimal_places})}} {{props.data.currency_abbreviation}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>STATUS</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.status}}</q-item-label>
            </q-item-section>
          </q-item> -->
        </q-list>
      </div>

      <!-- <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>


          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>-->

      <div slot="modal-footer" slot-scope="props">
        <q-card-actions>
          <q-btn
            class="btn-canceled q-mr-sm"
            label="CANCEL HEDGE FUND"
            color="negative"
            @click="cancel = true"
            v-if=" props.data.status === 'pending'"
          />
          <q-btn
            class="btn-approve q-mr-sm"
            label="APPROVE"
            v-if="props.data.status === 'Mark as paid' || props.data.status === 'pending'"
            @click="approve = true"
          />

          <!-- approve button -->
          <div v-if="props.data.status === 'Mark as paid' || props.data.status === 'pending' ">
            <q-dialog v-model="approve" persistent>
              <q-card>
                <q-card-section class="text-center q-pb-none">
                  <div class="text-h6 font-monseratt">Annual Interest Rate And Contract</div>
                </q-card-section>

                <q-card-section class="text-center q-pb-none">
                  <q-label style="float:left">From:</q-label>
                  <!-- <q-input
                    v-model="form_data.date_from"
                    type="date"
                    data-date-format="DD MMMM YYYY"
                    outlined
                    color="accent"
                    :rules="[val => !!val || '*Field is required']"
                    :dense="dense"
                  />-->

                  <q-input
                    v-model="form_data.date_from"
                    mask="date"
                    color="accent"
                    :rules="[val => !!val || '*Field is required']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            color="accent"
                            v-model="form_data.date_from"
                            @input="() => $refs.qDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-card-section>

                <q-card-section class="text-center q-pb-none">
                  <q-label style="float:left">To:</q-label>
                  <!-- <q-input
                    v-model="form_data.date_to"
                    type="date"
                    data-date-format="DD MMMM YYYY"
                    outlined
                    color="accent"
                    :rules="[val => !!val || '*Field is required']"
                    :dense="dense"
                  />-->

                  <q-input
                    v-model="form_data.date_to"
                    mask="date"
                    color="accent"
                    :rules="[val => !!val || '*Field is required']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            default-view="Years"
                            color="accent"
                            v-model="form_data.date_to"
                            @input="() => $refs.qDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-card-section>

                <q-card-section class="text-center q-pb-none">
                  <q-label style="float:left">Annual Rate</q-label>
                  <q-input
                    v-model.number="form_data.rate"
                    min="1"
                    :rules="[val => !!val || '*Field is required']"
                    type="number"
                    :dense="dense"
                  >
                    <template v-slot:append>%</template>
                  </q-input>
                </q-card-section>
                <q-card-section>
                  <div class="text-center row justify-end font-oswald">
                    <div class="col-3 q-mr-md">
                      <q-btn
                        @click="approveHandler(
                          props.data._id, 
                          props.data.user_id, 
                          props.data.amount, 
                          props.data.decimal_places
                        )"
                        type="submit"
                        color="accent"
                        unelevated
                        class="full-width q-mt-md"
                        v-close-popup
                      >Yes</q-btn>
                    </div>
                    <div class="col-3">
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

          <!-- approve button  -->

          <!-- canceled button -->
          <div v-if="props.data.status === 'pending'">
            <q-dialog v-model="cancel" persistent>
              <q-card>
                <q-card-section class="text-center q-pb-none">
                  <div class="text-h6 font-monseratt">
                    Are you sure you want to cancel deposit with Transaction Number
                    <span
                      class="text-weight-bolder"
                    >{{props.data.orderNumber}}</span>?
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-center row justify-end font-oswald">
                    <div class="col-3 q-mr-md">
                      <q-btn
                        @click="cancelHandler(props.data._id)"
                        type="submit"
                        color="accent"
                        unelevated
                        class="full-width"
                        v-close-popup
                      >Yes</q-btn>
                    </div>
                    <div class="col-3">
                      <q-btn
                        outline
                        unelevated
                        label="No"
                        color="accent"
                        class="full-width"
                        v-close-popup
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
          <!-- canceled button -->
          <q-btn outline color="accent" label="CLOSE" v-close-popup />
        </q-card-actions>
      </div>
    </u-q-modal>
  </div>
</template>
 

<script>
import moment from "moment-timezone";
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";

import {
  getAddFundHistory,
  postUpdateStatus,
  updateApproveAddFunds,
  getAllHedgeFundsTransactions,
  deleteHedgeFundTransaction,
  updateHedgeFundTransaction,
} from "../../references/url";

import { date } from "quasar";
const today = new Date();
const { startOfDate, addToDate, subtractFromDate } = date;

export default {
  components: {
    UQTable,
    UQModal,
    date,
  },
  data: () => ({
    date1: null,
    form_data: {
      date_from: "",
      date_to: "",
      rate: "",
    },
    alert: false,
    moment: moment,
    approve: false,
    cancel: false,
    table: {
      title: "Hedge Fund Approval Table",
      columns: [
        {
          name: "date_created",
          label: "DATE ",
          field: "date_created",
          align: "left",
          sortable: true,
        },
        {
          name: "full_name",
          label: "FULL NAME",
          field: "full_name",
          align: "left",
          sortable: true,
        },
        {
          name: "fund_type",
          label: "FUND TYPE",
          field: "currency",
          align: "left",
          sortable: true,
        },
        {
          name: "currency",
          label: "CCY",
          field: "currency",
          align: "left",
          sortable: true,
        },
        {
          name: "amount",
          label: "AMOUNT",
          field: "amount",
          align: "right",
          sortable: true,
        },
        {
          name: "status",
          label: "STATUS",
          field: "status",
          align: "center",
          sortable: true,
        },
        { name: "action", label: "ACTION", field: "action", align: "center" },
      ],
      data: [],
    },
    modal: {
      kyc_details: {},
      actions: [
        {
          label: "Approve",
          icon: "fas fa-check",
          key: "approve",
          color: "green",
        },
        {
          label: "Canceled",
          icon: "fas fa-ban",
          key: "canceled",
          color: "red",
        },
        {
          label: "Close",
          icon: "fas fa-window-close",
          key: "close",
          color: "accent",
        },
      ],
    },
    confirmation_modal: {
      kyc_action: {},
      actions: [
        { label: "Yes", color: "green" },
        { label: "No", color: "red" },
      ],
    },
  }),

  async mounted() {
    this.$q.loading.show();
    await this.setTransactions();
    await this.getAllTransactions();
    this.$q.loading.hide();
  },
  computed: {},
  methods: {
    async viewDate() {
      this.$q.loading.show();
      this.$refs.date_modal.showModal();
      this.$q.loading.hide();
    },
    async viewKyc(kycData) {
      this.$q.loading.show();
      this.$refs.kyc_modal.showModal();

      this.modal.kyc_details = kycData;
      this.$q.loading.hide();
    },

    async getAllTransactions() {
      let res = await this.$_post(getAllHedgeFundsTransactions);
      this.add_funds_list = res.data;
      return res;
    },
    async setTransactions() {
      let transactions = await this.getAllTransactions();

      if (transactions.status == 200) {
        this.table.data = transactions.data;
      } else if (transactions.data.status == "error") {
      }
    },
    triggerPositiveCanceled(position) {
      // this.$q.notify({
      //   type: "positive",
      //   message: ` Successfully canceled!`,
      //   position,
      // });
      this.$q.notify({
        message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Hedge Fund successfully canceled.</div>',
        position: 'top',
        color: 'white',
        html: true,
      });
    },
    triggerNegativeApproved(position, orderNumber) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `Transaction Number ${orderNumber} can't approve because it is not in 'mark as paid' status!`,
      //   position,
      // });
      this.$q.notify({
        message: `<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Transaction Number ${orderNumber} can't be approve because it is not in 'mark as paid' status.</div>`,
        position: 'top',
        color: 'white',
        html: true,
      });
    },
    triggerPositiveApproved(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Successfully approved!`,
      //   position,
      // });
      this.$q.notify({
        message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Hedge Fund successfully approved.</div>',
        position: 'top',
        color: 'white',
        html: true,
      });
    },
    async cancelHandler(id) {
      this.$q.loading.show();
      let res = await this.$_post(deleteHedgeFundTransaction, {
        id: id,
      });

      if (res) {
        this.setTransactions();
        this.$refs.kyc_modal.hideModal();
        this.triggerPositiveCanceled("top");
      }

      this.$q.loading.hide();
    },

    async approveHandler(id, user_id, amount, decimal) {
      this.$q.loading.show();
      if (
        this.form_data.rate == "" ||
        this.form_data.date == "" ||
        this.form_data.date_from == ""
      ) {
        this.triggerNegative("top");
      } else {
        let res = await this.$_post(updateHedgeFundTransaction, {
          id: id,
          user_id: user_id,
          amount: amount,
          decimal: decimal,
          rate: this.form_data.rate,
          date_to: this.form_data.date_to,
          date_from: this.form_data.date_from,
        });

        if (res) {
          this.setTransactions();
          this.$refs.kyc_modal.hideModal();
          this.triggerPositiveApproved("top");
        }
      }
      this.$q.loading.hide();
    },

    triggerNegative(position) {
      // this.$q.notify({
      //   type: "negative",
      //   message: `You need to fill up all the forms`,
      //   position,
      // });
      this.$q.notify({
        message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to fill up all the forms.</div>',
        position: 'top',
        color: 'white',
        html: true,
      });
    },
  },
};
</script>
<style>
.awaiting-funds {
  background-color: #ffa21f;
}
.admin-table {
  padding: 20px 150px;
}
.btn-approve {
  background-color: #2f4c7e;
  color: white;
}
.btn-canceled {
  color: white;
}
.btn-close {
  border: 1px solid #2f4c7e;
  color: #2f4c7e;
}
.fa-eye {
  color: green;
  font-size: 20px;
}
</style>