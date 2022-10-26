

=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div class="component q-ma-sm">
    <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
      <template slot="table_rows" slot-scope="props">
        <q-td key="full_name">{{props.data.full_name}}</q-td>

        <q-td key="role">{{props.data.user_role}}</q-td>
        <q-td key="role">{{props.data.country}}</q-td>
      </template>
    </u-q-table>
  </div>
</template>


<script>
import UQTable from "../../../components/UQTable";
import UQModal from "../../../components/UQModal";
import {
  setUserRole,
  postUserList,
  AdminAddUser,
  removeUser,
} from "../../../references/url";
import countries from "../../../references/countries";

export default {
  components: {
    UQTable,
    UQModal,
  },

  data: () => ({
    form_data: {
      user_id: "",
      user_email: "",
      user_fullname: "",
      user_role: "",
      user_restrictions: "",
    },
    success: false,
    remove: false,
    addRoleSuccess: false,

    user_data: {
      full_name: "",
      email: "",
      contact: "",
      country: "",
      password: "",
      select_role: "",
    },

    countryOptions: countries,
    val: true,
    select_role: null,
    options: ["Administrator", "Reviewer", "Approver", "Moderator", "Client"],
    model: null,
    selection: [],
    table: {
      title: "Admin",
      columns: [
        {
          name: "full_name",
          label: "FULL NAME",
          field: "full_name",
          align: "left",
          sortable: true,
        },

        {
          name: "role",
          label: "ROLE",
          field: "role",
          align: "left",
          sortable: true,
        },

        {
          name: "country",
          label: "COUNTRY",
          field: "country",
          align: "left",
          sortable: true,
        },
      ],
      data: [],
    },

    modal: {
      user_information: {},
    },
  }),
  async mounted() {
    this.getUsers();
  },
  computed: {},
  methods: {
    async getUsers() {
      let res = await this.$_post(postUserList);
      // console.log(res.data)
      if (res) {
        this.$q.loading.hide();
        this.table.data = res.data;

        // console.log(this.table.data)
      }
    },
  },
};
</script>
