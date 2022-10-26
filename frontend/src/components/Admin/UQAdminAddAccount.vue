=============================
Title : Add Account
Author: Andrea Antonio Destajo
Contributor:
=============================
<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      :limits="[0, 100]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      separator-class="bg-black"
    >

      <template v-slot:before>
       <q-page
          class="row justify-center items-center q-mt-xl q-mb-xl container-all"
          style="width:80%; margin-left:100px;"
        >
          <div class="column">
              <q-card class="q-pa-lg shadow-1 container-encode">
                <q-card-section>
                  <div class="row">
                    <h5 class="text-h5 q-my-md"><b>Register new Lexicon Bank account.</b></h5>
                    <p>
                      Fill-out the following information in the order presented for an easier and faster
                      transition to the new system.
                    </p>
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-form @submit="createAccount()">
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            outlined
                            v-model="user_data.firstname"
                            label="First Name"
                            color="accent"
                            required
                          />
                        </div>
                      </div>
                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            outlined
                            v-model="user_data.middlename"
                            label="Middle Name"
                            color="accent"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            outlined
                            v-model="user_data.lastname"
                            label="Last Name"
                            color="accent"
                            required
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            v-model="user_data.birthdate"
                            placeholder="Enter Address"
                            type="date"
                            data-date-format="DD MMMM YYYY"
                            outlined
                            color="accent"
                            dense
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            outlined
                            v-model="user_data.nationality"
                            label="Nationality"
                            color="accent"
                            required
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-select
                            outlined
                            v-model="user_data.gender"
                            color="accent"
                            :options="gender"
                            label="Gender"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            color="accent"
                            outlined
                            v-model="user_data.house_number"
                            label="Address Line"
                            required
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            color="accent"
                            outlined
                            v-model="user_data.street_address"
                            label="Street Address"
                            required
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            dense
                            color="accent"
                            outlined
                            v-model="user_data.city"
                            label="City/State"
                            required
                          />
                        </div>
                      </div>

                      <div class="col-6">
                        <div>
                          <q-select
                            dense
                            @input="requestDemonym()"
                            filled
                            v-model="user_data.country"
                            label="Country"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            :options="countryOptions"
                            
                            outlined
                            :rules="[val => !!val || '* Field is required' ,]"
                          >
                            <template v-slot:prepend>
                              <q-icon name="location_on" />
                            </template>
                            <template v-slot:append>
                              <q-icon
                                v-if="user_data.country !== null"
                                class="cursor-pointer"
                                name="clear"
                                @click.stop="user_data.country = ''"
                              />
                            </template>
                          </q-select>
                        </div>
                      </div>

                      <div class="col-6">
                        <div>
                          <q-input
                            dense
                            color="accent"
                            outlined
                            v-model="user_data.postal_code"
                            label="ZIP/Postal Code"
                            required
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div>
                          <q-input
                            type="Email"
                            dense
                            color="accent"
                            outlined
                            v-model="user_data.email"
                            label="Email"
                            required
                          />
                        </div>
                      </div>
                      <div class="col-3">
                        <div>
                          <q-select
                            dense
                            @input="requestDemonym()"
                            filled
                            v-model="user_data.contact_code"
                            label="Contact code"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            :options="contact_codes"
                            color="accent"
                            outlined
                            :rules="[val => !!val ]"
                            />
                        </div>
                      </div>
                      <div class="col-9">
                        <div>
                          <q-input
                            dense
                            color="accent"
                            outlined
                            v-model="user_data.mobile_number"
                            label="Mobile Number"
                            type="number"
                            :rules="[val => !!val, val => val.length == 10]"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="q-pa-md">
                        <q-btn type="submit" class="bg-default text-white q-mr-md">Proceed</q-btn>
                        <q-btn v-close-popup outline color="accent" to="/admin/dashboard">Reset</q-btn>
                      </div>
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
            <!-- End of form -->

            <!-- Success button -->
            <q-dialog v-model="success" persistent>
              <q-card class="q-pa-lg">
                <q-card-section class="text-center q-pb-none">
                  <q-icon size="30px" name="fas fa-user" color="accent" />
                  <div class="q-mt-md">{{message}}</div>
                </q-card-section>
                <q-card-section>
                  <div class="text-center row justify-around">
                    <div class="col-5">
                      <q-btn size="20px" flat v-close-popup>OK</q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
            <!-- Success button  -->
        </q-page>
      </template>

      <template v-slot:after>
        <q-card class="q-pa-lg shadow-1" style="width:90%; margin: 5% 10% 10% 10%;">
          <div >
            <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
              <template slot="table_rows" slot-scope="props">
                <q-td key="full_name">{{props.data.full_name}}</q-td>
                <q-td key="email">{{props.data.email}}</q-td>
                <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
              </template>
            </u-q-table>
          </div>
        </q-card>
      </template>
    </q-splitter>    
  </div>
</template>

<script>
import UQTable from "../../components/UQTable";
import countries from "../../references/countries";
import contact_codes from "../../references/contact_codes";
import moment from "moment-timezone";
import { postAllUserList, postCreateAccount } from "../../references/url";

export default {
  components: {
    UQTable,
  },
  data: () => ({

    moment: moment,
    filter: '',
    splitterModel: 50,
    success: false,
    message: "",
    countryOptions: countries,
    contact_codes: contact_codes,
    gender: ["Female", "Male"],
    user_data: {
      firstname: "",
      middlename: "",
      lastname: "",
      full_name: "",
      birthdate: "",
      nationality: "",
      gender: "",
      street_address: "",
      house_number: "",
      city: "",
      postal_code: "",
      email: "",
      contact_code:"",
      mobile_number: "",
      country: "",
    },

     table: {
          title:   'New Users',  
          columns: [
              {name: 'full_name'     , label: 'Full Name'   , field: 'full_name'   , align:'left'      , sortable: true},
              {name: 'email'      , label: 'Email'    , field: 'email'    , align:'left'      , sortable: true}, 
              {name: 'date_created'      , label: 'Date Created'    , field: 'date_created'    , align:'left'      , sortable: true}, 
              ],
          data:[],
     },
  }),

  async mounted() {
    this.role = this.$user_info.user_role;

    if(this.role != "Encoder"){
      this.$router.push({ path: "/admin/login" });
    }
    this.getUsers();

    let res = await this.$_locateUser();
    this.user_data.country = res.data.country_name;

    if (this.user_data.country === "United States") {
      this.user_data.country = "United States of America";
    }
    let res2 = await this.$_getUserCountryInfo(this.user_data.country);
    this.user_data.demonym = res2.data[0].demonym;
    this.user_data.callingCodes = "+" + res2.data[0].callingCodes[0];
  },

  methods: {
    async getUsers() {
      let res = await this.$_post(postAllUserList);
      if (res) {
        this.$q.loading.hide();
        this.table.data = res.data;
      }
    },
    async requestDemonym() {
      if (this.form_data.country === "United States") {
        this.form_data.country = "United States of America";
      }
      let res2 = await this.$_getUserCountryInfo(this.form_data.country);
      this.form_data.demonym = res2.data[0].demonym;
      this.form_data.callingCodes = "+" + res2.data[0].callingCodes[0];
    },

    async createAccount() {
      this.user_data.full_name =
        this.user_data.firstname +
        " " +
        this.user_data.middlename +
        " " +
        this.user_data.lastname;

      // console.log(this.user_data)

      if (
        this.user_data.firstname == "" ||
        this.user_data.lastname == "" ||
        this.user_data.full_name == "" ||
        this.user_data.birthdate == "" ||
        this.user_data.nationality == "" ||
        this.user_data.gender == "" ||
        this.user_data.street_name == "" ||
        this.user_data.house_number == "" ||
        this.user_data.city == "" ||
        this.user_data.postal_code == "" ||
        this.user_data.email == "" ||
        this.user_data.mobile_number == "" ||
        this.user_data.country == ""
      ) {
        // this.$q.notify({
        //   type: `negative`,
        //   message: `You need to fill up the form`,
        //   position: "top",
        // });
        this.$q.notify({
            message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>' + "You need to fill up the form" + '</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
      } else {
        this.$q.loading.show();
        let res = await this.$_post(postCreateAccount, this.user_data);
        this.$q.loading.hide();

        console.log(res)

        if (res) {
          this.reset();
          await this.getUsers();
          this.data = res.data;
          this.success = true;
          this.message = `Account added successfully.`;
        }
      }
    },

    async reset() {
      this.user_data.firstname = "";
      this.user_data.middlename = "";
      this.user_data.lastname = "";
      this.user_data.full_name = "";
      this.user_data.birthdate = "";
      this.user_data.nationality = "";
      this.user_data.gender = "";
      this.user_data.house_number = "";
      this.user_data.street_address = "";
      this.user_data.city == "";
      this.user_data.postal_code = "";
      this.user_data.email = "";
      this.user_data.mobile_number = "";
    },
  },
};
</script>

<style>
.container-encode {
  border-radius: 30px;
  padding: 0 100px;
}
.container-all {
  padding: 0 100px;
}
</style>