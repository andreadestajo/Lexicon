<template>
  <div>
    <!-- **Author: VP -->
    <!-- content -->
    <div>
      <u-q-table
      :tbl_title="table.title"
      :tbl_columns="table.columns"
      :tbl_data="table.data"
      >
      <template slot="table_rows" slot-scope="props">
        <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
        <q-td key="reference_number">{{props.data.orderNumber}}</q-td>
        <q-td key="currency">{{props.data.currency_abbreviation}}</q-td>
        <q-td key="amount" align="right">{{(props.data.amount/100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</q-td>
        <q-td key="action" align="right">
          <q-btn class="bg-default color-default" @click="confirm_marks(props.data.user_id, props.data._id, props.data.orderNumber)">Funds Deposited</q-btn>
          <q-btn class="q-ml-sm" @click="cancel(props.data.orderNumber)">Cancel</q-btn>
        </q-td>
    </template>
        </u-q-table>
          <q-dialog v-model="cancel_mark" persistent>
              <q-card class="q-pa-lg">
                <q-card-section class="text-center q-pb-none">
                  <q-avatar icon="question_answer" color="accent" text-color="white" />
                  <div class="q-mt-md">are you sure you want to cancel your add funds?</div>
                </q-card-section>
                <q-card-section>
                  <div class="text-center row justify-around">
                    <div class="col-5">
                      <q-btn
                        @click="cancelHandler(orderNumber)"
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
              <!-- / cancel   -->
             <q-dialog v-model="confirm_mark" persistent>
                <q-card class="q-pa-lg">
                  <q-card-section class="text-center q-pb-none">
                    <q-avatar icon="cloud_upload" color="accent" text-color="white" />
                    <div class="q-mt-md">
                  Upload your Deposit Slip here. Make sure that the Order Number written on your
document is visible
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
                      <div class="text-center row" v-if="form_data.deposit_slip_path != ''">
                        <div class="col-12">
                          <img  :src="form_data.deposit_slip_path_object" style="width: 100%;" @click="zoomImageIn"/>
                        </div>
                      </div>
                      <div class="text-center row">
                        <div class="col-sm-6 col-12 q-pr-xs">
                          <q-btn
                            color="accent"
                            unelevated
                            class="full-width q-mt-md"
                            @click="uploadDeposit(id, orderNumber)"
                          >Submit Document</q-btn>
                        </div>
                        <div class="col-12 col-sm-6 q-pl-xs">
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
              <u-q-modal :modal_data="{}" :is_persistent="false" ref="zoomImage">
                <div slot="modal-header"></div>
                <div slot="modal-content">
                  <img :src="form_data.deposit_slip_path_object" style="width: 100%;" />
                </div>
                <div slot="modal-footer"></div>
              </u-q-modal>
</div>
  </div>
</template>
<script>
import {  
  postManageDeposit,
  postGetAddFundHistory,
  postMemberUpdateStatus,
  postUploadDepositSlip, } from "../references/url";
import moment from 'moment-timezone';
import UQTable from "./UQTable";
import UQModal from "./UQModal";

export default {
  data: () => ({
    table: {
      title: "",
      columns: [
      { name: "date_created", label: "DATE CREATED", field: "date_created", align: "left", sortable: true, },
      { name: "reference_number", label: "REFERENCE NUMBER", field: "reference_number", align: "left", sortable: true, },
      { name: "currency", label: "CURRENCY", field: "status", align: "left", sortable: true, },
      { name: "amount", label: "AMOUNT", field: "amount", align: "right", sortable: true, },
      { name: "action", label: "ACTION", field: "action", align: "center"},
      ],
      data: [],
    },
    form_data: {
      deposit_slip_path: "",
      deposit_slip_path_object: undefined
    },
    val: false,
    confirm: false,
    confirm_mark: false,
    res: false,
    moment: moment,
    id: '',
    tx_id: '',
    orderNumber: '',
    cancel_mark: false,
  }),

  components: {
    UQTable,
    UQModal
  },

  mounted() {
    this.viewTransactions();
  },
  methods: {
    async cancel(orderNumber)
    {
      this.cancel_mark = true;
      this.orderNumber = orderNumber;
    },
    async confirm_marks(id, tx_id, orderNumber)
    {
      this.confirm_mark = true;
      this.id = id;
      this.tx_id = tx_id;
      this.orderNumber = orderNumber;
    },
    async viewTransactions()
    {
      this.$q.loading.show();
      let res = await this.$_post(postManageDeposit);
      this.table.data = res.data;
      this.$q.loading.hide();
    },
    async submitHandler() 
    {
      this.$q.loading.show();
      this.confirm = false;
      this.res = true;
      this.$q.loading.hide();
    },
    async zoomImageIn(event)
    {
      console.log(event.target.src)
      this.$refs.zoomImage.showModal()
    },
    uploadFile1(event) {
      this.form_data.deposit_slip_path        = event.target.files[0];
      this.form_data.deposit_slip_path_object = URL.createObjectURL(event.target.files[0])
    },
    async uploadDeposit(id, orderNumber, tx_id) {
      this.$q.loading.show();
      if (this.form_data.deposit_slip_path == "") {
        this.triggerNegativeUpload("top", orderNumber);
      } else {
        this.form_data.id = this.id;
        this.form_data.tx_id = this.tx_id;
        const fd = new FormData();
        fd.append("user_id", this.form_data.id);
        fd.append("id", this.form_data.tx_id);
        fd.append("deposit_slip_path", this.form_data.deposit_slip_path);
        console.log(this.form_data)
        let res = await this.$_post(postUploadDepositSlip, fd);
        if (res) {
          this.triggerPositiveUpload("top", orderNumber);
          this.confirm_mark = false;
          this.viewTransactions();
        }
      }
      
      this.$q.loading.hide();
    },
    triggerPositiveUpload(position, ordernumber) {
      // this.$q.notify({
      //   type: "positive",
      //   message: `Your Order Number ${ordernumber} Successfully uploaded!`,
      //   position,
      // });
      this.$q.notify({
          message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Your Deposit Slip is successfully submitted.</div>`,
          position: 'top',
          color: 'white',
          html: true,
      });
    },
    async cancelHandler(orderNumber) {
      this.$q.loading.show();
      let res = await this.$_post(postMemberUpdateStatus, {
        order_number: orderNumber,
      });
      if (res) {
        console.log("SUCCESS FULLY CANCELED");
        this.cancel_mark = false;
        this.triggerPositiveCanceled("top", orderNumber);
      }
      this.$q.loading.hide();
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
          message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to choose a file.</div>',
          position: 'top',
          color: 'white',
          html: true,
      });
    },
  },
};
</script>

