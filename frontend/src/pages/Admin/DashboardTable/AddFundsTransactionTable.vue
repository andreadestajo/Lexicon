=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================


<template>
  <div>
    <div class="component q-ma-sm">
      <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
        <template slot="table_rows" slot-scope="props">
          <q-td
            key="date_created"
            align="left"
          >{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
          <q-td key="full_name" align="center">{{props.data.full_name}}</q-td>
          <q-td key="orderNumber" align="center">{{props.data.orderNumber}}</q-td>

          <q-td key="ccy" align="center">{{props.data.currency_abbreviation}}</q-td>

          <q-td key="amount" class="text-right">
            {{(props.data.amount / 10 ** props.data.decimal_places).toLocaleString("en-US", {
            minimumFractionDigits:props.data.decimal_places})}}
          </q-td>

          <q-td key="status" align="center" v-if=" props.data.status == 'Canceled'">
            <q-badge color="negative" class="q-pa-sm">{{props.data.status}}</q-badge>
          </q-td>

          <q-td key="status" align="center" v-if="props.data.status == 'pending'">
            <q-badge class="q-pa-sm badge-color-pending">Awaiting Funds</q-badge>
          </q-td>

          <q-td key="status" align="center" v-if="props.data.status == 'Mark as paid'">
            <q-badge class="q-pa-sm" color="positive">Funds Deposited</q-badge>
          </q-td>

          <q-td key="status" align="center" v-if="props.data.status == 'Approved'">
            <q-badge color="positive" class="q-pa-sm">{{props.data.status}}</q-badge>
          </q-td>
        </template>
      </u-q-table>
    </div>
  </div>
</template>


<script>
import moment from "moment-timezone";
import UQTable from "../../../components/UQTable";
import { getAllAddFundsTransactions } from "../../../references/url";
export default {
  components: {
    UQTable,
  },
  data: () => ({
    moment: moment,
    reference_number: "",
    table: {
      title: "Deposit Transactions",
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
          align: "center",
          sortable: true,
        },
        {
          name: "orderNumber",
          label: "REFERENCE NUMBER",
          field: "orderNumber",
          align: "center",
          sortable: true,
        },

        {
          name: "ccy",
          label: "CCY",
          field: "ccy",
          align: "center",
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
      ],
      data: [],
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
    async getAllTransactions() {
      let res = await this.$_post(getAllAddFundsTransactions);
      this.add_funds_list = res.data;
      return res;
    },
    async setTransactions() {
      let transactions = await this.getAllTransactions();

      if (transactions.status == 200) {
        this.table.data = transactions.data;
      } else if (transactions.data.status == "error") {
        console.error(transactions.data.message);
      }
    },
  },
};
</script>
<style>
.badge-color-pending {
  background-color: #e68405;
}
</style>