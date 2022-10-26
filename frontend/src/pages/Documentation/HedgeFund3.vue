<template>
  <div class="documentation">
    <!-- markdown -->
    <q-markdown>
      Hedge Fund
      ===
    </q-markdown>
    <!-- /markdown -->

    <div v-if="$token" class="component q-ma-lg">
      <div class="form-container">
        <!-- <u-q-manage-deposit @success="success()"></u-q-manage-deposit> -->
        <u-q-hedge-fund></u-q-hedge-fund>
      </div>
    </div>

    <!-- markdown -->
    <q-markdown>
      This __component__ is for `Manage Transactions`
      ``` html
      {{ code }}
      ```
    </q-markdown>
    <!-- /markdown -->
  </div>
</template>

<script>
import UQHedgeFund from "../../components/UQHedgeFund3";

export default {
  data: () => ({
    code: `<div class="component q-ma-lg">
    <div class="form-container">
       <u-q-hedge-fund></u-q-hedge-fund>
    </div>
</div>`,
  }),
  components: { UQHedgeFund },
  mounted() {},
  methods: {},
};
</script>