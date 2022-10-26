<template>
 <div>
    <u-q-table
        :tbl_title="table.title"
        :tbl_columns="table.columns"
        :tbl_data="table.data"
      >
        <template slot="table_rows" slot-scope="props" v-if=" props.data.status == 'Pending' ">
          <q-td key="#">{{table.data.indexOf(props.data)+1}}</q-td>
          <!-- <q-td key="date_time">
              {{ new Date(props.data.date_created).toLocaleDateString() }} <br/>
              {{ new Date(props.data.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}
          </q-td> -->
          <q-td key="date_time">
              {{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }} <br/>
              {{ moment(props.data.date_created).tz("Europe/London").format('HH:mm') }}
          </q-td>
          <q-td key="nominated_bank">{{props.data.bank}}</q-td>
          <q-td key="account_name">{{props.data.account_name}}</q-td>
          <q-td key="account_number">{{props.data.account_number}}</q-td>
          <q-td key="currency">{{props.data.currency_abbreviation}}</q-td>
          <q-td key="amount">
            {{ (props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
                  minimumFractionDigits: props.data.decimal_places
                })
            }}
          </q-td>
          <q-td key="reference_number">{{props.data.reference_number}}</q-td>
          <q-td key="status">{{props.data.status}}</q-td>
          <q-td key="action">
              <div v-if="props.data.status == 'Pending'">
                <q-btn 
                  @click="showApproveDialog(
                    props.data.email, 
                    props.data.reference_number
                    )" 
                  color="teal" 
                  class="q-mr-lg"
                >
                  Approve
                </q-btn>
                
                <q-btn 
                  @click="showCancelDialog(
                    props.data.email, 
                    props.data.reference_number
                  )"
                  color="negative"
                >
                  Cancel
                </q-btn>
              </div>
          </q-td>
        </template>
      </u-q-table>

      <q-dialog v-model="is_show_approve">
      <q-card style="width: 350px; text-align: center;">
        <q-card-section>
          <h6>Are you sure?</h6>
          <q-btn outline color="accent" class="q-mr-lg" v-close-popup>No</q-btn>
          <q-btn @click="approveTxn()" color="accent">Yes</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="is_show_cancel">
      <q-card style="width: 350px; text-align: center;">
        <q-card-section>
          <h6>Are you sure?</h6>
          <q-btn outline color="accent" class="q-mr-lg" v-close-popup>No</q-btn>
          <q-btn @click="cancelTxn()" color="accent">Yes</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import UQTable from "../../components/UQTable";
import {
  getAllExternalTxn,
  approveExtenalTxnStatus,
  cancelExtenalTxnStatus
} from "../../references/url";
import moment from 'moment-timezone';

export default {
  data() {
    return {
      is_show_approve: false,
      is_show_cancel: false,
      email: '',
      reference_number: '',
    // ---------

      table: {
      title: "Wire Transfer Transaction Approval",
      columns: [
        { name: "#", label: "#", field: "#", align: "left", sortable: true },
        {
          name: "date_created",
          label: "DATE AND TIME",
          field: "date_created",
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
          label: "CURRENCY",
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
          name: "status",
          label: "STATUS",
          field: "status",
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

  components: 
  {
    UQTable,
  },

  mounted() {
    this.getAllTxn();
  },
  methods: {
    async getAllTxn()
    {
      let res = await this.$_post(getAllExternalTxn);
        this.table.data = res.data.data;
    },

    async approveTxn()
    {
      this.$q.loading.show();
      let res = await this.$_post(approveExtenalTxnStatus, { 
        email: this.email, 
        reference_number: this.reference_number
      });
      await this.getAllTxn();
      this.$q.loading.hide();

      this.is_show_approve = false;
    },

    async cancelTxn(email, reference_number)
    {
      this.$q.loading.show();
      let res = await this.$_post(cancelExtenalTxnStatus, { 
        email: this.email, 
        reference_number: this.reference_number
      });
      await this.getAllTxn();
      this.$q.loading.hide();

      this.is_show_cancel = false;
    },

    async showApproveDialog(email, reference_number) 
    {
        this.is_show_approve = true;
        this.email = email;
        this.reference_number = reference_number;
    },

    async showCancelDialog(email, reference_number) 
    {   
        this.is_show_cancel = true;
        this.email = email;
        this.reference_number = reference_number;
    },

  }
};
</script>
<style>
.hide{
  display: none;
}
</style>