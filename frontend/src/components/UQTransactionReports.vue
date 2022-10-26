<template>
  <div class="documentation">
    <div>
      <q-form @submit="showTblData" v-if="!is_show_table">
          <div class="text-center text-h6 q-mb-md bg-header color-default" id="header-h6" style="border-radius: 20px 20px 0 0">
        <p class="deposit-css q-py-lg">
          <b>Transaction Reports</b>
        </p>
      </div>
      <div class="q-pa-lg">
                <q-btn-toggle
        @input="is_hedge"
        v-model="transact"
        spread
        class="q-mb-md font-monseratt btn-toggle"
        no-caps
        unelevated
        toggle-color="accent"
        color="white"
        text-color="accent"
        :options="options"
        />
        <q-select
        :rules="[val => !!val || '* Field is required']"
        v-if="transact"
        v-model="table.selected_transaction_type"
        :options="table.transaction_type"
        :option-label="opt => opt.label"
        :option-value="opt => opt.val"
        label="Transaction Type"
        outlined
        ></q-select>
        
        <q-select
        :rules="[val => !!val || '* Field is required']"
        v-model="table.selected_currency"
        :options="transact ? currency_list : ['USD', 'EUR', 'GBP', 'All']"
        label="Currency"
        outlined
        ></q-select>


          <q-select
            :rules="[val => !!val || '* Field is required']"
            v-model="table.selected_date_range"
            :options="table.date_range"
            v-if="transact"
            :option-label="opt => opt.label"
            :option-value="opt => opt.val"
            label="Date"
            outlined
          ></q-select>

          <div class="field q-mt-md q-mr-md" v-if="table.selected_date_range.label == 'Custom'">
            <q-input
              :rules="[val => !!val || '* Field is required']"
              v-model="table.date_from"
              label="from"
              outlined
              readonly
              @click="showDateModal({name: 'from'})"
            />
            <q-input
              :rules="[val => !!val || '* Field is required']"
              v-model="table.date_to"
              label="to"
              outlined
              readonly
              @click="showDateModal({name: 'to'})"
            />
          </div>
          <div class="col-2 q-mr-md">
            <q-btn
              type="submit"
              unelevated
              class="q-mt-md add-btn"
              color="accent"
              :loading="loading2"
            >Search</q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div class="q-pa-lg">
      <u-q-modal ref="date_picker_modal_from" :modal_data="{}" :is_persistent="true">
        <div class="text-h6" slot="modal-header">Pick a date</div>
        <div slot="modal-content">
          <q-date v-model="table.date_from" flat></q-date>
        </div>
        <div slot="modal-footer">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup></q-btn>
            <q-btn label="OK" color="primary" flat v-close-popup></q-btn>
          </div>
        </div>
      </u-q-modal>
      <u-q-modal ref="date_picker_modal_to" :modal_data="{}" :is_persistent="true">
        <div class="text-h6" slot="modal-header">Pick a date</div>
        <div slot="modal-content">
          <q-date v-model="table.date_to" flat></q-date>
        </div>
        <div slot="modal-footer">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup></q-btn>
            <q-btn label="OK" color="primary" flat v-close-popup></q-btn>
          </div>
      </div>
    </u-q-modal>
    <div v-if="is_show_table">
    <q-btn class="text-weight-bold add-btn q-mb-md back-btn" no-caps @click="is_show_table = false"><i class="fas fa-arrow-circle-left q-mr-sm"></i>BACK</q-btn>
    <u-q-table v-if="transact" :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
      <q-btn slot="btn" class="q-mr-lg text-accent btn-add-currency text-weight-bold" icon-right="archive" label="CSV" no-caps @click="exportTable" />
      <q-btn slot="btn" class="q-mr-lg text-accent btn-add-currency text-weight-bold" icon-right="archive" label="PDF" no-caps @click="download" />
      <template slot="table_rows" slot-scope="props">
        <q-td key="date_created" align="left">{{moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY')}}</q-td>
        <q-td key="description">{{props.data.description.replace('You have', '')}}</q-td>

        <q-td key="debit_amount" align="right">
          {{ props.data.transaction_method === 'minus' ? (props.data.amount / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2}) : '' }}
        </q-td>
        <q-td key="credit_amount" align="right">
          {{ props.data.transaction_method === 'plus' ? (props.data.amount / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2}) : '' }}
        </q-td>
        <q-td key="balance_after" align="right">{{typeof props.data.balance_after == 'number' ? (props.data.balance_after / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2}) : props.data.balance_after}}</q-td>
      </template>
    </u-q-table>
    
    <!-- FOR HEDGE FUND -->
    <u-q-table v-else-if="!transact" :tbl_title="table.title" :tbl_columns="table.column_hedge" :tbl_data="table.data">
      <q-btn slot="btn" class="q-mr-lg text-accent btn-add-currency text-weight-bold" icon-right="archive" label="Export to CSV" no-caps @click="exportTable" />
      <q-btn slot="btn" class="q-mr-lg text-accent btn-add-currency text-weight-bold" icon-right="archive" label="Export to PDF" no-caps @click="download" />
      <template slot="table_rows" slot-scope="props">
        <q-td key="period" align="left">{{moment(props.data.date_from).tz("Europe/London").format('DD-MMM-YYYY')}} to {{moment(props.data.date_to).tz("Europe/London").format('DD-MMM-YYYY')}}</q-td>
        <q-td key="fund_type">{{props.data.fund_type}}</q-td>

            <q-td
              key="value"
              align="right"
            >{{ (props.data.amount / 10 ** 2).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 }) }}</q-td>
            <q-td key="percent" align="right">{{ props.data.rate }}%</q-td>
            <q-td key="projected_amount" align="right">
              {{ (props.data.amount * (1 + (props.data.rate / 100)) / 10 ** 2).toLocaleString("en-US", {
              minimumFractionDigits:2, maximumFractionDigits:2}) }}
            </q-td>
          </template>
        </u-q-table>
      </div>
    </div>
  </div>
</template>


<script>
import moment from "moment-timezone";
import jspdf from 'jspdf';
import 'jspdf-autotable';
import UQTable from "./UQTable";
import UQModal from "./UQModal";
import { exportFile } from "quasar";
import {
  postServerDate,
  getClientTransactionReport,
  postWalletDetailsOptions,
} from "../references/url";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default {
  name: "Reports",
  components: {
    UQTable,
    UQModal,
  },
  data: () => ({
    loading2: false,
    wallet_details: {},
    currency_list: [],
    moment: moment,
    transact: true,
    is_show_table: false,
    options: [
      {
        label: "Normal Transactions",
        value: true,
      },
      {
        label: "Hedge Fund",
        value: false,
      },
    ],
    total: {
      Pending: 0,
      Approved: 0,
      Cancelled: 0,
      Currency: {},
      Fee: 0,
    },
    table: {
      date_from: "",
      date_to: "",
      title: "Reports",
      columns: [
        {
          name: "date_created",
          label: "DATE",
          field: "date_created",
          align: "left",
          sortable: true,
        },
        {
          name: "description",
          label: "DESCRIPTION",
          field: "description",
          align: "left",
          sortable: true,
        },
        {
          name: "debit_amount",
          label: "DEBIT AMOUNT",
          field: "debit_amount",
          align: "right",
          sortable: true,
        },
        {
          name: "credit_amount",
          label: "CREDIT AMOUNT",
          field: "credit_amount",
          align: "right",
          sortable: true,
        },
        {
          name: "balance_after",
          label: "RUNNING BALANCE",
          field: "balance_after",
          align: "right",
          sortable: true,
        },
      ],
      column_hedge: [
        {
          name: "period",
          label: "CONTRACT PERIOD",
          field: "period",
          align: "left",
          sortable: true,
        },
        {
          name: "fund_type",
          label: "FUND TYPE",
          field: "fund_type",
          align: "left",
          sortable: true,
        },
        {
          name: "value",
          label: "AMOUNT",
          field: "value",
          align: "right",
          sortable: true,
        },
        {
          name: "percent",
          label: "RATE",
          field: "percent",
          align: "right",
          sortable: true,
        },
        {
          name: "projected_amount",
          label: "PROJECTED VALUE",
          field: "projected_amount",
          align: "right",
          sortable: true,
        },
      ],
      data: [],
      selected_transaction_type: "",
      transaction_type: [
        { label: "Deposit", val: "deposit" },
        { label: "Transfer to Another Lexicon Account", val: "send internal" },
        { label: "Wire Transfer", val: "send external" },
        { label: "Convert", val: "convert" },
        { label: "All", val: "All" },
      ],
      selected_currency: "",
      selected_date_range: "",
      date_range: [
        { label: "Today", val: 0 },
        { label: "Last 7 Days", val: 7 },
        { label: "Last 30 Days", val: 30 },
        { label: "Custom", val: "Custom" },
      ],
    },
    pdf: {
      columns: [
        { title: "DATE", dataKey: "date_created" },
        { title: "DESCRIPTION", dataKey: "description" },
        { title: "DEBIT", dataKey: "debit_amount" },
        { title: "CREDIT", dataKey: "credit_amount" },
        { title: "RUNNING BALANCE", dataKey: "balance_after" },
      ],
      column_hedge: [
        { title: "CONTRACT PERIOD", dataKey: "period" },
        { title: "FUND TYPE", dataKey: "fund_type" },
        { title: "AMOUNT", dataKey: "value" },
        { title: "RATE", dataKey: "percent" },
        { title: "PROJECTED VALUE", dataKey: "projected_amount" },
      ],
      rows: [],
    },
  }),
  async mounted() {
    this.$q.loading.show();
    await this.viewWalletOptions();
    let server_date = await this.$_post(postServerDate);

    this.table.date_from = this.moment(server_date.data.data).tz("Europe/London").format(
      "YYYY/MM/DD"
    );
    this.table.date_to = this.moment(server_date.data.data).tz("Europe/London").format(
      "YYYY/MM/DD"
    );
    this.$q.loading.hide();
  },
  computed: {
    tableInputData() {
      return {
        hasTransactionType:
          this.table.selected_transaction_type != "" ? true : false,
        hasCurrency: this.table.selected_currency != "" ? true : false,
        hasDateRange: this.table.selected_date_range != "" ? true : false,
      };
    },
    is_hedge() {
      if (!this.transact) {
        this.table.selected_date_range = { label: "Today", val: 0 };
        this.table.selected_transaction_type = {
          label: "Hedge Fund",
          val: "hedge",
        };
      } else {
        this.table.selected_date_range = "";
        this.table.selected_transaction_type = "";
      }
    },
  },
  methods: {
    async viewWalletOptions() {
      await this.$_post(postWalletDetailsOptions).then((response) => {
        this.wallet_details = response.data.wallet;
      });
      for (let i = 0; i < this.wallet_details.length; i++) {
        this.currency_list.push(this.wallet_details[i].currency);
      }
    },

    async mapTransact(data)
    {
      await data.forEach(row => {
        row.date_created = this.moment(row.date_created).tz("Europe/London").format('DD-MMM-YYYY');
        row.balance_after = typeof row.balance_after == 'number' ? (row.balance_after / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2, maximumFractionDigits:2}) : row.balance_after;
        row.debit_amount = row.transaction_method === 'minus' ? (row.amount / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2, maximumFractionDigits:2}) : '';
        row.credit_amount = row.transaction_method === 'plus' ? (row.amount / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2, maximumFractionDigits:2}) : '';
      })
    },

    async mapHedge(data)
    {
      await data.forEach(row => {
        row.period = `${this.moment(row.date_from).tz("Europe/London").format('DD-MMM-YYYY')} to ${this.moment(row.date_to).tz("Europe/London").format('DD-MMM-YYYY')}`;
        row.value = (row.amount / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        row.projected_amount = (
          (row.amount * (1 + row.rate / 100)) /
          10 ** 2
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        row.percent = `${row.rate}%`;
      });
    },

    async download() {
      let columns = {};
      if (!this.transact) {
        columns = this.pdf.column_hedge;
        await this.mapHedge(this.pdf.rows);
      } else {
        columns = this.pdf.columns;
        await this.mapTransact(this.pdf.rows);
      }
      let type = `${this.table.selected_transaction_type.label}`;
      let currency = `${this.table.selected_currency}`;

      let doc = new jspdf("p", "pt");

      doc.autoTable(columns, this.pdf.rows, {
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 8,
          fillColor: "#2f4c7e",
        },
        columnStyles: {
          balance_after: { halign: "right" },
          debit_amount: { halign: "right" },
          credit_amount: { halign: "right" },
          value: { halign: "right" },
          projected_amount: { halign: "right" },
          period: { halign: "center" },
          percent: { halign: "center" },
        },
        createdCell: function (cell, data) {
          cell.styles.fillColor = "#ffffff";
        },
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text(`Currency: ${currency}\nTransaction Type: ${type}`, 40, 30);
        },
      });
      doc.save("Lexicon Bank Transactions.pdf");
    },

    async exportTable() {
      let columns = {};
      if (!this.transact) {
        columns = this.table.column_hedge;
        await this.mapHedge(this.table.data);
      } else {
        columns = this.table.columns;
        await this.mapTransact(this.table.data);
      }
      // naive encoding to csv format
      const content = [columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.table.data.map((row) =>
            columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("Lexicon Bank Transactions.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },

    async showDateModal(data) {
      if (data.name == "from") {
        this.showDatePickerFrom();
      } else if (data.name == "to") {
        this.showDatePickerTo();
      }
    },
    async showDatePickerFrom() {
      this.$refs.date_picker_modal_from.showModal();
    },
    async showDatePickerTo() {
      this.$refs.date_picker_modal_to.showModal();
    },
    async showTblData() {
      this.table.title = `${this.table.selected_transaction_type.label} (${this.table.selected_currency})`;
      this.is_show_table = true;
      if (
        this.tableInputData.hasTransactionType == true &&
        this.tableInputData.hasCurrency == true &&
        this.tableInputData.hasDateRange == true
      ) {
        // assign filters
        let table_input_data = {
          transaction_type: this.table.selected_transaction_type.val,
          currency: this.table.selected_currency,
          date_range: this.table.selected_date_range.val,
        };
        // if custom date get user defined dates
        if (table_input_data.date_range == "Custom") {
          table_input_data.date_from = this.table.date_from;
          table_input_data.date_to = this.table.date_to;
        } else {
          table_input_data.last_defined_date_range =
            table_input_data.date_range;
        }
        //  optimize, delete unneccesary data for request
        delete table_input_data.date_range;

        //  create report request
        this.loading2 = true;
        // this.$q.loading.show();
        let transactions = await this.$_post(
          getClientTransactionReport,
          table_input_data
        );
        this.table.data = transactions.data.data;
        this.pdf.rows = transactions.data.data;
        window.scrollTo(0, 0);
        this.loading2 = false;
        // this.$q.loading.hide();
      }
    },
  },
};
</script>

<style scoped>
.text-size {
  font-size: 25px;
}
.close-btn {
  letter-spacing: 1px;
  font-size: 14px;
}
.add-btn {
  letter-spacing: 1px;
  font-size: 14px;
}
.currency-details-container {
  width: 500px;
}
.card-container {
  padding: 30px 60px;
}
.btn-toggle {
  border: 1px solid #2f4c7e;
}
.btn-add-currency {
  background-color: #b5cef5;
}
.back-btn {
  background-color: #2f4c7e !important;
  color: white;
}
</style>