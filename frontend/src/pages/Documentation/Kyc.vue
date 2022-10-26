<template>
  <div class="documentation">
    <!-- markdown -->
    <q-markdown >
    Uniq KYC Form
    ===

    </q-markdown>
    <!-- /markdown -->

    <div class="component q-ma-lg">
      <div class="form-container">
        <!-- <u-q-registration @success="success()"></u-q-registration> -->
        <u-q-k-y-c @success="success()"></u-q-k-y-c>
      </div>
    </div>

    <!-- markdown -->
    <q-markdown>
      The __code above__ can be `bla blab abla`
      ``` html
      {{ code }}
      ```
    </q-markdown>
    <!-- /markdown -->
  </div>
</template>

<script>
import UQKYC from "../../components/Kyc/UQKYC";

export default {
  data: () => ({
    code: `<div>hellworld</div><div></div>`
  }),
  components: { UQKYC },
  mounted() {},
  methods: {
    success() {
      this.$q.dialog({
        title: `KYC  Successful!`,
        message: "The account has been verified!"
      });
    }
  }
};
</script>
