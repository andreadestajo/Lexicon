<template>
  <div class="text-center">
    <div class="wire-trns">
      <u-q-wallet-send-external></u-q-wallet-send-external>
    </div>
  </div>
</template>

<script>
import UQWalletSendExternal from "../../components/UQWalletSendExternal";

export default {
  data: () => ({}),

  components: {
    UQWalletSendExternal,
  },

  async mounted() {},

  methods: {},
};
</script>

<style>
.wire-trns {
  padding: 15px 310px;
}
</style>

<style>
@media (max-width: 1066px) {
  .wire-trns {
    padding: 15px 200px;
  }
}
@media (max-width: 1042px) {
  .wire-trns {
    padding: 15px 200px;
  }
}

@media (max-width: 968px) {
  .wire-trns {
    padding: 15px 200px;
  }
}
@media (max-width: 866px) {
  .wire-trns {
    padding: 15px 100px;
  }
}
@media (max-width: 815px) {
  .wire-trns {
    padding: 15px 150px;
  }
}
@media (max-width: 728px) {
  .wire-trns {
    padding: 15px 100px;
  }
}
@media (max-width: 628px) {
  .wire-trns {
    padding: 15px 60px;
  }
}
@media (max-width: 545px) {
  .wire-trns {
    padding: 15px 20px;
  }
}
</style>