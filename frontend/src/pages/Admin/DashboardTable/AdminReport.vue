<template>
  <div class="admin-table">
    <q-card class="q-pa-md">
      <reports></reports>
    </q-card>
  </div>
</template>


<script>
import Reports from "../../Documentation/Reports";

export default {
  components: {
    Reports,
  },
};
</script>
<style>
@media (max-width: 1023px) {
  .admin-table {
    padding: 10px !important;
  }
}
</style>