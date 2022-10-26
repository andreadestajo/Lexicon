=========================================
Title:  Activity Logs
Author: Paul Musa
Date:   28 Aug 2020
Contributor:
=========================================

<template>
  <div class="admin-table">
    <div class="q-ma-lg">
      <div class>
        <u-q-table
          :tbl_title="table.title"
          :tbl_columns="table.columns"
          :tbl_data="table.data"
          :pgntn_is_show="false"
        >
          <span
            slot="btn"
            class="text-white q-mr-lg"
            no-caps
          >
            <q-btn 
              class="text-accent btn-file text-weight-bold q-mr-md"
              @click="viewDateFrom"
            >
              {{ date.from == '' ?  'From' : moment(date.from).format('DD-MMM-YYYY') }}
            </q-btn> 
            <strong> - </strong> 
            <q-btn 
              class="text-accent btn-file text-weight-bold q-ml-md"
              @click="viewDateTo"
            >
              {{ date.to == '' ? 'To' : moment(date.to).format('DD-MMM-YYYY') }}
            </q-btn>
          </span>

          <q-btn
            slot="btn"
            class="q-mr-lg text-accent btn-file text-weight-bold"
            icon-right="archive"
            label="PDF"
            no-caps
            @click="createPDF()"
          />

          <template slot="table_rows" slot-scope="props">
            <q-td key="date_created">{{ props.data.date_created }}</q-td>
            <q-td key="full_name">{{ props.data.full_name }}</q-td>
            <q-td key="user_role">{{ props.data.user_role }}</q-td>
            <q-td key="description">{{ props.data.description }}</q-td>
            <q-td key="reference_number" align="center">{{ props.data.reference_number }}</q-td>
          </template>
        </u-q-table>
      </div>
    </div>

    <u-q-modal ref="date_picker_modal_from" :modal_data="{}" :is_persistent="true">
        <div class="text-h6" slot="modal-header">Pick a date</div>
        <div slot="modal-content">
          <q-date v-model="date.from" flat></q-date>
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
import { getActivityLogs } from "../../references/url";
import jspdf from "jspdf";
import "jspdf-autotable";

export default {
  components: {
    UQTable,
    UQModal,
  },
  data: () => ({
    moment: moment,
    date: 
    {
      from: "",
      to: ""
    },
    table: {
      title: "Activity Log",
      columns: [
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
          name: "user_role",
          label: "USER ROLE",
          field: "user_role",
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
          name: "reference_number",
          label: "REFERENCE NUMBER",
          field: "reference_number",
          align: "center",
          sortable: true,
        },
      ],

      data: [],
    },

    pdf: {
      columns: [
        {
          title: "DATE",
          dataKey: "date_created",
        },
        {
          title: "ADMIN NAME",
          dataKey: "full_name",
        },

        {
          title: "ADMIN ROLE",
          dataKey: "user_role",
        },

        {
          title: "DESCRIPTION",
          dataKey: "description",
        },

        {
          title: "REFERENCE NUMBER",
          dataKey: "reference_number",
        },
      ],
      rows: [],
    },
  }),

  async mounted() {
    this.$q.loading.show();
    this.getActivityList();
    this.$q.loading.hide();
  },

  methods: {
    async getActivityList() {
      let res = await this.$_post(getActivityLogs);
      this.table.data = res.data.data;

      // this.date.from = this.moment(this.table.data[this.table.data.length - 1].date_created).format("DD-MMM-YYYY");
      // this.date.to = this.moment(this.table.data[0].date_created).format("DD-MMM-YYYY");

  
      await this.table.data.forEach((row, index) => {
        row.date_created = moment(row.date_created).tz("Europe/London").format("DD-MMM-YYYY");
      });
      this.pdf.rows = this.table.data;
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
          date_created: { halign: "center" },
          user_role: { halign: "center" },
          reference_number: { halign: "center" },
        },
        createdCell: function (cell, data) {
          cell.styles.fillColor = "#ffffff";
        },
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text(title, 40, 30);
        },
      });
      doc.save("Lexicon Activity Logs.pdf");
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

    async getFilteredTransactions() {
      let res = await this.$_post(getActivityLogs, this.date);

      if (res.status == 200) 
      {
        this.table.data = res.data.data;

        await this.table.data.forEach((row, index) => {
        row.date_created = moment(row.date_created).tz("Europe/London").format("DD-MMM-YYYY");
        });
        this.pdf.rows = this.table.data;
      } 
      else if (res.data.status == "error") 
      {
        alert(res.data.message);
      }
      return res;
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
