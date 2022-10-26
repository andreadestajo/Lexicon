<template>
  <div class="documentation">
    <!-- **Author: VP -->
    <!-- markdown -->
    <q-markdown>
      Admin Hedge Fund
      ===
    </q-markdown>
    <!-- /markdown -->

    <div v-if="$token" class="component q-ma-lg">
      <div class="form-container">
        <u-q-admin-hedge-fund @success="success()"></u-q-admin-hedge-fund>
      </div>
    </div>

    <!-- markdown -->
    <q-markdown>
      This __component__ is for `Conversion Frequency`
      ``` html
      {{ code }}
      ```
    </q-markdown>
    <!-- /markdown -->
  </div>
</template>

<script>
import UQAdminHedgeFund from "../../components/Admin/UQAdminHedgeFund";

export default {
  data: () => ({
    code: `<div v-if="$token" class="component q-ma-lg">
    <div class="form-container">
        <u-q-admin-hedge-fund @success="success()"></u-q-admin-hedge-fund>
    </div>
</div>
`,
  }),
  components: { UQAdminHedgeFund },
  mounted() {},
  methods: {},
};
</script>