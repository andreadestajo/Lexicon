<template>
  <!-- content -->
  <div class="content text-left">
    <q-form v-if="!res" @submit="findUser()">
      <div class="flex flex-center">
        <img style="width: 70px" src="../../public/icons/lexicon07.png" />
      </div>
      <div class="flex flex-center q-mb-lg">
        <img style="width: 230px" src="../../public/icons/lexicon08.png" />
      </div>
      <div class="field text-center">
        <p style="font-size: 20px; font-weight: bold;">Reset Password</p>
        <p>Enter the email you use for Lexicon Bank and we will send you instructions to reset your password</p>
      </div>
      <div class="field q-mt-lg">
        <div>
          <q-input
            color="accent"
            type="email"
            v-model="form_data.email"
            label="Email"
            outlined
            :rules="[val => !!val || '* Field is required' , val => val.includes('@') && val.includes('.com') || 'Please input a valid e-mail', ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="field text-center">
        <vue-recaptcha
          :loadRecaptchaScript="true"
          sitekey="6Ld7lskZAAAAAEJ0EGQpL-JKJ8uPu19fy3w2Ar5H"
          @verify="validate()"
        ></vue-recaptcha>
      </div>
      <div class="q-mt-lg">
        <q-btn type="submit" color="accent" unelevated class="full-width">Reset Password</q-btn>
      </div>
    </q-form>
    <div class="text-center" v-else>
      <i class="fas fa-envelope" style="font-size: 70px;"></i>
      <!-- <i class="far fa-thumbs-up" style="font-size: 70px;"></i> -->
      <p class="field q-mt-md" style="font-weight: bold;font-size:20px;">Check your email!</p>
      <p class="field text-center">We just sent you an email with a link to reset your password.</p>
    </div>
  </div>
</template>

<script>
import { postForgotPassword } from "../references/url";
import VueRecaptcha from "vue-recaptcha";

export default {
  data: () => ({
    form_data: {
      email: "",
      isValidCaptcha: false,
    },
    res: null,
  }),
  mounted() {},
  components: { VueRecaptcha },
  methods: {
    async findUser() {
      if (this.form_data.isValidCaptcha == false) {
        // this.$q.notify({
        //   type: `negative`,
        //   message: "Please select captcha!",
        //   position: "bottom-left",
        //   actions: [
        //     {
        //       label: "Dismiss",
        //       color: "white",
        //       handler: () => {
        //         /* ... */
        //       }
        //     }
        //   ]
        // });
        this.$q.notify({
          message:
            '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Please select captcha."</div>',
          position: "top",
          color: "white",
          html: true,
        });
      } else {
        this.$q.loading.show();
        let res = await this.$_post(postForgotPassword, this.form_data);
        this.$q.loading.hide();

        if (res) {
          this.res = res.data;
        }
      }
    },
    async validate() {
      this.form_data.isValidCaptcha = true;
    },
  },
};
</script>