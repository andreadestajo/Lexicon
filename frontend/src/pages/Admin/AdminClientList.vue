=========================================
Title:  Clients Masterlist
Author: Paul Musa
Date:   25 Aug 2020
Contributor:
=========================================

<template>
  <div class>
    <div class="q-ma-lg">
      <div class>
        <u-q-table
          :tbl_title="table.title"
          :tbl_columns="table.columns"
          :tbl_data="table.data"
          :pgntn_is_show="false"
        >
          <q-btn
            slot="btn"
            class="q-mr-lg text-accent btn-file text-weight-bold"
            icon-right="archive"
            label="CSV"
            no-caps
            @click="createCSV()"
          />

          <q-btn
            slot="btn"
            class="q-mr-lg text-accent btn-file text-weight-bold"
            icon-right="archive"
            label="PDF"
            no-caps
            @click="createPDF()"
          />

          <template slot="table_rows" slot-scope="props">
            <q-td key="user_num">{{ props.data.user_num }}</q-td>
            <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
            <q-td key="full_name">{{ props.data.full_name }}</q-td>

            <!-- wallet array -->
            <q-td key="currency">
              <div class="line-break">{{ props.data.currency }}</div>
            </q-td>
            <q-td key="balance">
              <div class="line-break">{{ props.data.balance }}</div>
            </q-td>

            <!-- hedge_fund array -->
            <q-td key="hedge_type">
              <div class="line-break">{{ props.data.hedge_type }}</div>
            </q-td>
            <q-td key="hedge_amount">
              <div class="line-break">{{ props.data.hedge_amount }}</div>
            </q-td>
            <q-td key="hedge_rate">
              <div class="line-break">{{ props.data.hedge_rate }}</div>
            </q-td>
            <q-td key="hedge_contract">
              <div class="line-break">{{ props.data.hedge_contract }}</div>
            </q-td>
          </template>
        </u-q-table>
      </div>
    </div>
  </div>
</template>


<script>
import moment from "moment-timezone";
import config from "../../../config";
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";
import { getClientList } from "../../references/url";
import { exportFile } from "quasar";
import jspdf from "jspdf";
import "jspdf-autotable";

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
  components: {
    UQTable,
    UQModal,
  },
  data: () => ({
    moment: moment,
    wallet_details: {},
    hedge_fund: {},

    table: {
      title: "Client Masterlist",
      columns: [
        {
          name: "user_num",
          label: "#",
          field: "user_num",
          align: "left",
          sortable: true,
        },
        {
          name: "date_created",
          label: "DATE",
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
          name: "currency",
          label: "ACCOUNTS",
          field: "currency",
          align: "left",
          sortable: true,
        },

        {
          name: "balance",
          label: "BALANCE",
          field: "balance",
          align: "left",
          sortable: true,
        },

        {
          name: "hedge_type",
          label: "HEDGE FUND TYPE",
          field: "hedge_type",
          align: "left",
          sortable: true,
        },

        {
          name: "hedge_amount",
          label: "HEDGE AMOUNT",
          field: "hedge_amount",
          align: "left",
          sortable: true,
        },

        {
          name: "hedge_rate",
          label: "ANNUAL RETURN",
          field: "hedge_rate",
          align: "left",
          sortable: true,
        },

        {
          name: "hedge_contract",
          label: "CONTRACT PERIOD",
          field: "hedge_contract",
          align: "left",
          sortable: true,
        },
      ],
  
      data: [],
    },

    pdf: {
      columns: [
        {
          title: "#",
          dataKey: "user_num"
        },
        {
          title: "DATE",
          dataKey: "date_created"
        },

        {
          title: "FULL NAME",
          dataKey: "full_name"
        },

        {
          title: "ACCOUNTS",
          dataKey: "currency"
        },

        {
          title: "BALANCE",
          dataKey: "balance"
        },

        {
          title: "HEDGE FUND TYPE",
          dataKey: "hedge_type"
        },

        {
          title: "HEDGE AMOUNT",
          dataKey: "hedge_amount"
        },

        {
          title: "ANNUAL RETURN",
          dataKey: "hedge_rate"
        },

        {
          title: "CONTRACT PERIOD",
          dataKey: "hedge_contract"
        },
      ],
      rows: [],
    },

  }),

  async mounted() {
    this.$q.loading.show();
    await this.getAllClient();
    this.$q.loading.hide();
  },

  methods: {
    async getAllClient() {
      let res = await this.$_post(getClientList);

      this.table.data = res.data.data;
      await this.newDataTable();
      this.pdf.rows = this.table.data;
    },

    async newDataTable() {
      await this.table.data.forEach((user, index) => {
        user.user_num     = index + 1;
        user.date_created = moment(user.date_created).tz("Europe/London").format("DD-MMM-YYYY");

        // wallet array
        user.currency = user.wallet.map((x) => x.currency).join("\n");
        user.balance = user.wallet
          .map((x) =>
            (x.balance / 10 ** x.decimal_places).toLocaleString("en-US", {
              minimumFractionDigits: x.decimal_places,
              maximumFractionDigits: x.decimal_places,
            })
          )
          .join("\n");

        // hedge_fund array
        user.hedge_type = user.hedge_fund.map((x) => x.fund_type).join("\n");
        user.hedge_amount = user.hedge_fund
          .map(
            (x) =>
              x.currency_abbreviation + "  " + (x.amount / 10 ** x.decimal_places).toLocaleString("en-US", {
                minimumFractionDigits: x.decimal_places,
                maximumFractionDigits: x.decimal_places,
              })
          )
          .join("\n");
        user.hedge_rate = user.hedge_fund.map((x) => x.rate + " %").join("\n");
        user.hedge_contract = user.hedge_fund
          .map(
            (x) =>
              moment(x.date_from).tz("Europe/London").format("DD-MMM-YYYY") +
              " - " +
              moment(x.date_to).tz("Europe/London").format("DD-MMM-YYYY")
          )
          .join("\n");
      });
    },

    async createCSV() {
      // naive encoding to csv format
      const content = [this.table.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.table.data.map((row) =>
            this.table.columns
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

      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        // this.$q.notify({
        //   message: "Browser denied file download...",
        //   color: "negative",
        //   icon: "warning",
        // });
        this.$q.notify({
            message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Browser denied file download...</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
      }
    },

    async createPDF() {
      let title = this.table.title;
      let doc = new jspdf("l", "pt");

      doc.autoTable(this.pdf.columns, this.pdf.rows, {
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 8,
          fillColor: "#2f4c7e",
        },
        columnStyles: {
          balance: { halign: "right" },
          hedge_amount: { halign: "right" },
          date_created: { halign: "center" },
          currency: { halign: "center" },
          hedge_type: { halign: "center" },
          hedge_rate: { halign: "center" },
          hedge_contract: { halign: "center" },
        },
        createdCell: function (cell, data) {
          cell.styles.fillColor = "#ffffff";
        },
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text(title, 40, 30);
        },
      });
      doc.save("Lexicon Client Masterlist.pdf");
    },

  },
};
</script>

<style>
/* Styled by: PAUL */
.line-break {
  white-space: pre-wrap;
}

.zoom-container {
  width: 100%;
  max-height: 80vh;
}
.zoom-container img {
  width: 100%;
}
.text-area-style {
  width: 100%;
  height: 20vh;
}
.fa-eye {
  color: green;
  font-size: 20px;
}
.btn-file {
  background-color: #b5cef5;
}
</style>
