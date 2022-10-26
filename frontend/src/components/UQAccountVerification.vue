=============================
Title : User Verification Account
Author: Andrea Antonio Destajo
Contributor:
=============================
<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <div class="row">
              <h5 class="text-h5 q-my-md">Verify your Account.</h5>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <div class="col-4">
                <div>
                  <q-input
                    disable
                    type="Email"
                    outlined
                    color="accent"
                    square
                    v-model="user_data.email"
                    label="Email"
                    required
                  />
                </div>
              </div>

              <div class="col-4">
                <div>
                  <q-input
                    color="accent"
                    v-model="user_data.password"
                    :type="isPwd ? 'password' : 'text'"
                    label="Password"
                    outlined
                    :rules="[
                              val => !!val || '* Field is required',
                              val => val.length > 7 || 'Password must be more than 8 characters',
                              val => val.length < 17 || 'Password must not exceed 16 characters',
                              ]"
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

              <div class="col-4">
                <div>
                  <q-input
                    color="accent"
                    v-model="user_data.confirm_password"
                    :type="isCPwd ? 'password' : 'text'"
                    label="Confirm Password"
                    outlined
                    :rules="[
                                val => !!val || '* Field is required',
                                val => val.length > 7 || 'Password must be more than 8 characters',
                                val => val.length < 17 || 'Password must not exceed 16 characters',
                                ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isCPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isCPwd = !isCPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <div>
                <q-toggle
                  v-model="condition"
                  checked-icon="check"
                  color="accent"
                  label="I accept the terms and conditions"
                  unchecked-icon="clear"
                />
              </div>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="accent"
              size="lg"
              class="full-width"
              label="Proceed to Login"
              @click="setUserPass()"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <!-- Warning button -->
    <q-dialog v-model="warning" persistent>
      <q-card class="q-pa-lg">
        <q-card-section class="text-center q-pb-none">
          <q-avatar icon="question_answer" color="accent" text-color="white" />
          <div class="q-mt-md">{{message}}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-center row justify-around">
            <div class="col-5">
              <q-btn v-close-popup>Close</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- approve button  -->
  </q-page>
</template>

<script>
import countries from "../references/countries";
import { setUserPass, postCheckIfExpired, getUserByID } from "../references/url";

export default {
  data: () => ({
    condition: false,
    warning: false,
    isPwd: true,
    isCPwd: true,
    message: "",
    userInfo:[],
    url_data: {
      email: "",
      id:"",
    },

    user_data: {
      email: "",
      confirm_password: "",
      password: "",
    },
  }),
  async mounted() {
    this.getDataFromRoute();
    this.getUserByID() ;
  },

  methods: {

    async getUserByID() {
      this.$q.loading.show();
      let res = await this.$_post(getUserByID, this.url_data);
      this.$q.loading.hide();

      if (res) {
        
        this.userInfo = res.data;

      }
    },

    async getDataFromRoute() {
      this.url_data.email = this.$route.query.email;
      this.user_data.email =  this.url_data.email;
      this.url_data.id = this.$route.query.id;

    },


    async requestDemonym() {
      if (this.user_data.country === "United States") {
        this.user_data.country = "United States of America";
      }
      let res2 = await this.$_getUserCountryInfo(this.user_data.country);
      this.user_data.demonym = res2.data[0].demonym;
      this.user_data.callingCodes = "+" + res2.data[0].callingCodes[0];
    },

    async setUserPass() {
      if (this.condition !== true) {
        this.warning = true;
        this.message = "You need to accept the license and terms first.";
      } else {
        
          if(this.userInfo.password==""){
          this.$q.loading.show();
          let res = await this.$_post(setUserPass, this.user_data);
          this.$q.loading.hide();
          console.log(res.status);
          if (res.status != null) {
            this.data = res.data;
            this.$router.push({ path: "/login" });
          }
        }
        else{
        this.warning = true;
        this.message = "Your password is already been set.";          
        }
      }
    },
  },
};
</script>