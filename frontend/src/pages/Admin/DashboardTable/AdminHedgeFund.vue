<template>
  <div class="admin-table">
    <div class="component q-ma-lg">
      <div class="form-container">
        <q-card>
          <u-q-admin-hedge-fund></u-q-admin-hedge-fund>
        </q-card>
      </div>
    </div>
  </div>
</template>


<script>
import UQAdminHedgeFund from "../../../components/Admin/UQAdminHedgeFund";

export default {
  components: {
    UQAdminHedgeFund,
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