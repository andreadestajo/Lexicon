<template>
  <div class="documentation">
    <!-- markdown -->
    <q-markdown>
      Add Funds
      ===
    </q-markdown>
    <!-- /markdown -->

    <div v-if="$token" class="component q-ma-lg">
      <div class="form-container">
        <u-q-add-funds></u-q-add-funds>
      </div>
    </div>

    <!-- markdown -->
    <q-markdown>
      This __component__ is for `Send`
      ``` html
      ```
    </q-markdown>
    <!-- /markdown -->
  </div>
</template>

<script>
// import UQWalletSend from '../../components/UQWalletSend'
import UQAddFunds from "../../components/UQAddFundsVTwo";

export default {
  data: () => ({
    //     code: `<div class="component q-ma-lg">
    //     <div class="form-container">
    //         <u-q-wallet-send></u-q-wallet-send>
    //     </div>
    // </div>`
  }),

  components: {
    UQAddFunds
  },

  mounted() {},

  methods: {}
};
</script>
