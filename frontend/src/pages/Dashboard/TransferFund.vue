<template>
  <div class="text-center">
    <div class="transfer-fnd">
      <u-q-wallet-send></u-q-wallet-send>
    </div>
  </div>
</template>

<script>
import UQWalletSend from "../../components/UQWalletSend";

export default {
  data: () => ({}),

  components: {
    UQWalletSend,
  },

  async mounted() {},

  methods: {},
};
</script>

<style>
.transfer-fnd {
  padding: 15px 310px;
}
</style>

<style>
@media (max-width: 1302px) {
  .transfer-fnd {
    padding: 15px 250px;
  }
}
@media (max-width: 1178px) {
  .transfer-fnd {
    padding: 15px 180px;
  }
}
@media (max-width: 1024px) {
  .transfer-fnd {
    padding: 15px 100px;
  }
}
@media (max-width: 854px) {
  .transfer-fnd {
    padding: 15px 70px;
  }
}
@media (max-width: 774px) {
  .transfer-fnd {
    padding: 15px 30px;
  }
}
</style>