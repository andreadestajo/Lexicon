=========================================
Title: Design
Author: Gelo
Date: 10 Aug 2020
Contributor: Pergent
Date: 14 Sept 2020
=========================================

<template>
  <div v-if="!$user_info" class="row">
    <div class="col-12 col-md-6 responsives">
      <img class="pic-resp" id="right-image-login" src="../../../public/icons/lexicon05.png" />
      <div class="q-pa-sm height-responsive placehold" id="login-container">
        <q-form class="q-gutter-md" id="login-form">
          <q-tabs
            v-model="tab"
            indicator
            class="text-grey linee"
            active-color="accent"
            indicator-color="accent"
            align="justify"
            narrow-indicator
          >
            <q-tab name="logs">
              <p id="tabs-text">
                <b>Login</b>
              </p>
            </q-tab>
            <q-separator vertical />
            <q-tab name="sign">
              <p id="tabs-text">
                <b>Sign Up</b>
              </p>
            </q-tab>
          </q-tabs>

          <q-tab-panels v-model="tab" animated id="tabs-container" class="form">
            <q-tab-panel name="logs">
              <q-item id="tab-container-login">
                <q-item-section avatar>
                  <q-icon color="red" name="warning" />
                </q-item-section>
                <q-item-section>
                  <b>Please check that you are visiting</b>
                </q-item-section>
              </q-item>

              <q-field
                outlined
                stack-label
                color="accent"
                bg-color="white"
                :dense="dense"
                style="cursor: text;"
              >
                <template v-slot:control>
                  <div
                    class="flex-center flex self-center full-width no-outline"
                    tabindex="0"
                  >https://lexiconbank.holdings/</div>
                </template>
                <template v-slot:prepend>
                  <q-icon color="green" size="15px" name="lock" />
                  <p id="tab-text-login">Secure</p>
                  <q-separator vertical inset class="q-mx-sm" style="margin-top: 0.8px;" />
                </template>
              </q-field>
              <div>
                <br />
                <u-q-login @otp="otp($event)"></u-q-login>
              </div>
            </q-tab-panel>

            <q-tab-panel id="tab-container-register" name="sign">
              <div>
                <u-q-registration @success="success()" @otp="otp($event)"></u-q-registration>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-form>
      </div>
    </div>
    <div class="col-12 col-md-6" id="bg-landing">
      <img class="pic" style="position: fixed" src="../../../public/icons/bg.jpg" />
    </div>
  </div>
  <div v-else>
    <u-q-login></u-q-login>
  </div>
</template>

<script>
import UQLogin from "../../components/UQLogin";
import UQRegistration from "../../components/UQRegistration";

export default {
  data() {
    return {
      name: null,
      email: null,
      password: null,
      isPwd: true,
      dense: true,
      accept: false,
      is_sign_up: true,
      isLogin: true,
      tab: "logs",
    };
  },
  components: { UQLogin, UQRegistration },
  mounted() {},
  methods: {
    otp(value) {
      this.is_sign_up = value.is_sign_up;
    },
  },
};
</script>


<style scoped>
#right-image-login {
  width: 260px;
  margin-left: 40px;
  margin-top: 20px;
}
#tab-text-login {
  font-size: 15px;
  margin-top: 17px;
  color: green;
}
#tab-container-login {
  margin-left: 40px;
  margin-top: 10px;
}
#tab-container-register {
  margin-top: -30px;
  overflow: hidden;
}
#tabs-container {
  background: transparent;
  width: 100%;
  height: 100%;
}
#tabs-text {
  font-size: 20px;
}
#login-form {
  margin-top: -100px;
}
#login-container {
  width: 600px;
  padding: 100px 100px;
}
.pic {
  position: absolute;
  height: 860px;
  width: 1100px;
  margin-left: -150px;
}
.linee {
  line-height: 20px;
  margin-left: -30px;
}
.form {
  margin-left: -10px;
}
</style>

<style>
@media (max-width: 1294px) {
  .responsives {
    margin-left: -60px;
  }
}
@media (max-width: 1257px) {
  #bg-landing {
    margin-left: 700px;
    position: absolute;
  }
  .responsives {
    margin-left: -10px;
  }
}
@media (max-height: 856px) {
  .height-responsive {
    margin-top: 50px;
  }
}
@media (max-height: 780px) {
  .height-responsive {
    margin-top: 20px;
  }
  .responsives {
    margin-left: -20px;
  }
}
@media (max-width: 523px) {
  .responsives {
    margin-left: -30px;
  }
  .pic-resp {
    padding-left: 40px;
  }
}
@media (max-width: 454px) {
  .responsives {
    margin-left: -80px;
  }
  .pic-resp {
    padding-left: 60px;
  }
}
@media (max-width: 420px) {
  .responsives {
    margin-left: -75px;
  }
  .pic-resp {
    padding-left: 60px;
  }
}
@media (max-width: 414px) {
  .responsives {
    margin-left: -80px;
  }
  .pic-resp {
    padding-left: 80px;
  }
}
@media (max-width: 409px) {
  .responsives {
    margin-left: -80px;
  }
  .pic-resp {
    padding-left: 60px;
  }
}
@media (max-width: 397px) {
  .responsives {
    margin-left: -35px;
  }
  .pic-resp {
    padding-left: 50px;
  }
  .placehold {
    max-width: 500px;
  }
}
@media (max-width: 379px) {
  .responsives {
    margin-left: -45px;
  }
}
@media (max-width: 361px) {
  .responsives {
    margin-left: -55px;
  }
}
@media (max-width: 343px) {
  .responsives {
    margin-left: -65px;
  }
}
@media (max-width: 343px) {
  .responsives {
    margin-left: -70px;
  }
}
</style>
