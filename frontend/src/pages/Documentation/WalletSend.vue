<template>
<div class="documentation">
<!-- markdown -->
<q-markdown>
Send
===
</q-markdown>
<!-- /markdown -->

<div v-if="$token" class="component q-ma-lg">
<div class="form-container">
<!-- View Options Button -->
<div class="text-center q-mb-lg">
<q-btn @click="is_view_option = !is_view_option" unelevated class="full-width">Toggle View</q-btn>
</div>
<div v-if="is_view_option == false">
<u-q-wallet-send></u-q-wallet-send>
</div>
<div v-else>
<u-q-wallet-view-options></u-q-wallet-view-options>
</div>
</div>
</div>

<!-- markdown -->
<q-markdown>
This __component__ is for `Send`
``` html
{{ code }}
```
</q-markdown>
<!-- /markdown -->
</div>
</template>

<script>
import UQWalletSend from "../../components/UQWalletSend";
import UQWalletViewOptions from "../../components/UQWalletViewOptions";

export default {
  data: () => ({
    is_view_option: false,
    code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-wallet-send></u-q-wallet-send>
    </div>
</div>`
  }),

  components: {
    UQWalletSend,
    UQWalletViewOptions
  },

  mounted() {},

  methods: {}
};
</script>
