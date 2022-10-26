<template>
  <div>
    <!-- content -->
    <div class="content text-left">
      <q-form v-if="url_data.code" @submit="updatePassword()">
        <div class="field text-center">
          <p style="font-size: 20px; font-weight: bold;">Enter New Desired Password</p>
        </div>
        <div class="field">
          <div>
            <q-input
              color="accent"
              v-model="form_data.new_password"
              :type="isPwd ? 'password' : 'text'"
              label="New Password"
              outlined
              :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 16 || 'Password must not exceed 16 characters',
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
          </div>
        </div>

        <div class="field q-mt-md">
          <div>
            <q-input
              v-model="form_data.confirm_new_password"
              :type="isConfirmPwd ? 'password' : 'text'"
              label="Confirm Password"
              outlined
              :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 16 || 'Password must not exceed 16 characters',
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
          </div>
        </div>

        <div class="q-mt-lg">
          <q-btn type="submit" color="accent" unelevated class="full-width">Reset Password</q-btn>
        </div>
      </q-form>

      <div class="text-center" v-else>
        <i class="far fa-frown" style="font-size: 70px;"></i>
        <p
          class="field q-mt-md"
          style="font-weight: bold;font-size:20px;"
        >Password Reset Link has expired</p>
      </div>
    </div>
  </div>
</template>

<script>
import { postCheckIfExpired, postUpdatePassword } from "../references/url";

export default {
  data: () => ({
    form_data: {
      new_password: "",
      confirm_new_password: "",
    },
    url_data: {
      code: "",
      email: "",
    },
    isPwd: true,
    isConfirmPwd: true,
  }),
  mounted() {
    this.$q.loading.show();
    this.getDataFromRoute();
    this.isUrlExpired();
  },
  methods: {
    async getDataFromRoute() {
      this.url_data.code = this.$route.query.code;
      this.url_data.email = this.$route.query.email;
      console.log(this.url_data);
    },
    async isUrlExpired() {
      let res = await this.$_post(postCheckIfExpired, this.url_data);
      if (res.data.status === "success") {
        console.log(res.data.status);
        console.log(res.data.data.email);
        console.log(res.data.data.otp);
        this.$q.loading.hide();
      } else if (res.data.status === "error") {
        this.$q.loading.hide();
        this.url_data = res.data;
      }
    },
    async updatePassword() {
      this.$q.loading.show();
      this.form_data.email = this.url_data.email;
      let res = await this.$_post(postUpdatePassword, this.form_data);
      this.$q.loading.hide();

      if (res) {
        this.$emit("success", res);
      }
    },
  },
};
</script>
