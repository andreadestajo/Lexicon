<template>
  <div>
    <!-- progress bar -->
    <div class="proccess-info-container">
      <h6 class="info-h6">
        <div v-if="step == 1">
          <img
            src="../../../public/kyc-icons/personal-information.png"
            alt="icons"
            class="kyc-icon"
          />
        </div>
        <div v-if="step == 2">
          <img src="../../../public/kyc-icons/addressinfo.png" alt="icons" class="kyc-icon" />
        </div>
        <div v-if="step == 3">
          <img
            src="../../../public/kyc-icons/personal-information.png"
            alt="icons"
            class="kyc-icon"
          />
        </div>
        <div v-if="step == 4">
          <img src="../../../public/kyc-icons/selfie.png" alt="icons" class="kyc-icon" />
        </div>
        <div v-if="step == 5">
          <img src="../../../public/kyc-icons/security-question.png" alt="icons" class="kyc-icon" />
        </div>
        <div v-if="step == 6">
          <img src="../../../public/kyc-icons/flag.png" alt="icons" class="kyc-icon-flag" />
        </div>
        <!-- <div v-if="step == 6">
          <img src="../../pages/kyc-icons/finish.png" alt="icons" class="kyc-icon" />
        </div>-->

        <div class="title-kyc">{{kyc_titles[step - 1].title}}</div>
        <!-- <i :class="kyc_titles[step - 1].icon"></i> -->
      </h6>
    </div>

    <div class="progress-container">
      <p for="steps" class="text-center" style="color: #2f4c7e;">{{ step }} / {{ steps_length }}</p>
      <q-linear-progress rounded size="13px" :value="progress" class="q-mt-sm progress-bar" />
    </div>

    <div v-if="step == 0">
      <u-q-kyc-landing @update_step="update_step($event)" />
    </div>
    <div v-if="step == 1">
      <u-q-kyc-personal-info @update_step="update_step($event)" />
    </div>
    <div v-if="step == 2">
      <u-q-kyc-address-info @update_step="update_step($event)" />
    </div>
    <div v-if="step == 3">
      <u-q-kyc-id @update_step="update_step($event)" />
    </div>
    <div v-if="step == 4">
      <u-q-kyc-selfie @update_step="update_step($event)" />
    </div>
    <div v-if="step == 5">
      <u-q-kyc-security-question @update_step="update_step($event)" />
    </div>
    <div v-if="step == 6">
      <u-q-kyc-finish />
    </div>
  </div>
</template>

<script>
import UQKycPersonalInfo from "./UQKycPersonalInfo";
import UQKycAddressInfo from "./UQKycAddressInfo";
import UQKycId from "./UQKycId";
import UQKycSecurityQuestion from "./UQKycSecurityQuestion";
import UQKycSelfie from "./UQKycSelfie";
import UQKycFinish from "./UQKycFinish";
import { postKycUser, postGetKyc } from "../../references/url";
import kyc_titles from "../../references/kyc_titles";
import UQKycLanding from "./UQKycLanding";

export default {
  components: {
    UQKycPersonalInfo,
    UQKycAddressInfo,
    UQKycId,
    UQKycSecurityQuestion,
    UQKycSelfie,
    UQKycFinish,
    UQKycLanding
  },
  data: () => ({
    kyc_titles,
    step: null,
    steps_length: 6
  }),
  async mounted() {
    this.$q.loading.show();
    if (this.$user_info) {
      let kyc_info = await this.getKycByUserId(this.$user_info._id);
      console.log(kyc_info)
      this.step = kyc_info.step;
    }
    this.$q.loading.hide();
  },
  computed: {
    progress() {
      return (1 / this.steps_length) * this.step;
    }
  },
  methods: {
    async getKycByUserId(user_id) {
      console.log('user_id')
      let res = await this.$_post(postGetKyc, { user_id });
      console.log(user_id)
      return res.data;
    },

    async update_step(value) {
      this.$q.loading.show();
      if (value == 1) {
        this.step++;
      } else {
        this.step--;
      }
      // window.location.reload();
      window.scrollTo(0, 0);

      this.$q.loading.hide();
    },
  }
};
</script>
<style>
.progress-bar {
  color: #2f4c7e;
  border: 1px solid black;
  border-radius: 30px;
}

/* change padding for documentation */
.progress-container {
  padding: 20px 100px;
}
/* ---------- */

.info-h6 {
  color: #2f4c7e;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bolder;
}
.kyc-icon {
  width: 110px;
  height: 110px;
}
.kyc-icon-flag {
  width: 210px;
  height: 140px;
}
.title-kyc {
  font-size: 26px;
  font-family: "Montserrat", sans-serif;
}
@media (max-width: 720px) {
  .progress-container {
    padding: 20px 30px;
  }
}

@media (min-width: 1024px) {
  .progress-container {
    padding: 20px 30px;
  }
}
</style>



<style lang="scss">
html {
  scroll-behavior: smooth;
}
</style>
