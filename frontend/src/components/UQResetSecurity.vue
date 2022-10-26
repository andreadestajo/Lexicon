<template>
  <div class="q-pa-md">
    <!-- Account Lock Form OTP -->
    <div class="text-center">
      <div v-if="status == 'success'">
        <div class="q-my-lg">
          <span style="font-size: 20px; font-weight: 400">Reset security question and answer</span>
        </div>

        <q-form @submit="resetSecurityQA()">
          <div>
            <q-select
              filled
              v-model="form_data.security_question"
              dense
              :options="questions_list"
              class="q-mt-sm"
              behaviour="menu"
            />
            <q-input
              v-model="form_data.personalized_question"
              v-if="form_data.security_question == '(Personalize your own question)'"
              type="text"
              outlined
              dense
              label="New security question"
              :rules="[val => !!val || '* Field is required']"
              class="padding q-mt-md"
            />
            <q-input
              v-model="form_data.security_answer"
              type="text"
              outlined
              dense
              label="New security answer"
              :rules="[val => !!val || '* Field is required']"
              class="q-mt-md"
            />
          </div>
          <div class="q-mt-md">
            <q-btn type="submit" color="accent" unelevated class="full-width">Submit</q-btn>
          </div>
        </q-form>
      </div>

      <div class="text-center" v-if="status == 'error'">
        <i class="far fa-frown" style="font-size: 70px;"></i>
        <p
          class="field q-mt-md"
          style="font-weight: bold;font-size:20px;"
        >Security reset link has expired</p>
      </div>

    </div>
  </div>
</template>

<script>
import {
  postCheckIfExpired,
  postResetSecurity
} from "../references/url";
import questions from "../references/questions";

export default {
  data() {
    return {
      form_data: {
        otp: "",
        email: "",
        personalized_question: "",
        security_question: "Select new security question",
        security_answer: "",
        is_account_locked: false
      },
      questions_list: questions,
      status: ""
    };
  },

  mounted() {
    this.$q.loading.show();
    this.getDataFromRoute();
    this.isUrlExpired();
  },

  methods: {
    async getDataFromRoute() {
      this.form_data.otp   = this.$route.query.code;
      this.form_data.email = this.$route.query.email;
      console.log(this.$route.query.code)
    },

    async isUrlExpired() {
      let res = await this.$_post(postCheckIfExpired, { code: this.form_data.otp, email: this.form_data.email });

      if (res.data.status === "success") 
      {
        this.$q.loading.hide();
        this.status = res.data.status;
      } else if (res.data.status === "error") {
        this.$q.loading.hide();
        this.status = res.data.status;
      }
    },

    async resetSecurityQA()
    {
      this.$q.loading.show();
      let res = await this.$_post(postResetSecurity, this.form_data);
      this.$q.loading.hide();

      if(res.status != undefined)
      {
        this.$_logout();
        window.location.href = 'https://enabler.link/lexicon/#/login';
      }
    }
  },
};
</script>
