<template>
  <div>
    <!-- <u-q-wallet-view-options></u-q-wallet-view-options> -->
    <div class="row justify-center container-status conversion">
      <div class="col-12 col-md-8">
        <q-card-section>
          <div class="my-card">
            <!-- <p>HELLO</p> -->
            <u-q-convert-currency></u-q-convert-currency>
            <!-- <u-q-wallet-add-funds-history></u-q-wallet-add-funds-history> -->
          </div>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import UQConvertCurrency from "../../components/UQConvertCurrency";

export default {
  data: () => ({}),

  components: {
    UQConvertCurrency,
  },
};
</script>
<style>
.container-status {
  padding: 30px 80px;
}
.conversion {
  padding: 0 200px;
}
</style>
<style>
@media (max-width: 1023px) {
  .container-status {
    padding: 30px 20px;
  }
}
</style>
