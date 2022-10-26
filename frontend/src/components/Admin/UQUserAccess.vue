<template>
  <div class>
    <div style="width: 200px">
      <q-btn @click="addUserform()">Add User</q-btn>
    </div>
    <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
      <template slot="table_rows" slot-scope="props">
        <q-td key="full_name">{{props.data.full_name}}</q-td>
        <q-td key="email">{{props.data.email}}</q-td>
        <q-td key="role">{{props.data.user_role}}</q-td>
        <q-td>
          <q-btn class="accent" @click="viewUser(props.data)">Edit</q-btn>
          <q-btn class="accent" @click="removeUser(props.data._id)">Remove</q-btn>
        </q-td>
      </template>
    </u-q-table>

    <u-q-modal ref="user_modal" :is_persistent="true" :modal_data="modal.user_information">
      <div class="text-h6" slot="modal-header">User</div>
      <div slot="modal-content" slot-scope="props">
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Full Name</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.full_name}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Email</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.email}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Role</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <q-select
                  outlined
                  v-model="select_role"
                  behavior="menu"
                  :options="options"
                  label="Select Role"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
          <!-- ws -->
        </q-list>
        <q-card-actions>
          <q-btn @click="setRole(props.data)">Save</q-btn>
          <q-btn v-close-popup>Close</q-btn>
        </q-card-actions>
      </div>
    </u-q-modal>

    <u-q-modal ref="adduser_modal" :is_persistent="true" :modal_data="modal.user_information">
      <div class="text-h6" slot="modal-header">User</div>
      <div slot="modal-content" slot-scope="props">
        <q-form @submit="addUser()">
          <div>
            <q-input square outlined v-model="user_data.full_name" label="Fullname" />
          </div>
          <div>
            <q-input type="Email" square outlined v-model="user_data.email" label="Email" />
          </div>
          <div>
            <q-input square outlined v-model="user_data.contact" label="Contact" />
          </div>
          <div>
            <q-input type="Password" square outlined v-model="user_data.password" label="Password" />
          </div>
          <div>
            <q-select
              outlined
              v-model="user_data.select_role"
              behavior="menu"
              :options="options"
              label="Select Role"
            />
          </div>
          <div>
            <q-btn type="submit">Add User</q-btn>
            <q-btn v-close-popup>Close</q-btn>
          </div>
        </q-form>
      </div>
    </u-q-modal>

    <!-- approve button -->
    <q-dialog v-model="success" persistent>
      <q-card class="q-pa-lg">
        <q-card-section class="text-center q-pb-none">
          <q-avatar icon="question_answer" color="accent" text-color="white" />
          <div class="q-mt-md">User added Successfully!</div>
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

    <!-- approve button -->
    <q-dialog v-model="addRoleSuccess" persistent>
      <q-card class="q-pa-lg">
        <q-card-section class="text-center q-pb-none">
          <q-avatar icon="question_answer" color="accent" text-color="white" />
          <div class="q-mt-md">Changes have been made!</div>
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

    <!-- approve button -->
    <div>
      <q-dialog v-model="remove" persistent>
        <q-card class="q-pa-lg">
          <q-card-section class="text-center q-pb-none">
            <q-avatar icon="question_answer" color="accent" text-color="white" />
            <div class="q-mt-md">are you sure you want to remove user?</div>
          </q-card-section>
          <q-card-section>
            <div class="text-center row justify-around">
              <div class="col-5">
                <q-btn
                  @click="confirmRemoveUser()"
                  color="accent"
                  unelevated
                  class="full-width q-mt-md"
                  v-close-popup
                >Yes</q-btn>
              </div>

              <div class="col-5">
                <q-btn
                  outline
                  unelevated
                  label="No"
                  color="accent"
                  class="full-width q-mt-md"
                  v-close-popup
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <!-- approve button  -->
  </div>
</template>


<script>
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";
import {
  setUserRole,
  postUserList,
  AdminAddUser,
  removeUser,
} from "../../references/url";
import countries from "../../references/countries";

export default {
  components: {
    UQTable,
    UQModal,
  },

  data: () => ({
    form_data: {
      user_id: "",
      user_email: "",
      user_fullname: "",
      user_role: "",
      user_restrictions: "",
    },

    data:() =>(
    {

      form_data: {
        user_id: '',
        user_email : '',
        user_fullname : '',
        user_role : '',
        user_restrictions : '',       
      },
      success:false,
      remove: false,
      addRoleSuccess: false,

      user_data: {
        full_name   : "",
        email   : "",
        contact: "",
        password : "",
        select_role   : "",
      },

       table: {
            title:   'Users',  
            columns: [
                {name: 'full_name'     , label: 'Full Name'   , field: 'full_name'   , align:'left'      , sortable: true},
                {name: 'email'      , label: 'Email'    , field: 'email'    , align:'left'      , sortable: true}, 
                {name: 'role'      , label: 'Role'    , field: 'role'    , align:'left'      , sortable: true}, 
                {name: 'Action'      , label: 'Action'    , field: 'role'    , align:'left'      , sortable: true}, 
                ],
            data:[],
       },

       modal: {
        user_information: {},        
       },

    }),
    async mounted() 
    { 
      this.getUsers();
    },
      computed: 
    {
    },

    val: true,
    select_role: null,
    options: ["Administrator", "Reviewer", "Approver", "Moderator"],
    model: null,
    selection: [],
    table: {
      title: "Users",
      columns: [
        {
          name: "full_name",
          label: "Full Name",
          field: "full_name",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          label: "Email",
          field: "email",
          align: "left",
          sortable: true,
        },
        {
          name: "role",
          label: "Role",
          field: "role",
          align: "left",
          sortable: true,
        },
        {
          name: "Action",
          label: "Action",
          field: "role",
          align: "left",
          sortable: true,
        },
      ],
      data: [],
    },

    modal: {
      user_information: {},
    },
  }),
  async mounted() {
    this.getUsers();
  },
  computed: {},
  methods: {
    async userAction(userData) {
      this.confirmation_modal.user_action = {
        user_id: userData.user_id,
        action: userData.action,
      };
      this.$refs.confirmation_modal.showModal();
    },
    async confirmUserAction(userData) {
      console.log(usesrData);
      let form_data = {};
      form_data.user_id = userData.user_id;
      if (userData.action == "approve") {
        form_data.status = "APPROVED";
      } else if (kycData.action == "reject") {
        form_data.status = "REJECTED";
        form_data.message =
          this.confirmation_modal.comment == "Others"
            ? this.confirmation_modal.other_comment
            : this.confirmation_modal.comment;
      }
      // console.log(form_data)
      // this.$q.loading.show();
      // let res = await this.$_put(putUpdateKycStatus, form_data);
      // if(res.status == 'success');
      // {
      //     await this.setKycSubmits();
      // }
      this.$refs.kyc_modal.hideModal();
      this.$refs.confirmation_modal.hideModal();
      this.$q.loading.hide();
    },

    async requestDemonym() {
      if (this.user_data.country === "United States") {
        this.user_data.country = "United States of America";
      }
      let res2 = await this.$_getUserCountryInfo(this.user_data.country);
      this.user_data.demonym = res2.data[0].demonym;
      this.user_data.callingCodes = "+" + res2.data[0].callingCodes[0];
    },
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.countryOptions = countries.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    async getUsers() {
      let res = await this.$_post(postUserList);
      // console.log(res.data)
      if (res) {
        this.$q.loading.hide();
        this.table.data = res.data;

        // console.log(this.table.data)
      }
    },

    async viewUser(userInfo) {
      this.$q.loading.show();
      this.$refs.user_modal.showModal();

      this.modal.user_information = userInfo;
      this.$q.loading.hide();
    },

    async addUserform() {
      this.$q.loading.show();
      this.$refs.adduser_modal.showModal();
      this.$q.loading.hide();
    },

    async setRole(userInfo) {
      this.form_data.user_id = userInfo._id;
      this.form_data.user_email = userInfo.email;
      this.form_data.user_fullname = userInfo.full_name;
      this.form_data.user_role = this.select_role;
      this.form_data.user_restrictions = this.selection;

      this.$q.loading.show();
      let res = await this.$_post(setUserRole, this.form_data);
      this.$q.loading.hide();

      if (res) {
        this.addRoleSuccess = true;
        this.$refs.user_modal.hideModal();
        this.$q.loading.hide();
        this.data = res.data;

        await this.getUsers();
      }
    },

    async addUser() {
      this.$q.loading.show();
      let res = await this.$_post(AdminAddUser, this.user_data);

      if (res) {
        this.success = true;
        this.$refs.adduser_modal.hideModal();
        this.$q.loading.hide();
        this.data = res.data;

        await this.getUsers();
      }
    },

    async removeUser(userID) {
      this.remove = true;
      this.form_data.user_id = userID;
    },

    async confirmRemoveUser() {
      this.$q.loading.show();
      let res = await this.$_post(removeUser, this.form_data);
      await this.getUsers();
      console.log(userID);

      if (res) {
        this.remove = false;
        this.$q.loading.hide();
        this.data = res.data;
        await this.getUsers();
      }
    },
  },
};
</script>