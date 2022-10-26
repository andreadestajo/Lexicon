

=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div class="row" id="bg-login-admin">
    <div class="col-12 responsives">
      <div class="q-pa-sm height-responsive-admin placehold">
        <q-card class="my-card admin-card">
          <q-card-section>
            <q-form class="q-gutter-md">
              <div class="text-center logo-admin">
                <img
                  style="width: 260px;  margin-top: 20px;"
                  src="../../../public/icons/lexicon05.png"
                />
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

              <q-field outlined stack-label dense style=" cursor: text;">
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

              <u-q-admin-login></u-q-admin-login>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import UQAdminLogin from "../../components/Admin/UQAdminLogin";

export default {
  data() {
    return {};
  },
  components: { UQAdminLogin },
  mounted() {},
};
</script>


<style scoped>
#bg-login-admin {
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)),
    url("../../../public/icons/lexi-buildingdesign.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100vh;
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
.admin-card {
   padding: 20px 50px; margin-top: 50px;
}
.placehold {
  padding: 20px 450px;
}
</style>

<style>
@media (max-width: 1317px) {
  .placehold {
  padding: 20px 300px !important;
}
}
@media (max-width: 430px) {
  .height-responsive-admin {
    padding: 5px 20px !important;
  }
  .admin-card {
    margin-top: 30px;
    padding: 5px 10px !important;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .height-responsive-admin {
    padding: 40px 120px !important;
  }
  .admin-card {
    padding: 30px 100px !important;
  }
}

@media (min-width: 431px) and (max-width: 767px) {
  .height-responsive-admin {
    padding: 5px 80px !important;
  }
  .admin-card {
    padding: 5px 70px !important;
  }

  /* Text responsiveness */
  @media (max-width: 567px) {
  }
}
</style>
