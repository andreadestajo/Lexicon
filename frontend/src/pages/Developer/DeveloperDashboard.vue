<template>
  <div class="row">
    <div class="col-12">
      <div class="q-pa-sm" style=" padding: 20px 450px">
        <q-card class="my-card admin-card" style=" padding: 20px 50px; ">
          <q-card-section>
            <div class="q-gutter-md">
              <div class="text-center logo-admin">
                <h6
                  class="font-bebas"
                  style="font-size: 40px; border-bottom: 3px solid #2f4c7e; padding-bottom: 10px; margin:10px 0"
                >Super Admin</h6>
              </div>
              <div>
                <div class="content text-left">
                  <q-form @submit="addSuperAdmin()">
                    <div class="field">
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
                    <div class="field">
                      <div>
                        <q-input
                          lazy-rules
                          ref="input1"
                          color="accent"
                          bg-color="white"
                          v-model="form_data.full_name"
                          label="Full Name"
                          outlined
                          :rules="[val => !!val || '* Field is required' ,]"
                        >
                          <template v-slot:prepend>
                            <q-icon name="person" />
                          </template>
                        </q-input>

                        <q-input
                          lazy-rules
                          ref="input2"
                          color="accent"
                          bg-color="white"
                          v-model="form_data.email"
                          label="E-mail"
                          outlined
                          :rules="[val => !!val || '* Field is required' , val => val.includes('@') && val.includes('.com') || 'Please input a valid e-mail', ]"
                        >
                          <template v-slot:prepend>
                            <q-icon name="mail" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <div class="field">
                      <div>
                        <q-input
                          lazy-rules
                          ref="input3"
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

                    <div class="field">
                      <div class="row">
                        <div class="col-3 q-pr-xs">
                          <q-select
                            v-model="form_data.contact_code"
                            :options="contact_codes"
                            outlined
                            color="accent"
                            dense
                            :rules="[val => !!val ]"
                          />
                        </div>
                        <div class="col-9">
                          <q-input
                            lazy-rules
                            ref="input4"
                            v-model="form_data.contact"
                            type="number"
                            placeholder="*9xxxxxxxxx"
                            color="accent"
                            outlined
                            dense
                            :rules="[val => !!val, val => val.length == 10]"
                          ></q-input>
                        </div>
                      </div>
                    </div>

                    <div class="q-mt-sm">
                      <q-btn
                        type="submit"
                        style="background: #34548b; color: white;"
                        glossy
                        unelevated
                        :loading="loading2"
                        class="full-width"
                      >Add</q-btn>
                    </div>
                  </q-form>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import countries from "../../references/countries";
import contact_codes from "../../references/contact_codes";
import { postSuperAdmin } from "../../references/url";

export default {
  data: () => ({
    form_data: {
      full_name: null,
      country: "",
      email: null,
      password: null,
      contact: null,
      contact_code: "",
    },
    loading2: false,
    contact_codes: contact_codes,
    countryOptions: countries,
    isPwd: true,
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

    // sorts contact codes
    this.contact_codes.sort();
    // get user phone code
    let user_location_info = await this.$_locateUser();
    let user_country_details = await this.$_getUserCountryInfo(
      user_location_info.data.country_name
    );
    this.form_data.contact_code = user_location_info.data.country_calling_code;
  },

  methods: {
    async addSuperAdmin() {
      this.loading2 = true;
      let res = await this.$_post(postSuperAdmin, this.form_data);
      this.loading2 = false;
      if (res.status == 200) {
        this.loading2 = false;
        this.triggerPositive();
        this.reset();
        this.form_data.full_name = "";
        this.form_data.email = "";
        this.form_data.password = "";
        this.form_data.contact = "";
        window.scrollTo(0, 0);
      }
    },
    reset() {
      this.$refs.input1.resetValidation();
      this.$refs.input2.resetValidation();
      this.$refs.input3.resetValidation();
      this.$refs.input4.resetValidation();
    },

    triggerPositive() {
      this.$q.notify({
        message: `<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Successfully Added</div>`,
        position: "top",
        color: "white",
        html: true,
      });
    },
  },
};
</script>
<style>
</style>