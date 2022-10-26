========================================= Title: Design Author: Pergentino S.
Galang II Date: 12 Aug 2020 Contributor:
=========================================

<template>
  <div class="component q-ma-sm">
    <u-q-table
      :tbl_title="table.title"
      :tbl_columns="table.columns"
      :tbl_data="table.data"
    >
      <template
        slot="table_rows"
        slot-scope="props"
        v-if="
          props.data.transaction_type === 'send external' &&
            props.data.bank &&
            props.data.email
        "
      >
        <!-- <q-td key="#">{{table.data.indexOf(props.data)+1}}</q-td> -->
        <q-td key="date_time">{{
          moment(props.data.date_created).tz("Europe/London").format("DD-MMM-YYYY")
        }}</q-td>
        <span v-if="props.data.bank.length > 10" id="bank-cursor">
          <q-td key="nominated_bank">{{
            props.data.bank.substring(0, 10) + "...."
          }}</q-td>
          <q-tooltip content-style="font-size:13px;">{{
            props.data.bank
          }}</q-tooltip>
        </span>
        <div v-else>
          <q-td key="nominated_bank">{{ props.data.bank }}</q-td>
        </div>
        <q-td key="account_name">{{ props.data.account_name }}</q-td>
        <q-td key="account_number">{{ props.data.account_number }}</q-td>
        <q-td key="reference_number">{{ props.data.reference_number }}</q-td>
        <q-td key="currency">{{ props.data.currency_abbreviation }}</q-td>
        <q-td key="amount" align="right">
          {{
            (
              props.data.amount /
              10 ** props.data.decimal_places
            ).toLocaleString("en-US", {
              minimumFractionDigits: props.data.decimal_places
            })
          }}
        </q-td>
        <q-td key="by">
          {{ props.data.approved_by || props.data.cancelled_by }}
        </q-td>
        <q-td key="status" align="center" v-if="props.data.status == 'Pending'">
          <q-badge class="q-pa-sm pending-badge">Awaiting Funds</q-badge>
        </q-td>
        <q-td
          key="status"
          align="center"
          v-if="props.data.status == 'Cancelled'"
        >
          <q-badge class="q-pa-sm cancelled-badge">{{
            props.data.status
          }}</q-badge>
        </q-td>
        <q-td
          key="status"
          align="center"
          v-if="props.data.status == 'Approved'"
        >
          <q-badge class="q-pa-sm approved-badge">{{
            props.data.status
          }}</q-badge>
        </q-td>
      </template>
    </u-q-table>
  </div>
</template>
<script>
import UQTable from "../../../components/UQTable";
import moment from "moment-timezone";
import { getAllExternalTxn } from "../../../references/url";

export default {
  data() {
    return {
      moment: moment,
      is_show_approve: false,
      is_show_cancel: false,
      email: "",
      reference_number: "",
      // ---------

      table: {
        title: "Wire Transfer Transactions",
        columns: [
          // { name: "#", label: "#", field: "#", align: "left", sortable: true },
          {
            name: "date_created",
            label: "DATE ",
            field: "date_created",
            align: "left",
            sortable: true
          },
          {
            name: "bank",
            label: "NOMINATED BANK",
            field: "bank",
            align: "left",
            sortable: true
          },
          {
            name: "account_name",
            label: "ACCOUNT NAME",
            field: "account_name",
            align: "left",
            sortable: true
          },
          {
            name: "account_number",
            label: "ACCOUNT NUMBER",
            field: "account_number",
            align: "left",
            sortable: true
          },
          {
            name: "reference_number",
            label: "REFERENCE NUMBER",
            field: "reference_number",
            align: "left",
            sortable: true
          },
          {
            name: "currency_abbreviation",
            label: "CCY",
            field: "currency_abbreviation",
            align: "left",
            sortable: true
          },
          {
            name: "amount",
            label: "AMOUNT",
            field: "amount",
            align: "right",
            sortable: true
          },

          {
            name: "by",
            label: "By",
            field: "by",
            align: "left",
            sortable: true,
          },
          {
            name: "status",
            label: "STATUS",
            field: "status",
            align: "center",
            sortable: true
          }
        ],
        data: []
      }
    };
  },

  components: {
    UQTable
  },

  async mounted() {
    this.$q.loading.show();
    await this.getAllTxn();
    this.$q.loading.hide();
  },
  methods: {
    async getAllTxn() {
      let res = await this.$_post(getAllExternalTxn);
      this.table.data = res.data.data;
    }
  }
};
</script>
<style>
.hide {
  display: none;
}
.pending-badge {
  background-color: #e68405;
}
.cancelled-badge {
  background-color: #c10015;
}
.approved-badge {
  background-color: green;
}
#bank-cursor {
  cursor: pointer;
}
</style>
