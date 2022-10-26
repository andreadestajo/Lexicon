<template>
  <div>
    <!-- **Author: VP -->
    <!-- content -->
    <div>
      <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
        <template slot="table_rows" slot-scope="props">
          <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
          <q-td key="reference_number">{{props.data.reference_number}}</q-td>
          <q-td key="bank">{{props.data.bank}}</q-td>
          <q-td key="account_name">{{props.data.account_name}}</q-td>
          <q-td key="account_number">{{props.data.account_number}}</q-td>
          <q-td key="status">{{props.data.currency_abbreviation}}</q-td>
          <q-td key="amount">{{props.data.amount/100}}</q-td>
          <q-td key="action">
            <q-btn @click="confirm = true" class="bg-red">
              <i class="fas fa-times text-white"></i>
            </q-btn>
          </q-td>
        </template>
      </u-q-table>

      <!-- Dialog Confirmation -->
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="far fa-question-circle" color="accent" text-color="white" />
            <span class="q-ml-sm">What is the reason for your cancelation?</span>
          </q-card-section>

          <div style="width: 300px; margin: auto;">
            <q-select
              name="reason"
              v-model="form_data.reason"
              :options="options"
              color="accent"
              filled
              label="Reason for cancelation"
              :rules="[val => !!val]"
            />
          </div>
          <q-checkbox
            class="q-ml-md"
            size="xs"
            v-model="val"
            label="I recognize and confirm this action"
          />

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <div class="text-center">
              <q-btn
                flat
                type="submit"
                color="accent"
                unelevated
                class="full-width"
                :disable="val ? false : true"
                @click="submitHandler"
              >Proceed</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- end of Dialog Confirmation -->

      <q-dialog v-model="res" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="fas fa-info-circle" color="accent" text-color="white" />
            <span class="q-ml-sm">Your appeal has been received by Lexicon bank</span>
          </q-card-section>
          <div style="width: 90%; margin: auto;">
            Your appeal has been received and is now undergoing validation from our team.
            We will be sending updates for your request via your nominated Email account.
          </div>
          <q-card-actions align="right">
            <div class="text-center">
              <q-btn
                flat
                type="submit"
                color="accent"
                unelevated
                class="full-width"
                v-close-popup
              >Okay</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { postManageTransactions } from "../references/url";
import moment from "moment-timezone";
import UQTable from "./UQTable";
export default {
  data: () => ({
    table: {
      title: "",
      columns: [
        {
          name: "date_created",
          label: "DATE CREATED",
          field: "date_created",
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
          name: "status",
          label: "CURRENCY",
          field: "status",
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
        { name: "action", label: "ACTION", field: "action", align: "left" },
      ],
      data: [],
    },
    form_data: {
      reason: "",
    },
    val: false,
    confirm: false,
    res: false,
    moment: moment,
    options: ["Possible Scam", "Incorrect Details", "Incorrect Currency"],
  }),

  components: {
    UQTable,
  },

  mounted() {
    this.viewTransactions();
  },
  methods: {
    async viewTransactions() {
      this.$q.loading.show();
      let res = await this.$_post(postManageTransactions);
      this.table.data = res.data;
      this.$q.loading.hide();
    },
    async submitHandler() {
      this.$q.loading.show();
      this.confirm = false;
      this.res = true;
      this.$q.loading.hide();
    },
  },
};
</script>

