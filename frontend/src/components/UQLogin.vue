<template>
  <div>
    <!-- content -->
    <div class="content text-left">
      <q-form v-if="!$user_info && r === null" @submit="findUser()" @reset="onReset()">
        <div class="field">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              v-model="form_data.email"
              label="E-mail"
              outlined
              :rules="[val => !!val || '* Field is required' , 
                        val => val.includes('@') && val.includes('.com') || 'Please input a valid e-mail', ]"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="field q-mt-sm">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              v-model="form_data.password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              outlined
              :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 17 || 'Password must not exceed 16 characters',
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
        <q-btn
          style="float: right; cursor: pointer; margin-bottom: 10px;"
          to="/forgot"
          flat
          no-caps
          @click="$router.replace('../Documentation/forgot_password')"
        >Forgot Password?</q-btn>
        <div class="q-mt-md">
          <q-btn
            type="submit"
            style="background: #34548b; color: white;"
            glossy
            unelevated
            class="full-width"
          >Login</q-btn>
        </div>
      </q-form>

      <div
        class="text-center"
        v-else-if="!$user_info && r"
        style="margin-top: 10px; text-align: justify;"
      >
        <p class="field q-mt-md">We sent a One Time Password to your email!</p>
        <p class="field">
          If you cannot see the email in your inbox,
          make sure to check your Spam folder.
        </p>
        <br />
        <div class="field">
          <div>
            <q-input
              v-model="form_data.code"
              placeholder="Enter One Time Password here"
              outlined
              :rules="[val => !!val || '* Field is required' ,]"
            >
              <template v-slot:prepend>
                <q-icon name="verified_user" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm text-center" style="padding-top: 20px; margin-left: -11px">
          <q-btn
            type="button"
            style="background: #34548b; color: white; width: 100%;"
            glossy
            unelevated
            @click="validateOTP()"
          >Verify</q-btn>
          <q-btn type="button" style="width: 100%;" unelevated @click="resend()">Resend E-mail</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  postLoginUser,
  postValidateLogin,
  postGetKyc,
} from "../references/url";

export default {
  data: () => ({
    form_data: {
      email: "",
      password: "",
      code: "",
    },
    r: null,
    isPwd: true,
    // alert: false
  }),
  methods: {
    async findUser() {
      this.$q.loading.show();
      let res = await this.$_post(postLoginUser, this.form_data);
      this.$q.loading.hide();
      if (res.status == 200) {
        this.r = res;
        this.$emit("otp", {
          res: res,
          is_sign_up: false,
        });
      }
    },
    async getKycByUserId(user_id) {
      let res = await this.$_post(postGetKyc, { user_id });
      console.log(res);
      return res.data;
    },
    async resend() {
      this.$q.loading.show();
      let res = await this.$_post(postLoginUser, this.form_data);
      this.$q.loading.hide();

      if (res.status == 200) {
        this.r = res.data;
        this.$q.notify({
          message:
            '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>A new One Time Password has been sent.</div>',
          position: "top",
          color: "white",
          html: true,
        });
      }
    },
    async logout() 
    {
      this.r = null;
      this.form_data.email = "";
      this.form_data.password = "";
      this.form_data.code = "";
      this.$_logout();
    },
    async validateOTP() 
    {
      this.$q.loading.show();
      let res = await this.$_post(postValidateLogin, this.form_data);
      this.$q.loading.hide();
      console.log(res)
      if (res.status == 200) {
        sessionStorage.setItem("auth", JSON.stringify(res.data));
        sessionStorage.setItem("token", res.data.token);
        this.$store.commit("user/updateUser", res.data);
        this.$router.push({ path: "/home/dashboard" });
      }
    },
  },
};
</script>
<style>
.header-banner {
  margin: 20px 0 50px 0;
}
.banner-info {
  background-color: rgb(225, 201, 85);
  border: 1px solid white;
}
.know-more {
  color: blue;
}
.container-proceed {
  padding: 0px 16px;
  margin-top: 10px;
}
.container-cancel {
  padding: 0px 16px;
}
.btn-proceed {
  background-color: #2f4c7e;
  color: white;
  padding: 3px 50px;
  font-size: 18px;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1px;
}

.btn-cancel {
  font-size: 16px;
  color: #2f4c7e;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1px;
}

.kyc-icons {
  width: 70px;
  height: 70px;
}

.header-kyc {
  color: #828282;
}
.header-kyc-2 {
  color: #828282;
  padding-bottom: 0;
}
.header-kyc-3 {
  color: #828282;
  padding-top: 0;
}
.header-kyc-3-text {
  padding: 0 30px;
  font-weight: 500;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}

.kyc-p {
  padding-bottom: 0;
  font-weight: 500;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}
.kyc-welcome {
  font-size: 30px;
  padding-top: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: bolder;
}
.kyc-container {
  padding: 0 70px;
}
.vector {
  position: absolute;
  width: 300px;
  height: 300px;
  left: 20px;
  top: 290px;
}
.vector-2 {
  position: absolute;
  width: 300px;
  height: 300px;
  right: 20px;
  bottom: 290px;
}

/* @media (max-width: 750px) {
  .kyc-container {
    padding: 0 0;
  }
  .vector {
    display: none;
  }
  .vector-2 {
    display: none;
  }
} */

@media (max-width: 853px) {
  .header-kyc-3-text {
    padding: 10px 0;
  }
  .vector {
    display: none;
  }
  .vector-2 {
    display: none;
  }
}
@media (max-width: 1024px) {
  .vector {
    display: none;
  }
  .vector-2 {
    display: none;
  }
}
</style>

