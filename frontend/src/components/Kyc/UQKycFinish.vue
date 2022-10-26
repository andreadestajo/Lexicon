<template>
  <div>
    <div class="text-center">
      <!-- <i class="fas fa-check i-thankyou"></i> -->
      <!-- <h4 class="h4-thankyou">Thank You!</h4> -->
      <p class="p-thankyou">You have succesfuly finished your registration!</p>
      <p class="p-thankyou">
        We received your registration and your documents are being reviewed, please give us 2 to 3days to examine your external documents.
        Please check on your Email from time to time to view the progress of your registration.
      </p>

      <p class="p-thankyou">
        If you have any questions, feel free to contact us:
        <strong>account@lexiconbank.holdings / +447403488938</strong>
      </p>
      <!-- <p class="p-telegram">
        <i class="fas fa-location-arrow"></i>Join Us in Telegram
      </p>-->
      <q-btn label="Continue" class="btn-thankyou" rounded to="/home/dashboard" @click="alert = true" />
    </div>
  </div>
</template>

<script>
export default {
  name: "UQKycFinish",
  props: {},
  components: {},
  data: () => ({}),
  async mounted() {},
  methods: {
    async getUserKycByUserId(user_id) {
      let res = await this.$_post(postGetKyc, { user_id });
      return res.data.level;
    },
    async updateLevel(value) {
      this.$q.loading.show();
      this.user_kyc_level = value;
      this.$q.loading.hide();
    },
    success_kyc_level2_1() {
      this.$q.dialog({
        title: `KYC Level 2.1 Done!`,
        message: "Congratulations!"
      });
    },
    success_kyc_level2_2() {
      this.$q.dialog({
        title: `KYC Level 2.2 Done!`,
        message: "Congratulations!"
      });
    },
    success_kyc_level3() {
      this.$q.dialog({
        title: `KYC Level 3 Done!`,
        message: "Congratulations!"
      });
    }
  }
};
</script>
<style>
.i-thankyou {
  background: rgb(91, 192, 222);
  border-radius: 50%;
  color: white;
  font-size: 40px;
  padding: 10px;
}
.h4-thankyou {
  color: #2f4c7e;
  text-align: center;
  font-weight: bolder;
  margin-bottom: 50px;
  margin-top: 20px;
}
.p-thankyou {
  padding: 0 20px;
  font-family: "Raleway", sans-serif;
}
i.fa-location-arrow {
  color: #2f4c7e;
  font-size: 20px;
  border-radius: 50%;
  border: 1px solid #2f4c7e;
  margin-right: 5px;
  padding: 5px;
}
.btn-thankyou {
  background-color: #2f4c7e;
  color: white;
  margin-top: 50px;
  padding: 0 20px;
  font-size: 20px;
}
.p-telegram {
  color: skyblue;
}
</style>