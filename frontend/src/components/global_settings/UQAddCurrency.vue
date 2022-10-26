=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <!-- **Author: VPP -->
    <!-- content -->
    <div>
      <!-- @download="download" -->
      <u-q-table
        @alertzz="test_alert"
        :tbl_title="table.title"
        :tbl_columns="table.columns"
        :tbl_data="table.data"
        :btn_is_show="true"
      >
        <q-btn
          slot="btn"
          class="q-mr-lg text-accent btn-add-currency text-weight-bold"
          icon-right="add"
          label="ADD CURRENCY"
          no-caps
          @click="test_alert"
        />
        <template slot="table_rows" slot-scope="props">
          <q-td key="#">{{table.data.indexOf(props.data)+1}}</q-td>
          <q-td key="name">{{props.data.name}}</q-td>
          <q-td key="abbreviation">{{props.data.abbreviation}}</q-td>
          <q-td key="type">{{props.data.is_fiat ? 'Fiat' : 'Crypto'}}</q-td>
          <q-td key="decimal_places">{{props.data.decimal_places}}</q-td>
        </template>
      </u-q-table>
      <q-dialog v-model="alert" persistent>
        <q-card>
          <q-card-section class="card-container">
            <div
              class="q-mb-md text-h5 font-monseratt currency-details-container"
            >Fill-up Currency Details</div>
            <hr class="q-mb-md" />
            <q-form @submit="addCurrency()">
              <q-btn-toggle
                @input="reset()"
                v-model="form_data.is_fiat"
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
                color="accent"
                class="full-width font-monseratt"
                outlined
                dense
                v-model="form_data.name"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                behavior="menu"
                label="Currency Name"
                :rules="[val => !!val || '* Field is required']"
                :options="form_data.is_fiat ? currencyOptions : cryptoOptions"
                @filter="filterFn"
                @input="handleChange"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey font-monseratt">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                class="q-mb-md font-monseratt"
                outlined
                dense
                readonly
                v-model="form_data.abbreviation"
                label="Currency Abbreviation"
                required
              />

              <q-input
                class="q-mb-md font-monseratt"
                outlined
                dense
                readonly
                v-model.number="form_data.decimal_places"
                label="Decimal Places"
                required
              />

              <div class="row justify-end font-oswald">
                <div class="col-2 q-mr-md">
                  <q-btn
                    type="submit"
                    unelevated
                    class="full-width q-mt-md add-btn"
                    color="accent"
                  >Add</q-btn>
                </div>
                <div class="col-2">
                  <q-btn
                    v-close-popup
                    unelevated
                    outline
                    class="full-width q-mt-md close-btn"
                    color="accent"
                  >Close</q-btn>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { postAddCurrency, postViewCurrencies } from "../../references/url";
// import jspdf from 'jspdf';
// import 'jspdf-autotable';
import UQTable from "../UQTable";
import currencyList from "../../references/currency_list";
import cryptoList from "../../references/crypto_list";
import currencyObjects from "../../references/currency_objects";
import cryptoObject from "../../references/crypto_object";

export default {
  data: () => ({
    form_data: {
      is_fiat: true,
      number_code: "",
      abbreviation: "",
      name: "",
      decimal_places: null,
    },
    table: {
      title: "Supported Currencies",
      columns: [
        { name: "#", label: "#", field: "#", align: "left", sortable: true },
        {
          name: "name",
          label: "NAME",
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "abbreviation",
          label: "ABBREVIATION",
          field: "abbreviation",
          align: "left",
          sortable: true,
        },
        {
          name: "type",
          label: "TYPE",
          field: "decimal_places",
          align: "left",
          sortable: true,
        },
        {
          name: "decimal_places",
          label: "DECIMAL PLACES",
          field: "decimal_places",
          align: "left",
          sortable: true,
        },
      ],
      data: [],
    },
    pdf: {
      columns: [
        { title: "Name", dataKey: "name" },
        { title: "Abbreviation", dataKey: "abbreviation" },
        { title: "Decimal Places", dataKey: "decimal_places" },
        { title: "Is Fiat", dataKey: "is_fiat" },
      ],
      rows: [],
    },
    rows: [],
    currencyOptions: currencyList,
    cryptoOptions: cryptoList,
    currencyObject: currencyObjects,
    cryptoObject: cryptoObject,
    options: [
      {
        label: "Fiat",
        value: true,
      },
      {
        label: "Crypto",
        value: false,
      },
    ],
    is_show_send_success: false,
    alert: false,
  }),

  components: {
    UQTable,
  },

  mounted() {
    this.viewCurrencies();
  },
  methods: {
    // async download() {
    //   let doc = new jspdf('p', 'pt');
    //   doc.autoTable(this.pdf.columns, this.pdf.rows, {
    //     theme: 'striped',
    //     styles: {font: 'helvetica'},
    //     // columnStyles: {
    //     //   id: {fillColor: 0}
    //     // },
    //     margin: {top: 60},
    //     addPageContent: function(data) {
    //       doc.text("Lexicon User Transactions", 40, 30);
    //     }
    //   });
    //   doc.save('Lexicon Transactions.pdf');
    // },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          if (this.form_data.is_fiat) {
            this.currencyOptions = currencyList;
          } else {
            this.cryptoOptions = cryptoList;
          }
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        if (this.form_data.is_fiat) {
          this.currencyOptions = currencyList.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        } else {
          this.cryptoOptions = cryptoList.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },

    async viewCurrencies() {
      this.$q.loading.show();
      let currencies = await this.$_post(postViewCurrencies);
      this.table.data = currencies.data;
      // this.pdf.rows = currencies.data;
      this.$q.loading.hide();
    },

    async handleChange() {
      if (this.form_data.is_fiat) {
        this.form_data.abbreviation = this.currencyObject[
          this.form_data.name
        ].abbreviation;
        this.form_data.number_code = this.currencyObject[
          this.form_data.name
        ].number_code;
        this.form_data.decimal_places = 2;
      } else {
        this.form_data.abbreviation = this.cryptoObject[
          this.form_data.name
        ].abbreviation;
        this.form_data.decimal_places = this.cryptoObject[
          this.form_data.name
        ].decimal_places;
      }
    },

    async reset() {
      this.form_data.name = "";
      this.form_data.abbreviation = "";
      this.form_data.decimal_places = null;
    },

    async addCurrency() {
      // this.$q.loading.show();
      let res = await this.$_post(postAddCurrency, this.form_data);
      if (res) {
        await this.viewCurrencies();
        // this.$q.notify({
        //   type: `positive`,
        //   message: `Currency added successfully.`,
        //   position: "top",
        // });
        this.$q.notify({
            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Currency added successfully.</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
        this.alert = false;
      }
      // this.$q.loading.hide();
    },

    async test_alert(word) {
      this.reset();
      this.alert = true;
    },
  },
};
</script>
<style>
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
</style>