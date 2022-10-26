<template>
  <div class="documentation">
    <!-- markdown -->
    <q-markdown>
      Add Fund History
      ===
    </q-markdown>
    <!-- /markdown -->

    <div v-if="$token" class="component q-ma-lg">
      <div class="form-container">
        <u-q-wallet-add-funds-history></u-q-wallet-add-funds-history>
      </div>
    </div>

    <!-- markdown -->
    <q-markdown>
      This __component__ is for `Transaction History`
      ``` html
      ```
    </q-markdown>
    <!-- /markdown -->
  </div>
</template>

<script>
import UQWalletAddFundsHistory from "../../components/UQWalletAddFundsHistory";

export default {
  data: () => ({}),
  components: { UQWalletAddFundsHistory },
  mounted() {},
  methods: {}
};
</script>