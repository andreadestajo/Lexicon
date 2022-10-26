<template>
  <div>
    <q-form @submit="handleSubmit">
      <!-- <q-form> -->
        <p
        class="address-header-banner text-center font-header"
      >Please make sure all information below are correct before proceeding</p>
      <p
        class="personal-header-banner text-italic text-left font-header"
      >Items with an asterisk <strong style="font-size: 1.3rem;">	(&#42;)</strong> has to be filled out</p>
      <p
        class="header-banner text-center font-header"
      >To help secure your account, answer one of our security questions below, you can choose or create your own question.</p>
      <div class="field q-mt-md">
        <div>
          <q-select
            v-model="security_question"
            label="*Select a question"
            :options="questions"
            outlined
            color="accent"
            :rules="[val => !!val]"
          />
        </div>
      </div>
      <div class="field q-mt-md" v-if="security_question == '(Personalize your own question)'">
        <div>
          <q-input
            v-model="other_security_question"
            label="*Personalize your own question"
            outlined
            color="accent"
            :rules="[val => !!val]"
          ></q-input>
        </div>
      </div>
      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.security_answer"
            outlined
            color="accent"
            label="*Security Answer"
            :rules="[val => !!val]"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
      </div>

      <div class="q-mt-md">
        <q-banner inline-actions rounded class="banner-info text-white text-weight-bolder">
          <h6 class="text-weight-bolder banner-h6">
            <span class="container-info"></span>
            <i class="fas fa-info-circle"></i>Remember this answer!
          </h6>
          <p class="banner-p">
            The content indicated above will be used for future transactions.
            Don't forget your answer.
          </p>
        </q-banner>
      </div>

      <div class="q-mt-lg text-center q-save-btn q-mb-lg">
        <q-btn
          type="submit"
          class="btn-save"
          :loading="loading2"
          rounded
          unelevated
        >Save Answer</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import questions from "../../references/questions";

import {
  putUpdateKycSecurityQuestion,
  putStepDown
} from "../../references/url";

export default {
  name: "UQKycSecurityQuestion",
  props: {},
  data: () => ({
    loading2: false,
    questions,
    security_question: "",
    other_security_question: "",
    isPwd: true,
    form_data: {
      security_question: "",
      security_answer: ""
    },
    questions: questions
  }),

  mounted() {},

  methods: {
    async handleSubmit() {
      this.form_data.user_id = this.$user_info._id;

      this.form_data.security_question =
        this.security_question == "(Personalize your own question)"
          ? this.other_security_question
          : this.security_question;

      this.form_data.security_answer = this.form_data.security_answer;
      this.loading2 = true;
      let res = await this.$_put(putUpdateKycSecurityQuestion, this.form_data);

      if (res) {
        this.loading2 = false;
        this.$_update_step(1);
        window.scrollTo(0, 0);
      } else {
        this.loading2 = false;
      }

      console.log(this.form_data);
    }
  }
};
</script>
<style>
.header-banner {
  margin: 20px 0 50px 0;
}
.banner-info {
  background-color: #ffa320;
  border: 1px solid white;
}
.banner-h6 {
  margin: 0;
  font-family: "Raleway", sans-serif;
}
.banner-p {
  font-family: "Raleway", sans-serif;
}
.btn-save {
  background-color: #2f4c7e;
  color: white;
  font-size: 18px;
  padding: 0 20px;
}
.fa-info-circle {
  margin-right: 10px;
}
</style>