<template>
  <div class="documentation">
    <div>
      <q-form @submit="showTblData" v-if="!is_show_table">
        <div class="text-center text-h6 q-mb-md bg-header color-default" id="header-h6">
          <p class="deposit-css q-py-lg font-monseratt">
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
            :options="table.currency.list"
            label="Currency"
            outlined
          ></q-select>

          <q-select
            :rules="[val => !!val || '* Field is required']"
            v-model="table.selected_date_range"
            :options="table.date_range"
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
            <q-btn type="submit" unelevated class="full-width q-mt-md add-btn" color="accent">Search</q-btn>
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
      <template slot="table_rows" slot-scope="props">
        <q-td key="date_created">{{moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY')}}</q-td>
        <q-td key="full_name">{{props.data.full_name}}</q-td>
        <q-td key="description">{{props.data.description.replace('You have', '')}}</q-td>
        <q-td key="currency" align="center">
          {{ props.data.currency_abbreviation }}
        </q-td>
        <q-td key="amount" align="right">
          {{ (props.data.amount / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2}) }}
        </q-td>
        <q-td key="fee" align="right">{{(props.data.fee / 10 ** 2).toLocaleString("en-US", {
          minimumFractionDigits:2})}}</q-td>
        <q-td key="status" align="right">{{ props.data.status }}</q-td>
      </template>
    </u-q-table>
    
    <!-- FOR HEDGE FUND -->
    <u-q-table v-else-if="!transact" :tbl_title="table.title" :tbl_columns="table.column_hedge" :tbl_data="table.data">
      <template slot="table_rows" slot-scope="props">
        <q-td key="period" align="left">{{moment(props.data.date_from).format('DD-MMM-YYYY')}} to {{moment(props.data.date_to).format('DD-MMM-YYYY')}}</q-td>
        <q-td key="fund_type">{{props.data.fund_type}}</q-td>
            <q-td
              key="value"
              align="right"
            >{{ (props.data.amount / 10 ** 2).toLocaleString("en-US", { minimumFractionDigits:2 }) }}</q-td>
            <q-td key="percent" align="right">{{ props.data.rate }}%</q-td>
            <q-td key="projected_amount" align="right">
              {{ (props.data.amount * (1 + (props.data.rate / 100)) / 10 ** 2).toLocaleString("en-US", {
              minimumFractionDigits:2}) }}
            </q-td>
          </template>
        </u-q-table>

        <div
          v-if="!(table.selected_currency == 'All' || table.selected_transaction_type.label == 'All')"
        >
          <div class="row q-gutter-md q-mt-md justify-center">
            <q-card
              class="my-card dashboard-cards bg-default col-4"
              v-if="table.selected_transaction_type.val == 'send external'"
            >
              <q-card-section class="text-center text-size">
                <div class="text-white font-raleway" id="header-font">
                  <div>Pending</div>
                </div>
                <p class="font-bebas" id="p-font-frequency">
                  <b class="text-white">
                    {{(total.Pending/ 10 ** 2).toLocaleString("en-US", {
                    minimumFractionDigits:2})}}
                  </b>
                </p>
              </q-card-section>
            </q-card>

            <q-card
              class="my-card dashboard-cards bg-default col-4"
              v-if="table.selected_transaction_type.val == 'send external'"
            >
              <q-card-section class="text-center text-size">
                <div class="text-white font-raleway" id="header-font">
                  <div>Approved</div>
                </div>
                <p class="font-bebas" id="p-font-frequency">
                  <b class="text-white">
                    {{(total.Approved/ 10 ** 2).toLocaleString("en-US", {
                    minimumFractionDigits:2})}}
                  </b>
                </p>
              </q-card-section>
            </q-card>

            <q-card
              class="my-card dashboard-cards bg-default col-4"
              v-if="table.selected_transaction_type.val == 'send external'"
            >
              <q-card-section class="text-center text-size">
                <div class="text-white font-raleway" id="header-font">
                  <div>Cancelled</div>
                </div>
                <p class="font-bebas" id="p-font-frequency">
                  <b class="text-white">
                    {{(total.Cancelled/ 10 ** 2).toLocaleString("en-US", {
                    minimumFractionDigits:2})}}
                  </b>
                </p>
              </q-card-section>
            </q-card>
          </div>
          <div class="row q-mt-xs q-gutter-md justify-center">
            <q-card class="my-card dashboard-cards bg-default col-4">
              <q-card-section class="text-center text-size">
                <div class="text-white font-raleway" id="header-font">
                  <div>Amount</div>
                </div>
                <p class="font-bebas" id="p-font-frequency">
                  <b class="text-white">
                    {{(total.Currency.hasOwnProperty(table.selected_currency)) ?( total.Currency[table.selected_currency] / 10 ** 2).toLocaleString("en-US", {
                    minimumFractionDigits:2}) : (0).toLocaleString("en-US", {
                    minimumFractionDigits:2})}}
                  </b>
                </p>
              </q-card-section>
            </q-card>

            <q-card
              v-if="table.selected_transaction_type.val == 'hedge'"
              class="my-card dashboard-cards bg-default col-4"
            >
              <q-card-section class="text-center text-size">
                <div class="text-white font-raleway" id="header-font">
                  <div>Projected Amount</div>
                </div>
                <p class="font-bebas" id="p-font-frequency">
                  <b class="text-white">
                    {{ total.Currency.hasOwnProperty(table.selected_currency) ? (total.ProjectedHedge / 10 ** 2).toLocaleString("en-US", {
                    minimumFractionDigits:2}) : (0).toLocaleString("en-US", {
                    minimumFractionDigits:2}) }}
                  </b>
                </p>
              </q-card-section>
            </q-card>

            <q-card
              v-if="!(table.selected_transaction_type.val == 'deposit' || table.selected_transaction_type.label == 'Hedge Fund')"
              class="my-card dashboard-cards bg-default col-4"
            >
              <q-card-section class="text-center text-size">
                <div class="text-white font-raleway" id="header-font">
                  <b>
                    <div>Fee</div>
                  </b>
                </div>
                <p class="font-bebas" id="p-font-frequency">
                  <b class="text-white">
                    {{(total.Fee/ 10 ** 2).toLocaleString("en-US", {
                    minimumFractionDigits:2})}}
                  </b>
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import moment from "moment-timezone";
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";
import { postServerDate, getTransactionReport } from "../../references/url";
export default {
  name: "Reports",
  components: {
    UQTable,
    UQModal,
  },
  data: () => ({
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
      ProjectedHedge: 0,
      Fee: 0,
    },
    table: {
      date_from: "",
      date_to: "",
      title: "Reports",
      columns: [
        {
          name: "date",
          label: "DATE",
          field: "date",
          align: "center",
          sortable: true,
        },
        {
          name: "client",
          label: "CLIENT",
          field: "client",
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
          name: "currency",
          label: "CURRENCY",
          field: "currency",
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
          name: "fee",
          label: "FEE",
          field: "fee",
          align: "center",
          sortable: true,
        },
        { name: "status", label: "STATUS", field: "status", align: "center" },
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
      currency: { list: ["USD", "EUR", "GBP", "All"], total: {} },
      selected_date_range: "",
      date_range: [
        { label: "Today", val: 0 },
        { label: "Last 7 Days", val: 7 },
        { label: "Last 30 Days", val: 30 },
        { label: "Custom", val: "Custom" },
      ],
    },
  }),
  async mounted() {
    this.$q.loading.show();
    let server_date = await this.$_post(postServerDate);
    console.log(server_date);
    this.table.date_from = this.moment(server_date.data.data).format(
      "YYYY/MM/DD"
    );
    this.table.date_to = this.moment(server_date.data.data).format(
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
      this.table.title = this.table.selected_transaction_type.label;
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
          table_input_data.date_from = this.moment(this.table.date_from).format(
            "YYYY-MM-DD"
          );
          table_input_data.date_to = this.moment(this.table.date_to).format(
            "YYYY-MM-DD"
          );
        } else {
          table_input_data.last_defined_date_range =
            table_input_data.date_range;
        }
        //  optimize, delete unneccesary data for request
        delete table_input_data.date_range;

        //  create report request
        this.$q.loading.show();
        let transactions = await this.$_post(
          getTransactionReport,
          table_input_data
        );
        this.table.data = transactions.data.data;
        console.log(transactions.data.data);
        this.getTotalAmount(this.table.data);
        this.$q.loading.hide();
      }
    },
    async getTotalAmount(list) {
      this.total.Pending = 0;
      this.total.Cancelled = 0;
      this.total.Approved = 0;
      this.total.Fee = 0;
      this.total.ProjectedHedge = 0;
      this.total.Currency[this.table.selected_currency] = 0;
      if (this.table.selected_transaction_type.val == "send external") {
        list.forEach((item, i) => {
          // assign overall total of amount base on transaction status (pending, approved, cancelled)
          this.total[item.status] += item.amount;
          this.total.Currency[item.currency_abbreviation] += parseInt(
            item.amount
          );
          this.total.Fee += item.fee;
        });
      } else if (this.table.selected_transaction_type.val == "send internal") {
        // only the total amount will be computed if transaction type is "send internal"
        list.forEach((item, i) => {
          this.total.Currency[item.currency_abbreviation] += parseInt(
            item.amount
          );
        });
      } else if (this.table.selected_transaction_type.val == "convert") {
        // total amount and total fee will be computed for "convert" transaction type
        list.forEach((item, i) => {
          this.total.Currency[item.currency_abbreviation] += parseInt(
            item.amount
          );
          this.total.Fee += item.fee;
        });
      } else if (this.table.selected_transaction_type.val == "deposit") {
        list.forEach((item, i) => {
          // assign overall total of amount base on transaction status (pending, approved, cancelled)
          this.total[item.status] += item.amount;
          this.total.Currency[item.currency_abbreviation] += parseInt(
            item.amount
          );
          this.total.Fee += item.fee;
        });
      } else if (this.table.selected_transaction_type.val == "hedge") {
        list.forEach((item, i) => {
          // assign overall total of amount base on transaction status (pending, approved, cancelled)
          this.total[item.status] += item.amount;
          this.total.Currency[item.currency_abbreviation] += parseInt(
            item.amount
          );
          // this.total.ProjectedHedge += (item.amount * (1 + (item.rate / 100)));
          this.total.ProjectedHedge += parseInt(
            item.amount * (1 + item.rate / 100)
          );
        });
      }
    },
  },
};
</script>

<style scoped>
.text-size {
  font-size: 25px;
}
</style>



