<template>
  <div>
    <!-- content -->
    <div class="content text-left">
      <q-form v-if="isOtp == false && isValidOtp == false" @submit="findUser()">
        <div class="field q-mt-md">
          <div>
            <q-select
              bg-color="white"
              color="accent"
              behavior="menu"
              @input="requestDemonym()"
              filled
              v-model="form_data.country"
              label="Country"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="countryOptions"
              @filter="filterFn"
              outlined
              :rules="[val => !!val || '* Field is required' ,]"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="form_data.country !== null"
                  class="cursor-pointer"
                  name="clear"
                  @click.stop="form_data.country = ''"
                />
              </template>
            </q-select>
          </div>
        </div>

        <div class="field q-mt-sm">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              v-model="form_data.full_name"
              label="Full Name"
              outlined
              :rules="[val => !!val || '* Field is required' ,]"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="field q-mt-sm">
          <div>
            <q-input
              bg-color="white"
              color="accent"
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

        <div class="field q-mt-sm">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              @input="p_len"
              v-model="form_data.password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              outlined
              :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 8 || 'Password must be more than 8 characters',
                        val => /[a-z]/.test(val) && /\d/.test(val) && /[A-Z]/.test(val),
                        ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div v-bind:class="{ show_password_length: typed }" class="lnu_container">
              <p v-bind:class="{ lovercase_valid: contains_lovercase }">Weak</p>
              <p v-bind:class="{ number_valid: contains_number }">Strong</p>
              <p v-bind:class="{ uppercase_valid: contains_uppercase }">Very Strong</p>
            </div>
          </div>
        </div>

        <div class="field q-mt-sm">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              @input="cp_len"
              v-model="form_data.confirm_password"
              :type="isConfirmPwd ? 'password' : 'text'"
              label="Confirm Password"
              outlined
              :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => /[a-z]/.test(val) && /\d/.test(val) && /[A-Z]/.test(val),
                        ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isConfirmPwd = !isConfirmPwd"
                />
              </template>
            </q-input>
            <div v-bind:class="{ show_password_length: cp_typed }" class="lnu_container">
              <p v-bind:class="{ lovercase_valid: cp_contains_lovercase }">Weak</p>
              <p v-bind:class="{ number_valid: cp_contains_number }">Strong</p>
              <p v-bind:class="{ uppercase_valid: cp_contains_uppercase }">Very Strong</p>
            </div>
          </div>
        </div>

        <div class="field">
          <q-toggle v-model="accept" color="accent" label />I accept the
          <a
            target="_blank"
            href="https://enabler.link/lexicon/#/terms_and_conditions"
          >Terms and Conditions</a>
        </div>
        <div class="q-mt-lg">
          <q-btn
            type="submit"
            style="background: #34548b; color: white;"
            glossy
            unelevated
            class="full-width"
          >Create Account</q-btn>
        </div>
      </q-form>

      <div v-else-if="isOtp == true && isValidOtp == false" style="margin-top:50px">
        <p class="field q-mt-md">
          A Verification Code has been sent to
          <b>{{ form_data.email }}</b>.
        </p>
        <p>
          Please enter the code below to verify your Email Address. If you
          cannot see the email from "Lexicon Bank" in your inbox,
          make sure to check your Spam folder.
        </p>
        <div class="field q-mt-md">
          <div>
            <q-input
              v-model="form_data.otp"
              placeholder="E-mail verification code"
              outlined
              :rules="[val => !!val || '* Field is required' ,]"
            >
              <template v-slot:prepend>
                <q-icon name="verified_user" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm text-center">
          <q-btn
            type="button"
            class="full-width"
            color="accent"
            unelevated
            @click="validateOTP()"
          >Verify</q-btn>
          <q-btn
            type="button"
            class="full-width"
            outline
            color="accent"
            unelevated
            @click="resend()"
          >Resend E-mail</q-btn>
        </div>
      </div>

      <div v-else-if="isValidOtp == true" class="text-center" style="margin-top: 40px">
        <span class="material-icons text-default" style="font-size: 60px;">verified_user</span>
        <p class="q-mt-md text-default" style="font-size: 20px; font-weight: bold;">Congratulations!</p>

        <p class="q-mt-lg" style="font-size: 16px;">
          Hi,
          <b>{{form_data.full_name}}</b>
        </p>

        <p class="q-mt-lg" style="font-size: 16px;">
          Your email address has been verified.
          <br />Please login to process your account.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { postRegistrationUser, postValidateOtp } from "../references/url";
import countries from "../references/countries";

export default {
  data: () => ({
    form_data: {
      country: "",
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      otp: "",
    },
    countryOptions: countries,
    isPwd: true,
    isConfirmPwd: true,
    isOtp: false,
    isValidOtp: false,
    accept: false,
    typed: false,
    cp_typed: false,
    contains_lovercase: false,
    contains_number: false,
    contains_uppercase: false,
    cp_contains_lovercase: false,
    cp_contains_number: false,
    cp_contains_uppercase: false,
  }),
  async mounted() {
    let res = await this.$_locateUser();
    this.form_data.country = res.data.country_name;

    if (this.form_data.country === "United States") {
      this.form_data.country = "United States of America";
    }
    let res2 = await this.$_getUserCountryInfo(this.form_data.country);
    this.form_data.currencyCode = res2.data[0].numericCode;
    this.form_data.demonym = res2.data[0].demonym;
    this.form_data.callingCodes = "+" + res2.data[0].callingCodes[0];
  },
  computed: {},
  methods: {
    async findUser() {
      if (this.accept !== true) {
        this.$q.notify({
          message:
            '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to accept the Terms and Conditions first.</div>',
          position: "top",
          color: "white",
          html: true,
        });
      } else {
        this.$q.loading.show();
        let res = await this.$_post(postRegistrationUser, this.form_data);
        this.$q.loading.hide();

        if (res.status == 200) {
          this.isOtp = res.data;
        }
      }
    },
    async validateOTP() {
      this.$q.loading.show();
      let res = await this.$_post(postValidateOtp, this.form_data);
      this.$q.loading.hide();

      if (res.status == 200) {
        // this.$emit('success', res);
        this.isValidOtp = res.data;
      }
    },
    async resend() {
      this.$q.loading.show();
      let res = await this.$_post(postRegistrationUser, this.form_data);
      this.$q.loading.hide();

      if (res.status == 200) {
        this.isOtp = res.data;
        this.$q.notify({
          message:
            '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>A new One Time Password has been sent.</div>',
          position: "top",
          color: "white",
          html: true,
        });
      }
    },
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.countryOptions = countries.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async requestDemonym() {
      if (this.form_data.country === "United States") {
        this.form_data.country = "United States of America";
      }
      let res2 = await this.$_getUserCountryInfo(this.form_data.country);
      this.form_data.currencyCode = res2.data[0].numericCode;
      this.form_data.demonym = res2.data[0].demonym;
      this.form_data.callingCodes = "+" + res2.data[0].callingCodes[0];
    },
    p_len: function () {
      if (this.form_data.password.length > 0) {
        this.typed = true;
      } else {
        this.typed = false;
      }

      this.contains_lovercase = /[a-z]/.test(this.form_data.password);
      this.contains_number = /\d/.test(this.form_data.password);
      this.contains_uppercase = /[A-Z]/.test(this.form_data.password);
    },
    cp_len: function () {
      if (this.form_data.confirm_password.length > 0) {
        this.cp_typed = true;
      } else {
        this.cp_typed = false;
      }

      this.cp_contains_lovercase = /[a-z]/.test(
        this.form_data.confirm_password
      );
      this.cp_contains_number = /\d/.test(this.form_data.confirm_password);
      this.cp_contains_uppercase = /[A-Z]/.test(
        this.form_data.confirm_password
      );
    },
  },
};
</script>
<style scoped>
.lnu_container {
  display: block;
  margin: 10px auto;
  width: 320px;
  height: auto;
  display: none;
}

.lnu_container p {
  width: 100px;
  font-size: 12px;
  text-align: center;
  background: linear-gradient(to right, #00ad7c 50%, #eee 50%);
  background-size: 201% 100%;
  background-position: right;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
}

.lovercase_valid,
.number_valid,
.uppercase_valid {
  background-position: left !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.show_password_length {
  display: flex;
}
</style>
