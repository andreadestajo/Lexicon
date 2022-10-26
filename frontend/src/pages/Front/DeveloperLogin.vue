

=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 14 Sept 2020
Contributor:
=========================================

<template>
  <div class="row">
    <div class="col-12 col-md-7 responsives" id="bg-login-admin"></div>
    <div class="col-12 col-md-5">
      <div class="height-responsive-admin developer-login-container">
        <q-form class="q-gutter-md">
          <div class="text-center logo-admin">
            <img style="width: 260px;  margin-top: 20px;" src="../../../public/icons/lexicon05.png" />
          </div>
          <p
            style="font-size: 40px; border-bottom: 3px solid #2f4c7e;"
            class="text-center admin-login font-bebas"
          ></p>

          <q-item style="margin-left: 40px; margin-top: 10px; ">
            <q-item-section avatar>
              <q-icon color="red" name="warning" />
            </q-item-section>
            <q-item-section style="font-weight: bold;">Please check that you are visiting</q-item-section>
          </q-item>

          <q-field outlined stack-label dense color="accent" style="cursor: text;" bg-color="white">
            <template v-slot:control>
              <div
                class="flex-center flex self-center full-width no-outline"
                tabindex="0"
              >https://lexiconbank.holdings/</div>
            </template>
            <template v-slot:prepend>
              <q-icon color="green" size="15px" name="lock" />
              <p style="font-size: 15px; margin-top: 17px; color: green;">Secure</p>
              <q-separator vertical inset class="q-mx-sm" style="margin-top: 0.8px;" />
            </template>
          </q-field>

          <u-q-developer-login></u-q-developer-login>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import UQDeveloperLogin from "../../components/Developer/UQDeveloperLogin";

export default {
  data() {
    return {};
  },
  components: { UQDeveloperLogin },
  mounted() {},
};
</script>


<style scoped>
#bg-login-admin {
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)),
    url("../../../public/developer/bg1.jpg");
  /* background-image: url("../../../public/developer/bg1.jpg"); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100vh;
}
.developer-login-container {
  padding: 50px 80px;
}
.logo-admin {
  margin: 0px;
}
.my-card {
  -webkit-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  border-radius: 3%;
}
.admin-login {
  color: #2f4c7e;
}
.pic {
  position: absolute;
  height: 860px;
  width: 1100px;
  margin-left: -150px;
}
.linee {
  line-height: 20px;
}
.form {
  margin-left: -10px;
}
</style>

<style>
@media (max-width: 430px) {
  .height-responsive-admin {
    padding: 5px 20px !important;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .height-responsive-admin {
    padding: 40px 120px !important;
  }
}

@media (min-width: 431px) and (max-width: 767px) {
  .height-responsive-admin {
    padding: 5px 80px !important;
  }
}
</style>
