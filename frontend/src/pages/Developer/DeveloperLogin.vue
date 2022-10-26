<template>
  <div class="documentation">
    <!-- markdown -->
    <q-markdown>
      Developer Login
      ===
    </q-markdown>
    <!-- /markdown -->

    <div class="component q-ma-lg">
      <div class="form-container">
        <u-q-developer-login></u-q-developer-login>
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
import UQDeveloperLogin from "../../components/Developer/UQDeveloperLogin";

export default {
  data: () => ({
    code: `<div>hellworld</div><div></div>`,
  }),
  components: { UQDeveloperLogin },
  mounted() {
    // alert('sjdjg')
  },
  methods: {},
};
</script>