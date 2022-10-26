========================================= Title: Design Author: Pergentino S.
Galang II Date: 12 Aug 2020 Contributor:
=========================================

<template>
  <div class="admin-table-container">
    <div class="row q-ma-sm q-col-gutter-md justify-center">
      <div class="col-12 col-md-6 col-lg-7">
        <u-q-table :tbl_title="table.title" :tbl_columns="table.columns" :tbl_data="table.data">
          <q-btn
            glossy
            slot="btn"
            class="q-mr-lg text-accent btn-add-user font-oswald"
            icon-right="add"
            label="ADD USER"
            no-caps
            @click="test_alert"
          />

          <template slot="table_rows" slot-scope="props">
            <q-td key="full_name">{{ props.data.full_name }}</q-td>
            <q-td key="email">{{ props.data.email }}</q-td>
            <q-td key="role">{{ props.data.user_role }}</q-td>
            <q-td align="center">
              <q-btn class="text-white" flat @click="viewUser(props.data)">
                <i class="fas fa-pen"></i>
              </q-btn>
              <q-btn class="text-white" flat @click="removeUser(props.data._id)">
                <i class="fas fa-trash"></i>
              </q-btn>
            </q-td>
          </template>
        </u-q-table>
      </div>

      <div class="col-12 col-md-5 col-lg-7">
        <u-q-permissions></u-q-permissions>
      </div>
    </div>

    <q-dialog v-model="alert" persistent>
      <q-card>
        <q-card-section class="card-add-user">
          <div class="q-mb-md text-h5 font-monseratt text-weight-bolder">Fill-up User Details</div>
          <hr class="q-mb-md" />
          <q-form @submit="addUser()">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div>
                  <q-input
                    square
                    outlined
                    v-model="user_data.full_name"
                    label="Fullname"
                    color="accent"
                    required
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div>
                  <q-input
                    type="Email"
                    square
                    color="accent"
                    outlined
                    v-model="user_data.email"
                    label="Email"
                    required
                  />
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div>
                  <q-input
                    color="accent"
                    square
                    outlined
                    v-model="user_data.contact"
                    label="Contact Number"
                    required
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div>
                  <q-input
                    color="accent"
                    v-model="user_data.password"
                    :type="isPwd ? 'password' : 'text'"
                    label="Password"
                    outlined
                    :rules="[
                      val => !!val || '* Field is required',
                      val =>
                        val.length > 7 ||
                        'Password must be more than 8 characters',
                      val =>
                        val.length < 17 ||
                        'Password must not exceed 16 characters'
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

              <div class="col-12 col-md-6">
                <div>
                  <q-select
                    color="accent"
                    outlined
                    v-model="user_data.select_role"
                    :options="options"
                    label="Select Role"
                    behavior="menu"
                  />
                </div>
              </div>
            </div>

            <div class="q-mt-md row justify-end font-oswald">
              <div class="col-3 col-md-2 q-mr-md">
                <q-btn type="submit" class="bg-default text-white">Proceed</q-btn>
              </div>
              <div class="col-3 col-md-2">
                <q-btn v-close-popup outline color="accent">Close</q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <u-q-modal
      ref="user_modal"
      :is_persistent="true"
      :modal_data="modal.user_information"
      :modal_style="'width: 500px'"
    >
      <q-card-section slot="modal-header" class="card-edit-user">
        <div class="new-role-font font-monseratt text-weight-bolder">Edit User's Role</div>
        <hr />
      </q-card-section>
      <div slot="modal-content" slot-scope="props" class="modal-content-style">
        <div class="row justify-center q-col-gutter-md">
          <div class="col-12">
            <q-item-label>
              Full Name:
              <span class="text-weight-bolder">{{ props.data.full_name }}</span>
            </q-item-label>
            <q-item-label>
              Email Address:
              <span class="text-weight-bolder">{{ props.data.email }}</span>
            </q-item-label>
            <q-item-label>
              Current Role:
              <span class="text-weight-bolder">{{ props.data.user_role }}</span>
            </q-item-label>
          </div>

          <div class="col-12">
            <q-item-section>
              <q-select
                outlined
                v-model="select_role"
                behavior="menu"
                :options="options"
                color="accent"
                label="Select Role"
              />
            </q-item-section>
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <div class="col-3 q-mr-sm">
            <q-btn
              @click="setRole(props.data)"
              class="bg-default full-width text-white font-oswald"
            >Save</q-btn>
          </div>
          <div class="col-3">
            <q-btn v-close-popup outline class="full-width font-oswald" color="accent">Close</q-btn>
          </div>
        </div>
      </div>
    </u-q-modal>

    <!-- approve button -->
    <q-dialog v-model="success" persistent>
      <q-card class="q-pa-lg">
        <q-card-section class="text-center q-pb-none">
          <div class="q-mt-md text-h6">{{ message }}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-center row justify-around">
            <div class="col-5">
              <q-btn v-close-popup outline color="accent">Close</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- approve button  -->

    <!-- approve button -->
    <div>
      <q-dialog v-model="remove" persistent>
        <q-card class="q-pa-sm">
          <q-card-section class="text-center q-pb-none">
            <div class="text-h6 font-monseratt">Are you sure you want to remove this user?</div>
          </q-card-section>
          <q-card-section>
            <div class="text-center row justify-end font-oswald">
              <div class="col-3 q-mr-sm">
                <q-btn
                  @click="confirmRemoveUser()"
                  color="accent"
                  unelevated
                  class="full-width q-mt-md"
                  v-close-popup
                >Yes</q-btn>
              </div>

              <div class="col-3">
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

    <!-- warning button -->
    <div>
      <q-dialog v-model="warning" persistent>
        <q-card class="q-pa-lg">
          <q-card-section class="text-center q-pb-none">
            <q-avatar icon="question_answer" color="accent" text-color="white" />
            <div class="q-mt-md">Please indicate the user role.</div>
          </q-card-section>
          <q-card-section>
            <div class="text-center row justify-around">
              <div class="col-5">
                <q-btn
                  outline
                  unelevated
                  label="Close"
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
  </div>
</template>

<script>
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";
import UQPermissions from "../../components/Admin/UQPermissions";
import UQAdminAddAccount from "../../components/Admin/UQAdminAddAccount";
import {
  setUserRole,
  postUserList,
  AdminAddUser,
  removeUser,
  postRoleList,
} from "../../references/url";
import countries from "../../references/countries";

export default {
  components: {
    UQTable,
    UQModal,
    UQPermissions,
  },

  data: () => ({
    alert: false,
    form_data: {
      user_id: "",
      user_email: "",
      user_fullname: "",
      user_role: "",
      user_restrictions: "",
    },
    success: false,
    remove: false,
    warning: false,
    isPwd: true,
    message: "",

    user_data: {
      full_name: "",
      email: "",
      contact: "",
      country: "",
      password: "Lexicon01",
      select_role: "",
    },

    panel: "Admin",
    current_role: "",
    countryOptions: countries,
    val: true,
    select_role: null,
    options: [],
    model: null,
    selection: [],
    role_selection: [],
    table: {
      title: "Admin",
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
          align: "center",
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
    this.getRoles();
    this.current_role = this.$user_info.user_role;
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
      this.$refs.kyc_modal.hideModal();
      this.$refs.confirmation_modal.hideModal();
      this.$q.loading.hide();
    },

    async getUsers() {
      let res = await this.$_post(postUserList);

      if (res) {
        this.$q.loading.hide();
        this.table.data = res.data;
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
        // this.$q.notify({
        //   type: `positive`,
        //   message: `Changes have been made.`,
        //   position: "top"
        // });
        this.$q.notify({
          message:
            '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Changes have been made.</div>',
          position: "top",
          color: "white",
          html: true,
        });
        this.$refs.user_modal.hideModal();
        this.select_role = null;
        this.$q.loading.hide();
        this.data = res.data;

        await this.getUsers();
      }
    },

    async reset() {
      this.user_data.full_name = "";
      this.user_data.email = "";
      this.user_data.contact = "";
      this.user_data.select_role = "";
    },

    async addUser() {
      if (
        this.user_data.full_name == "" ||
        this.user_data.email == "" ||
        this.user_data.contact == "" ||
        this.user_data.password == "" ||
        this.user_data.select_role == ""
      ) {
        // this.$q.notify({
        //   type: `negative`,
        //   message: `You need to fill up the form`,
        //   position: "top"
        // });
        this.$q.notify({
          message:
            '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>You need to fill up the form.</div>',
          position: "top",
          color: "white",
          html: true,
        });
        await this.getUsers();
      } else {
        this.$q.loading.show();
        let res = await this.$_post(AdminAddUser, this.user_data);
        this.$q.loading.hide();

        if (res.data != null) {
          this.data = res.data;
          // this.$q.notify({
          //   type: `positive`,
          //   message: `User added successfully.`,
          //   position: "top"
          // });
          this.$q.notify({
            message:
              '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>User added successfully.</div>',
            position: "top",
            color: "white",
            html: true,
          });
          this.alert = false;
          await this.getUsers();
        }
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

      if (res) {
        // this.$q.notify({
        //   type: `positive`,
        //   message: `User removed successfully.`,
        //   position: "top"
        // });
        this.$q.notify({
          message:
            '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>User removed successfully.</div>',
          position: "top",
          color: "white",
          html: true,
        });
        this.$q.loading.hide();
        this.data = res.data;
      }
    },
    async test_alert(word) {
      this.reset();
      this.alert = true;
    },

    async getRoles() {
      let res = await this.$_post(postRoleList);
      if (res) {
        this.$q.loading.hide();
        this.form_data.data = res.data;
        for (let i = 0; i < this.form_data.data.length; i++) {
          this.options.push(this.form_data.data[i].Role);
        }
      }
    },
  },
};
</script>
<style>
.admin-table-container {
  padding: 20px 0 !important;
  margin-top: 20px;
}
.btn-add-user {
  background-color: #b5cef5;
}
.card-add-user {
  padding: 30px 60px;
}
.card-edit-user {
  padding: 5px 40px;
}
.modal-content-style {
  padding: 10px 40px;
}
.fa-pen {
  color: #2f4c7e;
  font-size: 20px;
}
.fa-trash {
  color: #c10015;
  font-size: 20px;
}
</style>
<style>
@media (max-width: 450px) {
  .admin-table-container {
    padding: 20px;
  }
}
@media (max-width: 1023px) {
  .admin-table-container {
    padding: 10px;
  }
  .admin-user-table {
    margin-bottom: 20px;
  }
  .card-add-user {
    padding: 20px !important;
  }
}
@media (min-width: 1024px) {
  .admin-table-container {
    padding: 10px;
  }

  .admin-user-table {
    margin-bottom: 20px;
  }
}
</style>
