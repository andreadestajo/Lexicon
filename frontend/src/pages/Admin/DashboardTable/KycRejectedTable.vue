=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div class="component q-ma-sm">
    <div>
      <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
        <template slot="table_rows" slot-scope="props">
          <q-td key="first_name">{{props.data.first_name}}</q-td>
          <q-td key="last_name">{{props.data.last_name}}</q-td>
        </template>
      </u-q-table>
    </div>
  </div>
</template>


<script>
import moment from "moment-timezone";
import UQTable from "../../../components/UQTable";
import { getKycByStatus } from "../../../references/url";
export default {
  components: {
    UQTable,
  },
  data: () => ({
    table: {
      title: "Resubmit Image(s)",
      columns: [
        {
          name: "first_name",
          label: "FIRST NAME",
          field: "first_name",
          align: "left",
          sortable: true,
        },
        {
          name: "last_name",
          label: "LAST NAME",
          field: "last_name",
          align: "left",
          sortable: true,
        },
      ],
      data: [],
    },
  }),
  async mounted() {
    this.$q.loading.show();
    await this.setKycSubmitsReject();
    this.$q.loading.hide();
  },
  computed: {},
  methods: {
    async setKycSubmitsReject() {
      let kyc_pending = await this.getKycByStatus("rejected");

      if (kyc_pending.data.status == "success") {
        this.table.data = kyc_pending.data.data;
      } else if (kyc_pending.data.status == "error") {
      }
    },

    async getKycByStatus(status) {
      let form_data = {};
      form_data.status = status;
      let kyc = await this.$_post(getKycByStatus, form_data);
      return kyc;
    },
  },
};
</script>
<style>
.admin-kyc {
  padding: 20px 100px;
}
.row-table-font {
  font-family: "Raleway", sans-serif;
}
.label-modal {
  font-family: "Montserrat", sans-serif;
}
</style>