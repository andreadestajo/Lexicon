<template>
  <div class="kyc-container">
    <q-form @submit="handleSubmit">
      <!-- <q-form> -->
      <p
        class="address-header-banner text-center font-header"
      >Please make sure all information below are correct before proceeding</p>
      <p
        class="personal-header-banner text-italic text-left font-header"
      >Items with an asterisk <strong style="font-size: 1.3rem;">	(&#42;)</strong> has to be filled out</p>
      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.house_number"
            label="*Address Line"
            outlined
            color="accent"
            :rules="[val => !!val]"
          ></q-input>
        </div>
      </div>
      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.street_address"
            label="*Street Address"
            outlined
            color="accent"
            :rules="[val => !!val]"
          ></q-input>
        </div>
      </div>
      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.city"
            label="*City/ State"
            outlined
            color="accent"
            :rules="[val => !!val]"
          ></q-input>
        </div>
      </div>

      <div class="field q-mt-md">
        <div>
          <q-select
            v-model="form_data.country"
            label="*Select a country"
            :options="countries"
            outlined
            color="accent"
            :rules="[val => !!val]"
          />
        </div>
      </div>

      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.zip_code"
            label="*ZIP Code"
            outlined
            color="accent"
            :rules="[val => !!val]"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <q-btn
            flat
            class="field q-mt-md back-btn"
            icon="fas fa-long-arrow-alt-left"
            size="15px"
            @click="stepBack"
            rounded
          />
        </div>
        <div class="col-6 text-right">
          <q-btn
            rounded
            type="submit"
            :loading="loading2"
            label="Proceed"
            class="field q-mt-md btn-continue btn-size"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import questions from "../../references/questions";
import countries from "../../references/countries";
import { putUpdateKycAddress, putStepDown, postGetKyc} from "../../references/url";

export default {
  name: "UQKycAddressInfo",
  props: {},
  data: () => ({
    form_data: {
      house_number: "",
      street_address: "",
      city: "",
      country: "",
      zip_code: ""
    },
    loading2: false,
    countries: countries
  }),

  async mounted() {
    let user_location_info = await this.$_locateUser();
    this.form_data.country = user_location_info.data.country_name;
    this.form_data.city = user_location_info.data.city;
    this.form_data.zip_code = user_location_info.data.postal;
    
    let kyc_info = await this.getKycByUserId(this.$user_info._id);
    console.log(kyc_info)
    this.form_data.house_number   = kyc_info.house_number;
    this.form_data.street_address = kyc_info.street_address;
  },

  methods: {
    async stepBack() {
      // let res = await this.$_put(putStepDown);
      // if (res.hasOwnProperty("data")) {
        this.$_update_step(0);
      // }
    },
    async handleSubmit() {
      this.form_data.user_id = this.$user_info._id;
      this.form_data.house_number = this.form_data.house_number.toUpperCase();
      this.form_data.street_address = this.form_data.street_address.toUpperCase();
      this.form_data.city = this.form_data.city.toUpperCase();
      this.form_data.country = this.form_data.country.toUpperCase();
      this.form_data.zip_code = this.form_data.zip_code.toUpperCase();

      this.loading2 = true;
      let res = await this.$_put(putUpdateKycAddress, this.form_data);
      if (res) {
        this.loading2 = false;
        this.$_update_step(1);
        window.scrollTo(0, 0);
      } else {
        this.loading2 = false;
      }
    },
    async getKycByUserId(user_id) {
      let res = await this.$_post(postGetKyc, { user_id });
      return res.data;
    },
  }
};
</script>
<style>
.address-header-banner {
  margin: 20px 0px 50px 00px;
}
/* notes */
/* .kyc-container {
  padding: 0 200px;
} */
.btn-continue {
  background-color: #2f4c7e;
  color: white;
}
.back-btn {
  background-color: #2f4c7e;
  color: white;
}
</style>
