=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <q-table
      class="font-monseratt text-weight-bold"
      :title="tbl_title"
      row-key="name"
      :data="tbl_data"
      :loading="is_loading"
      :columns="tbl_columns"
      :pagination.sync="tbl_pagination"
      :filter="filter"
      color="white"
    >
      <template v-slot:top-right>
        <slot name="btn" />
        <q-input
          class="search-bar"
          rounded
          standout
          bg-color="white"
          color="white"
          label-color="black"
          input-class="text-black"
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <q-icon slot="prepend" style="color:black" name="search" />
        </q-input>
      </template>
      <!-- <template v-slot:pagination="scope">
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="firstPage(scope)"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="prevPage(scope)"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="nextPage(scope)"
        />

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="lastPage(scope)"
        />
      </template> -->
      <q-tr slot="body" slot-scope="props">
        <slot :data="props.row" name="table_rows"></slot>
      </q-tr>
    </q-table>
    <div class="q-pa-lg flex flex-center paginate" v-if="pgntn_is_show">
      <q-pagination
        v-model="tbl_pagination.page"
        :max="tb_length"
        :max-pages="6"
        behavior="menu"
        :direction-links="true"
        :boundary-links="true"
        :boundary-numbers="true"
      ></q-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "UQTable",
  props: {
    tbl_title: { type: String, default: "" },
    tbl_data: { type: Array, default: [] },
    tbl_columns: { type: Array, default: [] },
    pgntn_is_show: { type: Boolean, default: false },
    btn_is_show: { type: Boolean, default: false },
  },
  data: () => ({
    is_loading: false,
    tbl_pagination: {
      rowsPerPage: 5,
      page: 1,
    },
    filter: "",
  }),
  async mounted() {},
  computed: {
    tb_length() {
      if (this.tbl_pagination.rowsPerPage != 0) {
        return Math.ceil(
          this.$props.tbl_data.length / this.tbl_pagination.rowsPerPage
        );
      } else {
        return 1;
      }
    },
    methods: {
      firstPage(scope) {
        scope.firstPage();
        this.$emit("firstPage");
      },
      nextPage(scope) {
        scope.nextPage();
        console.log('test')
        this.$emit("nextPage");
      },
      prevPage(scope) {
        scope.prevPage();
        this.$emit("prevPage");
      },
      lastPage(scope) {
        scope.lastPage();
        this.$emit("lastPage");
      },
    },
  },
};
</script>


<style>
tr:nth-child(even) {
  background-color: #e6e6e6 !important;
}
.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  background-color: #2f4c7e !important;
  color: white;
}

.search-bar {
  width: 51px;
  transition: 0.5s;
}
.search-bar:hover {
  width: 150px;
}

.search-bar:focus-within {
  width: 150px;
}
</style>