<template>
  <div class="q-pa-md">
    <q-table
      :title="tbl_title"
      row-key="name"
      :data="tbl_data"
      :loading="is_loading"
      :columns="tbl_columns"
      :pagination.sync="tbl_pagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-btn
          color="accent"
          icon-right="archive"
          label="Export to PDF"
          no-caps
          @click="download"
        />
      </template>
      
        <q-tr slot="body" slot-scope="props">
            <slot :data="props.row" name="table_rows"></slot>
        </q-tr>
        
    </q-table>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="tbl_pagination.page"
        :max="tb_length"
        :direction-links="true"      
        :boundary-links="true"
      >
      </q-pagination>
    </div>
  </div>
</template>

<script>
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn)
{
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default 
{
  name: 'UQTable',
  props: {
    tbl_title:      {type: String, default: ''},
    tbl_data:       {type: Array, default: []},
    tbl_columns:    {type: Array, default: []},
  },
  data:() =>(
  {
      is_loading: false,
      tbl_pagination  : {
        rowsPerPage: 5, page: 1,
      },
      filter          : ''
  }),
  async mounted() 
  { 
  },
  computed: 
  {
      tb_length () {
          return Math.ceil(this.$props.tbl_data.length / this.tbl_pagination.rowsPerPage)
      }
  },
  methods:
  {
    exportTable () 
    {
      // naive encoding to csv format
      const content = [ this.tbl_columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.tbl_data.map(row => this.tbl_columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field],
          col.format
          )).join(','))).join('\r\n')

      const status = exportFile('Transactions.csv', content, 'text/csv')

      if (status !== true) 
      {
        // this.$q.notify(
        // {
        //   message: 'Browser denied file download...',
        //   color: 'negative',
        //   icon: 'warning'
        // })
        this.$q.notify({
            message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Browser denied file download...</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
      }
    },

    async download()
    {
      this.$emit('download');
    }

  }
}
</script>

<style scoped>
q-tr:nth-child(even) {
  background-color: #3498db14;
}
</style>