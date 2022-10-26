=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div class="admin-table">
    <div class="component q-ma-lg">
      <div class="form-container">
        <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
          <span
            slot="btn"
            class="text-white q-mr-lg"
            no-caps
            @click="createPDF()"
          >
            <q-btn 
              class="text-accent btn-file text-weight-bold q-mr-md"
              @click="viewDateFrom"
            >
              {{ moment(date.from).format('DD-MMM-YYYY') }}
            </q-btn> 
            <strong> - </strong> 
            <q-btn 
              class="text-accent btn-file text-weight-bold q-ml-md"
              @click="viewDateTo"
            >
              {{ moment(date.to).format('DD-MMM-YYYY') }}
            </q-btn>
          </span>
          <template slot="table_rows" slot-scope="props">
            <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
            <q-td key="full_name">{{props.data.full_name}}</q-td>
            <q-td key="orderNumber">{{props.data.orderNumber}}</q-td>
            <q-td key="currency_abbreviation">{{props.data.currency_abbreviation}}</q-td>
            <q-td key="amount" align="right">
              {{(props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
              minimumFractionDigits:props.data.decimal_places})}}
            </q-td>
            <q-td key="status" align="center" v-if="props.data.status == 'pending' ">
              <q-badge class="q-pa-sm awaiting-funds">Awaiting Funds</q-badge>
            </q-td>

            <q-td align="center" key="status" v-if="props.data.status == 'Mark as paid'">
              <q-badge color="positive" class="q-pa-sm">Funds Deposited</q-badge>
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
      <div class="text-h6" slot="modal-header">Deposit Transaction Details</div>
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
              <q-item-label>REFERENCE NUMBER</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.orderNumber}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>DATE AND TIME CREATED</q-item-label>
            </q-item-section>
            <q-item-section>
              <!-- <q-item-label>{{ moment(props.data.date_created).format('DD-MMM-YYYY') }} at {{ new Date(props.data.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</q-item-label> -->
              <q-item-label>{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} at {{ moment(props.data.date_created).tz("Europe/London").format('HH:mm') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>DEPOSIT SLIP</q-item-label>
            </q-item-section>
            <q-item-section>
              <!-- <q-item-label>{{props.data.deposit_slip_path}}</q-item-label> -->
              <q-img
                :src="`https://${server.host}/user/${props.data.user_id}/images/${props.data.deposit_slip_path}`"
                @click="zoomImageIn(`https://${server.host}/user/${props.data.user_id}/images/${props.data.deposit_slip_path}`)"
              ></q-img>
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

      <div slot="modal-footer" slot-scope="props">
        <q-card-actions>
          <q-btn
            class="btn-canceled q-mr-sm"
            label="CANCEL DEPOSIT"
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
                  <div class="text-h6 font-monseratt">
                    Are you sure you want to approve deposit with Transaction Number
                    <span
                      class="text-weight-bolder"
                    >{{props.data.orderNumber}}</span>?
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-center row justify-end font-oswald">
                    <div class="col-3 q-mr-md">
                      <q-btn
                        @click="approveHandler(props.data.user_id, props.data.orderNumber, props.data.currency_abbreviation, props.data.amount, props.data.decimal_places, props.data.status)"
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
                        @click="cancelHandler(props.data.orderNumber)"
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
    <u-q-modal ref="zoomImage" :modal_data="modal_data" :is_persistent="false">
      <div slot="modal-header"></div>
      <div slot="modal-content" slot-scope="props">
        <img :src="props.data.src" style="width: 100%;" />
      </div>
      <div slot="modal-footer"></div>
    </u-q-modal>

    <u-q-modal ref="date_picker_modal_from" :modal_data="{}" :is_persistent="true">
        <div class="text-h6" slot="modal-header">Pick a date</div>
        <div slot="modal-content">
          <q-date v-model="date.from" flat></q-date>
        </div>
        <div slot="modal-footer">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup></q-btn>
            <q-btn label="OK" color="primary" flat v-close-popup @click="getFilteredTransactions"></q-btn>
          </div>
        </div>
      </u-q-modal>

      <u-q-modal ref="date_picker_modal_to" :modal_data="{}" :is_persistent="true">
        <div class="text-h6" slot="modal-header">Pick a date</div>
        <div slot="modal-content">
          <q-date v-model="date.to" flat></q-date>
        </div>
        <div slot="modal-footer">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup></q-btn>
            <q-btn label="OK" color="primary" flat v-close-popup @click="getFilteredTransactions"></q-btn>
          </div>
      </div>
    </u-q-modal>
  </div>
</template>
 

<script>
import moment from "moment-timezone";
import config from "../../../config";
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";

import {
  getAddFundHistory,
  postUpdateStatus,
  updateApproveAddFunds,
} from "../../references/url";

export default {
  components: {
    UQTable,
    UQModal,
  },
  data: () => ({
    date: 
    {
      from: "",
      to: ""
    },
    moment: moment,
    server: {
      host: config.SERVER.HOST,
      port: config.SERVER.PORT,
    },
    modal_data: {},
    approve: false,
    cancel: false,
    table: {
      title: "Deposit Approval Table",
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
          name: "orderNumber",
          label: "REFERENCE NUMBER",
          field: "orderNumber",
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
    await this.getAllTransactions();
    this.$q.loading.hide();
  },
  computed: {},
  methods: {
    async zoomImageIn(image)
    {
      this.modal_data.src = image
      this.$refs.zoomImage.showModal()
    },
    async viewKyc(kycData) {
      this.$q.loading.show();
      this.$refs.kyc_modal.showModal();

      this.modal.kyc_details = kycData;
      this.$q.loading.hide();
    },
    async viewDateFrom()
    {
      this.$q.loading.show();
      this.$refs.date_picker_modal_from.showModal();
      this.$q.loading.hide();
    },
    async viewDateTo()
    {
      this.$q.loading.show();
      this.$refs.date_picker_modal_to.showModal();
      this.$q.loading.hide();
    },
    async getAllTransactions() {
      let res = await this.$_post(getAddFundHistory);
      this.add_funds_list = res.data;
      this.date.from = this.moment(this.add_funds_list[this.add_funds_list.length - 1].date_created).format("YYYY/MM/DD");
      this.date.to = this.moment(this.add_funds_list[0].date_created).format("YYYY/MM/DD");
      if (res.status == 200) {
        this.table.data = res.data;
      } else if (res.data.status == "error") {
        console.error(res.data.message);
      }
      return res;
    },
    async getFilteredTransactions() {
      let res = await this.$_post(getAddFundHistory, this.date);
      this.add_funds_list = res.data;
      if (res.status == 200) {
        this.table.data = res.data;
      } else if (res.data.status == "error") {
        console.error(res.data.message);
      }
      return res;
    },
    triggerPositiveCanceled(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Transaction Number ${orderNumber} Successfully canceled!`,
      //   position,
      // });
      this.$q.notify({
            message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Transaction Number ${orderNumber} Successfully canceled.</div>`,
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
            message: `<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Transaction Number ${orderNumber} can't approve because it is not in 'mark as paid' status.</div>`,
            position: 'top',
            color: 'white',
            html: true,
        });
    },
    triggerPositiveApproved(position, orderNumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Transaction Number ${orderNumber} Successfully approved!`,
      //   position,
      // });
       this.$q.notify({
            message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Transaction Number ${orderNumber} Successfully approved.</div>`,
            position: 'top',
            color: 'white',
            html: true,
        });
    },
    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      let res = await this.$_post(postUpdateStatus, {
        order_number: orderNumber,
      });

      if (res) {
        this.setTransactions();
        this.$refs.kyc_modal.hideModal();
        this.triggerPositiveCanceled("top", orderNumber);
      }

      this.$q.loading.hide();
    },
    async approveHandler(
      user_id,
      orderNumber,
      currency_abbreviation,
      amount,
      decimal_places,
      status
    ) {
      this.$q.loading.show();
      let res = await this.$_post(updateApproveAddFunds, {
        user_id: user_id,
        orderNumber: orderNumber,
        currency_abbreviation: currency_abbreviation,
        amount: amount,
        decimal_places: decimal_places,
        status: status,
      });
      if (res) {
        this.setTransactions();
        this.$refs.kyc_modal.hideModal();
        this.triggerPositiveApproved("top", orderNumber);
      }
      this.$q.loading.hide();
    },
    async all()
    {
      alert(this.date.to);
    }
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
.btn-file {
  background-color: #b5cef5;
}
</style>