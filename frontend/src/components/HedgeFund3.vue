<template>
  <div>
    <!-- <u-q-wallet-view-options></u-q-wallet-view-options> -->
    <div class="container-deposit">
      <div class="add-funds">
        <q-card-section>
          <u-q-hedge-fund-3></u-q-hedge-fund-3>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import UQHedgeFund3 from "../components/UQHedgeFund3";

export default {
  data: () => ({
    currency: "USD",
  }),

  components: {
    UQHedgeFund3,
  },
};
</script>
<style>
.container-deposit {
  padding: 0 300px;
}
</style>
<style>
@media (max-width: 1023px) {
  .container-deposit {
    padding: 30px 20px;
  }
}
</style>

