<template>
  <div>
    <!-- <u-q-wallet-view-options></u-q-wallet-view-options> -->
    <div class="container-deposit">
      <div class="add-funds">
        <q-card-section>
          <u-q-add-funds-v-two></u-q-add-funds-v-two>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import UQAddFundsVTwo from "../../components/UQAddFundsVTwo";

export default {
  data: () => ({
    currency: 'USD'
  }),

  components: {
    UQAddFundsVTwo,
  },
  created()
  {
    this.currency = this.$route.params.currency;
  }
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

