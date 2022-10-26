<template>
  <div class="admin-table-wiretransfer">
    <div class="component q-ma-lg">
      <div class="form-container">
        
        <!-- Verifier -->
          <div v-if="$user_info.user_role == 'Verifier' || $user_info.user_role == 'Administrator'" class="q-mb-lg q-pb-lg">
            <u-q-table :tbl_title="table.title1" :tbl_columns="table.column1" :tbl_data="table.data">
              <template
                v-if="props.data.status_admin == 'Pending' && props.data.status == 'Pending'"
                slot="table_rows"
                slot-scope="props"
              >
                <!-- <q-td key="#">{{table.data.indexOf(props.data)+1}}</q-td> -->
                <q-td key="date_time">
                  {{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}
                </q-td>
                <q-td key="sender">{{ props.data.full_name }}</q-td>

                <span v-if="props.data.bank.length > 10" style="cursor:pointer">
                  <q-td key="nominated_bank">{{props.data.bank.substring(0, 10) + "...."}}</q-td>
                  <q-tooltip content-style="font-size:13px;">{{props.data.bank}}</q-tooltip>
                </span>
                <div v-else>
                  <q-td key="nominated_bank">{{props.data.bank}}</q-td>
                </div>

                <q-td key="account_name">{{props.data.account_name}}</q-td>
                <q-td key="account_number">{{props.data.account_number}}</q-td>
                <q-td key="currency">{{props.data.currency_abbreviation}}</q-td>
                <q-td key="amount">
                  {{(props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
                  minimumFractionDigits:props.data.decimal_places})}}
                </q-td>
                <q-td key="reference_number">{{props.data.reference_number}}</q-td>
                <q-td key="status_admin">{{props.data.status_admin}}</q-td>
                <q-td key="action">
                  <!-- Verifier -->
                   <div>
                    <q-btn
                      class="q-mr-xs"
                      flat
                      @click="showVerifyDialog(props.data.reference_number)"
                    >
                      Verify
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </u-q-table>
          </div>

          <!-- Approver -->
          <div v-if="$user_info.user_role == 'Approver' || $user_info.user_role == 'Administrator'">
            <u-q-table :tbl_title="table.title2" :tbl_columns="table.column2" :tbl_data="table.data">
              <template
                v-if="props.data.status == 'Pending'"
                slot="table_rows"
                slot-scope="props"
              >
                <!-- <q-td key="#">{{table.data.indexOf(props.data)+1}}</q-td> -->
                <q-td key="date_time">
                  {{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}
                </q-td>
                <q-td key="sender">{{ props.data.full_name }}</q-td>

                <span v-if="props.data.bank.length > 10" style="cursor:pointer">
                  <q-td key="nominated_bank">{{props.data.bank.substring(0, 10) + "...."}}</q-td>
                  <q-tooltip content-style="font-size:13px;">{{props.data.bank}}</q-tooltip>
                </span>
                <div v-else>
                  <q-td key="nominated_bank">{{props.data.bank}}</q-td>
                </div>

                <q-td key="account_name">{{props.data.account_name}}</q-td>
                <q-td key="account_number">{{props.data.account_number}}</q-td>
                <q-td key="currency">{{props.data.currency_abbreviation}}</q-td>
                <q-td key="amount">
                  {{(props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
                  minimumFractionDigits:props.data.decimal_places})}}
                </q-td>
                <q-td key="reference_number">{{props.data.reference_number}}</q-td>
                <q-td key="status_admin">{{props.data.status_admin}}</q-td>
                <q-td key="verified_by">{{props.data.verified_by}}</q-td>
                <!-- <q-td key="approved_by">{{props.data.approved_by}}</q-td>
                <q-td key="cancelled_by">{{props.data.cancelled_by}}</q-td> -->
                <q-td key="action">
                  <!-- Approver -->
                  <div>
                    <q-btn
                      class="q-mr-xs text-white"
                      flat
                      @click="showApproveDialog(
                        props.data.email, 
                        props.data.reference_number
                        )"
                    >
                      <i class="fas fa-check-circle" style="color:green; font-size: 20px;"></i>
                    </q-btn>

                    <q-btn
                      class="text-white"
                      flat
                      @click="showCancelDialog(
                        props.data.email, 
                        props.data.reference_number
                      )"
                    >
                      <i class="fas fa-times-circle" style="color:#C10015;; font-size: 20px;"></i>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </u-q-table>
          </div>
      </div>
    </div>

    <q-dialog v-model="is_show_verify" persistent>
      <q-card>
        <q-card-section class="text-center q-pb-none">
          <div class="text-h6">Are you sure you want to verify wire transfer transaction?</div>
        </q-card-section>
        <q-card-section>
          <div class="text-center row justify-end">
            <div class="col-3 q-mr-md">
              <q-btn @click="verifyTxn()" cunelevated class="full-width q-mt-md" color="accent">Yes</q-btn>
            </div>
            <div class="col-3">
              <q-btn outline unelevated color="accent" class="full-width q-mt-md" v-close-popup>No</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="is_show_approve" persistent>
      <q-card>
        <q-card-section class="text-center q-pb-none">
          <div class="text-h6">Are you sure you want to approve wire transfer transaction?</div>
        </q-card-section>
        <q-card-section>
          <div class="text-center row justify-end">
            <div class="col-3 q-mr-md">
              <q-btn @click="approveTxn()" cunelevated class="full-width q-mt-md" color="accent">Yes</q-btn>
            </div>
            <div class="col-3">
              <q-btn outline unelevated color="accent" class="full-width q-mt-md" v-close-popup>No</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="is_show_cancel" persistent>
      <q-card>
        <q-card-section class="text-center q-pb-none">
          <div class="text-h6">Are you sure you want to cancel wire transfer transaction?</div>
        </q-card-section>

        <q-card-section>
          <div class="text-center row justify-end">
            <div class="col-3 q-mr-md">
              <q-btn @click="cancelTxn()" unelevated class="full-width q-mt-md" color="accent">Yes</q-btn>
            </div>
            <div class="col-3">
              <q-btn outline unelevated color="accent" class="full-width q-mt-md" v-close-popup>No</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import UQTable from "../../../components/UQTable";
import moment from "moment-timezone";
import {
  getAllExternalTxn,
  approveExtenalTxnStatus,
  cancelExtenalTxnStatus,
  verifyExtenalTxnStatus
} from "../../../references/url";

export default {
  data() {
    return {
      moment: moment,
      is_show_approve: false,
      is_show_cancel: false,
      is_show_verify: false,
      email: "",
      reference_number: "",
      // ---------

      table: {
        title1: "Wire Transfer Verify Table",
        title2: "Wire Transfer Approval Table",
        column1: [
          // { name: "#", label: "#", field: "#", align: "left", sortable: true },
          {
            name: "date_created",
            label: "DATE",
            field: "date_created",
            align: "left",
            sortable: true,
          },
          {
            name: "sender",
            label: "SENDER",
            field: "sender",
            align: "left",
            sortable: true,
          },
          {
            name: "bank",
            label: "NOMINATED BANK",
            field: "bank",
            align: "left",
            sortable: true,
          },
          {
            name: "account_name",
            label: "ACCOUNT NAME",
            field: "account_name",
            align: "left",
            sortable: true,
          },
          {
            name: "account_number",
            label: "ACCOUNT NUMBER",
            field: "account_number",
            align: "left",
            sortable: true,
          },
          {
            name: "currency_abbreviation",
            label: "CCY",
            field: "currency_abbreviation",
            align: "left",
            sortable: true,
          },
          {
            name: "amount",
            label: "AMOUNT",
            field: "amount",
            align: "left",
            sortable: true,
          },
          {
            name: "reference_number",
            label: "REFERENCE NUMBER",
            field: "reference_number",
            align: "left",
            sortable: true,
          },
          {
            name: "status_admin",
            label: "Admin Status",
            field: "status_admin",
            align: "left",
            sortable: true,
          },
          {
            name: "action",
            label: "ACTION",
            field: "action",
            align: "left",
            sortable: true,
          },
        ],
        column2: [
          // { name: "#", label: "#", field: "#", align: "left", sortable: true },
          {
            name: "date_created",
            label: "DATE",
            field: "date_created",
            align: "left",
            sortable: true,
          },
          {
            name: "sender",
            label: "SENDER",
            field: "sender",
            align: "left",
            sortable: true,
          },
          {
            name: "bank",
            label: "NOMINATED BANK",
            field: "bank",
            align: "left",
            sortable: true,
          },
          {
            name: "account_name",
            label: "ACCOUNT NAME",
            field: "account_name",
            align: "left",
            sortable: true,
          },
          {
            name: "account_number",
            label: "ACCOUNT NUMBER",
            field: "account_number",
            align: "left",
            sortable: true,
          },
          {
            name: "currency_abbreviation",
            label: "CCY",
            field: "currency_abbreviation",
            align: "left",
            sortable: true,
          },
          {
            name: "amount",
            label: "AMOUNT",
            field: "amount",
            align: "left",
            sortable: true,
          },
          {
            name: "reference_number",
            label: "REFERENCE NUMBER",
            field: "reference_number",
            align: "left",
            sortable: true,
          },
          {
            name: "status_admin",
            label: "Admin Status",
            field: "status_admin",
            align: "left",
            sortable: true,
          },
          {
            name: "verified_by",
            label: "Verified By",
            field: "verified_by",
            align: "left",
            sortable: true,
          },
          {
            name: "action",
            label: "ACTION",
            field: "action",
            align: "left",
            sortable: true,
          },
        ],
        data: [],
      },
    };
  },

  components: {
    UQTable,
  },

  async mounted() {
    await this.getAllTxn();
  },
  methods: {
    async getAllTxn() {
      let res = await this.$_post(getAllExternalTxn);
      this.table.data = res.data.data;
      // console.log(this.table.data);
    },

    async verifyTxn() {
      this.$q.loading.show();
      let res = await this.$_post(verifyExtenalTxnStatus, {
        reference_number: this.reference_number,
      });
      await this.getAllTxn();
      this.$q.loading.hide();

      this.is_show_verify = false;
    },

    async approveTxn() {
      this.$q.loading.show();
      let res = await this.$_post(approveExtenalTxnStatus, {
        email: this.email,
        reference_number: this.reference_number,
      });
      await this.getAllTxn();
      this.$q.loading.hide();

      this.is_show_approve = false;
    },

    async cancelTxn(email, reference_number) {
      this.$q.loading.show();
      let res = await this.$_post(cancelExtenalTxnStatus, {
        email: this.email,
        reference_number: this.reference_number,
      });

      await this.getAllTxn();
      this.$q.loading.hide();

      this.is_show_cancel = false;
    },

    async showVerifyDialog(reference_number) {
      this.is_show_verify = true;
      this.reference_number = reference_number;
    },

    async showApproveDialog(email, reference_number) {
      this.is_show_approve = true;
      this.email = email;
      this.reference_number = reference_number;
    },

    async showCancelDialog(email, reference_number) {
      this.is_show_cancel = true;
      this.email = email;
      this.reference_number = reference_number;
    },
  },
};
</script>
<style>
.hide {
  display: none;
}
.admin-table-wiretransfer {
  padding: 20px 30px;
}
</style>