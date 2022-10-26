<template>
  <div>
    <h5>PAUL</h5>
  </div>
</template>

<script>
import UQDashboard from "../../components/UQDashboard";
import UQWalletViewOptions from "../../components/UQWalletViewOptions";
import UQWalletReceive from "../../components/UQWalletReceive";
import UQWalletAddFundsHistory from "../../components/UQWalletAddFundsHistory";

export default {
  data: () => ({
    lorem:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, quip ex ea commodo consequat.",
    value_transactions: 10,
    value_verfied_client: 35,
    value_users: 20,
    value: 81,
    is_view_option: false,
    slide: 1,
    autoplay: true,
  }),

  components: {
    UQDashboard,
    UQWalletViewOptions,
    UQWalletReceive,
    UQWalletAddFundsHistory,
  },
};
</script>
<style>
.container-admin-dashboard {
  padding: 20px 80px;
}
#first-option {
  margin-top: 30px;
}
#second-option {
  margin-top: 30px;
}
</style>

<style>
@media (max-width: 1023px) {
  .container-dashboard {
    padding: 10px 20px;
  }
  #first-option {
    padding: 0 10px;
  }
  #add-fund-history {
    padding: 0 10px;
    margin-top: 20px;
    margin-left: 0;
  }
  #second-option {
    padding: 0 10px;
  }
  div #carousel {
    margin-top: 20px;
  }
}
</style>