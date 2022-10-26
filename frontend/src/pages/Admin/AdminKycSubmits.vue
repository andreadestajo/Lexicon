<template>
  <div class="admin-table">
    <kyc-submits></kyc-submits>
  </div>
</template>


<script>
import KycSubmits from "./KycSubmits";

export default {
  components: {
    KycSubmits,
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