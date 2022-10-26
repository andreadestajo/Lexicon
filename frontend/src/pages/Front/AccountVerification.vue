<template>
  <div class="component">
    <div class>
      <u-q-account-verification @success="success()"></u-q-account-verification>
    </div>
  </div>
</template>

<script>
import UQAccountVerification from "../../components/UQAccountVerification";

export default {
  data: () => ({}),
  components: { UQAccountVerification },
  mounted() {},
  methods: {
    success() {
      this.$q.dialog({
        title: `Registration  Successful!`,
        message: "The account has been succesfully updated!",
      });
    },
  },
};
</script>