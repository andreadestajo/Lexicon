<template>
  <div>
    <!-- <u-q-wallet-view-options></u-q-wallet-view-options> -->
    <div class="row justify-center container-status">
      <div class="col-12 col-md-8">
        <q-card-section>
          <q-card>
            <u-q-wallet-add-funds-history></u-q-wallet-add-funds-history>
          </q-card>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import UQWalletAddFundsHistory from "../../components/UQWalletAddFundsHistory";

export default {
  data: () => ({}),

  components: {
    UQWalletAddFundsHistory,
  },
};
</script>
<style>
.container-status {
  padding: 0px 80px;
}
</style>
<style>
@media (max-width: 1023px) {
  .container-status {
    padding: 30px 20px;
  }
}
</style>
