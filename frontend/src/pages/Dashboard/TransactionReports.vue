<template>
  <div>
    <!-- <u-q-wallet-view-options></u-q-wallet-view-options> -->
    <div class="container-reports">
      <div class="add-funds">

        <q-card class="border-reports">
       
          <u-q-transaction-reports></u-q-transaction-reports>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import UQTransactionReports from "../../components/UQTransactionReports";

export default {
  data: () => ({
    currency: 'USD'
  }),

  components: {
    UQTransactionReports,
  },
  created()
  {
    this.currency = this.$route.params.currency;
  }
};
</script>
<style>
.container-reports {
  padding: 0 300px;
}
.border-reports
{
  border-radius: 30px;
  border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
</style>
<style>
@media (max-width: 1023px) {
  .container-deposit {
    padding: 30px 20px;
  }
}
  @media (max-width: 999px) {
    .container-reports {
    padding: 0 200px;
  }
}
  @media (max-width: 835px) {
    .container-reports {
    padding: 0 100px;
  }
}
@media (max-width: 559px) {
    .container-reports {
    padding: 0 10px;
  }
}
</style>

