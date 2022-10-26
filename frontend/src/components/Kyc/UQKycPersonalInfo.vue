<template>
  <div class="kyc-container" style="z-index: 0">
    <q-form @submit="handle_submit">
      <!-- <q-form> -->
      <p
        class="personal-header-banner text-center font-header"
      >Please make sure all information below are correct before proceeding</p>

      <p class="personal-header-banner text-italic text-left font-header">
        Items with an asterisk
        <strong style="font-size: 1.3rem;">(&#42;)</strong> has to be filled out
      </p>
      <div class="field">
        <div>
          <q-input
            v-model="form_data.first_name"
            label="*First Name"
            outlined
            :rules="[val => !!val ]"
            color="accent"
          ></q-input>
        </div>
      </div>
      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.middle_name"
            label="Middle Name"
            outlined
            :rules="[undefined]"
            color="accent"
          ></q-input>
        </div>
      </div>
      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.last_name"
            label="*Last Name"
            outlined
            :rules="[val => !!val]"
            color="accent"
          ></q-input>
        </div>
      </div>

      <div class="field q-mt-md">
        *
        <label class="font-raleway">Gender :</label>

        <q-radio
          class="font-raleway"
          color="accent"
          v-model="gender"
          val="male"
          label="Male"
            :rules="[val => !!val]"
            selected
        />

        <q-radio
          class="font-raleway"
          color="accent"
          v-model="gender"
          val="female"
          label="Female"
            :rules="[val => !!val]"
        />
      </div>

      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.nationality"
            label="*Nationality"
            outlined
            :rules="[val => !!val ]"
            color="accent"
          ></q-input>
        </div>
      </div>

      <div class="field q-mt-md">
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

      <div class="field q-mt-md">
        <label>*Birthday</label>
        <div>
          <q-input
            v-model="form_data.birthday"
            type="date"
            data-date-format="DD MMMM YYYY"
            outlined
            color="accent"
            :rules="[val => !!val || '*Field is required']"
          ></q-input>
        </div>
      </div>

      <div class="field q-mt-md row text-right">
        <div class="col-12">
          <q-btn
            rounded
            type="submit"
            class="btn-size"
            id="btn-proceed"
            :loading="loading2"
            unelevated
          >Proceed</q-btn>
        </div>
      </div>
    </q-form>
    <!-- <img
      src="../../../public/kyc-icons/tao-3.png"
      alt="icon"
      class="vector"
      style="height:200px; width:200px;"
    />
    <img src="../../../public/kyc-icons/tao-4.png" alt="icon" class="vector-2" />-->
  </div>
</template>

<script>
import moment from "moment";
import questions from "../../references/questions";
import { putUpdateKycPersonal, postGetKyc } from "../../references/url";
import countries from "../../references/countries";
import contact_codes from "../../references/contact_codes";

export default {
  name: "UQKycPersonalInfo",
  props: {},
  data: () => ({
    moment: moment,
    countries,
    questions: questions,
    contact_codes: contact_codes,
    isPwd: true,
    loading2: false,
    gender:"male",
    age: 0,
    form_data: {
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      contact: "",
      birthday: "",
      nationality: "",
      contact_code: "",
    },
  }),

  async mounted() {
    // sorts contact codes
    this.contact_codes.sort();
    // get user phone code
    let user_location_info = await this.$_locateUser();
    let user_country_details = await this.$_getUserCountryInfo(
      user_location_info.data.country_name
    );

    this.form_data.contact_code = user_location_info.data.country_calling_code;
    this.form_data.nationality = user_country_details.data[0].demonym;

    let kyc_info = await this.getKycByUserId(this.$user_info._id);

    this.form_data.first_name   = kyc_info.first_name;
    this.form_data.middle_name  = kyc_info.middle_name;
    this.form_data.last_name    = kyc_info.last_name;
    this.form_data.gender       = kyc_info.gender;
    this.form_data.contact      = kyc_info.contact;
    this.form_data.birthday     = kyc_info.birthday ? this.moment(kyc_info.birthday).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD');
    
  },

  methods: {
    async handle_submit() {
      this.form_data.user_id = this.$user_info._id;
      this.form_data.first_name = this.form_data.first_name.toUpperCase();
      this.form_data.middle_name = this.form_data.middle_name.toUpperCase();
      this.form_data.last_name = this.form_data.last_name.toUpperCase();
      this.form_data.gender = this.gender.toUpperCase();
      this.form_data.nationality = this.form_data.nationality.toUpperCase();
      this.loading2 = true;
      let res = await this.$_put(putUpdateKycPersonal, this.form_data);
      this.loading2 = false;

      if (res.data.status == "success") {
        // alert('success')
        this.$_update_step(1);
        window.scrollTo(0, 0);
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
.personal-header-banner {
  margin: 20px 0px 50px 00px;
}
#btn-proceed {
  background-color: #2f4c7e;
  color: white;
}
#gender {
  align-items: center;
}
/* notes */
/* .kyc-container {
  padding: 0 200px;
} */

/* Live */
</style>