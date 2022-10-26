<template>
  <div class="documentation">
    <div v-if="$token" class="component q-ma-lg">
      <div class="form-container">
        <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
          <template slot="table_rows" slot-scope="props">
            <q-td key="name">{{props.data.name}}</q-td>
            <q-td key="abbreviation">{{props.data.abbreviation}}</q-td>
            <q-td key="type">{{props.data.is_fiat ? 'Fiat' : 'Crypto'}}</q-td>
            <q-td key="decimal_places">{{props.data.decimal_places}}</q-td>
          </template>
        </u-q-table>
        <u-q-add-currency @success="success()"></u-q-add-currency>
      </div>
    </div>
  </div>
</template>

<script>
import UQAddCurrency from "../../../components/global_settings/UQAddCurrency";
import UQTable from "../../../components/UQTable";
import { postViewCurrencies } from "../../../references/url";

export default {
  data: () => ({
    table: {
      title: "Lexicon Currencies",
      columns: [
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
          field: "type",
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
  }),
  components: { UQAddCurrency, UQTable },
  mounted() {
    this.viewCurrencies();
  },
  methods: {
    async viewCurrencies() {
      this.$q.loading.show();
      let currencies = await this.$_post(postViewCurrencies);
      this.table.data = currencies.data;
      this.$q.loading.hide();
    },
  },
};
</script>