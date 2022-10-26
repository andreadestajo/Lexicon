<template>
  <div class="text-center">
    <div class="history-cont">
      <u-q-wallet-history></u-q-wallet-history>
    </div>
  </div>
</template>

<script>
import UQWalletHistory from "../../components/UQWalletHistory";

export default {
  data: () => ({
    // conversion: {},
    // tab: '',
    // decimal: 0,
    // currency_balance: 0,
  }),

  components: {
    UQWalletHistory,
  },

  async mounted() {
    await this.getCurrentCurrency();
  },

  methods: {},
};
</script>

<style>
.history-cont {
  padding: 15px 310px;
}
</style>

<style>
@media (max-width: 1272px) {
  .history-cont {
    padding: 15px 210px;
  }
}
@media (max-width: 1072px) {
  .history-cont {
    padding: 15px 110px;
  }
}
@media (max-width: 668px) {
  .history-cont {
    padding: 15px 30px;
  }
}
</style>