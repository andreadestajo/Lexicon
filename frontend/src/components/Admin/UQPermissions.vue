========================================= 
Title: Design Author: Pergentino S.
Galang II Date: 12 Aug 2020 Contributor:
=========================================

<template>
  <div class>
    <u-q-table
      :tbl_title="table.title"
      :tbl_columns="table.columns"
      :tbl_data="table.data"
    >
      <q-btn
        label="Add Role"
        glossy
        class="q-mr-lg text-accent add-role-btn font-oswald"
        icon-right="add"
        slot="btn"
        @click="callAddModal()"
      />
      <template slot="table_rows" slot-scope="props">
        <q-td key="Role">{{ props.data.Role }}</q-td>

        <q-td align="center">
          <q-btn class="q-mr-md" @click="editRole(props.data)" flat>
            <i class="fas fa-pen"></i>
          </q-btn>
          <q-btn class="q-mr-md" @click="removeRole(props.data._id)" flat>
            <i class="fas fa-trash"></i>
          </q-btn>
          <q-btn
            flat
            class="q-mr-md"
            color="positive"
            @click="view(props.data)"
          >
            <i class="fas fa-eye q-mr-sm"></i>
          </q-btn>
        </q-td>
      </template>
    </u-q-table>

    <q-dialog v-model="addRole">
      <q-card class="new-role-container">
        <q-card-section>
          <div class="new-role-font font-monseratt text-weight-bolder">
            New Role
          </div>
          <hr class="q-mb-md" />
        </q-card-section>

        <q-card-section class="col-12 q-pt-none">
          <q-input
            outlined
            v-model="form_data.newRole"
            color="accent"
            label="Role Name"
          />
          <div class="q-mt-md">
            <q-input
              color="accent"
              v-model="form_data.description"
              label="Description"
              outlined
              autogrow
            />
          </div>
          <div class="q-mt-md">
            <div class="q-gutter-sm">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold font-monseratt"
                      >Access Level</q-item-label
                    >
                  </q-item-section>
                </q-item>

                <div class="row q-col-gutter-xs">
                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="User Creation"
                          color="accent"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-monseratt"
                          >User Creation</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>

                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar top>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="Add Funds"
                          color="accent"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-monseratt"
                          >Add Funds</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar top>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="Wire Transfer"
                          color="accent"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-monseratt"
                          >Wire Transfer</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar top>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="Setting"
                          color="accent"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-monseratt"
                          >Setting</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar top>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="Reports"
                          color="accent"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-monseratt"
                          >Reports</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar top>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="View"
                          color="accent"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-monseratt">View</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar top>
                        <q-checkbox
                          v-model="form_data.restrictions"
                          val="Encoding"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Encoding</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <div class="q-my-md q-mr-sm row justify-end">
          <div class="col-4 col-md-2 q-mr-lg">
            <q-btn
              @click="addNewRole()"
              class="bg-default text-white font-oswald"
              >Proceed</q-btn
            >
          </div>
          <div class="col-4 col-md-2">
            <q-btn v-close-popup outline class="font-oswald" color="accent"
              >Close</q-btn
            >
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Edit Role -->
    <u-q-modal
      ref="role_modal"
      :is_persistent="true"
      :modal_data="modal.user_information"
      :modal_style="'width: 500px'"
    >
      <q-card-section slot="modal-header">
        <div class="new-role-font font-monseratt text-weight-bolder">
          Edit Role
        </div>
        <hr />
      </q-card-section>

      <div slot="modal-content" slot-scope="props">
        <div class="row q-col-gutter-md justify-center">
          <div class="col-12 q-pt-none">
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-input
                  color="accent"
                  outlined
                  v-model="form_data.newRole"
                  label="Role Name"
                />
              </q-item-section>
            </q-item>
          </div>

          <div class="col-5">
            <q-item>
              <q-item-section avatar>
                <q-input
                  v-model="form_data.description"
                  color="accent"
                  label="Description"
                  autogrow
                />
              </q-item-section>
            </q-item>
          </div>

          <div class="col-5">
            <q-item>
              <q-item-section avatar>
                <q-select
                  v-model="form_data.restrictions"
                  multiple
                  :options="roleOptions"
                  use-chips
                  stack-label
                  color="accent"
                  label="Restrictions"
                />
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div class="text-center q-mt-md q-mr-lg row justify-end">
          <div class="col-3 q-mr-sm">
            <q-btn
              @click="updateRole(props.data)"
              color="accent"
              class="full-width q-mt-md font-oswald"
              >Save</q-btn
            >
          </div>
          <div class="col-3">
            <q-btn
              v-close-popup
              outline
              color="accent"
              class="full-width q-mt-md font-oswald"
              >Close</q-btn
            >
          </div>
        </div>
      </div>
    </u-q-modal>
    <!-- Edit Role -->

    <!-- view Role -->
    <u-q-modal
      ref="view_role"
      :is_persistent="true"
      :modal_data="modal.user_information"
      :modal_style="'width: 500px'"
    >
      <q-card-section slot="modal-header">
        <div class="new-role-font font-monseratt text-weight-bolder">
          Role Details
        </div>
        <hr />
      </q-card-section>

      <div
        slot="modal-content"
        slot-scope="props"
        class="role-details-container"
      >
        <div class="row">
          <div class="row">
            <div class="col-12">
              <q-item>
                <q-item-section avatar>
                  <q-item-label>Role name:</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <b>{{ props.data.Role }}</b>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <q-input
                      readonly
                      v-model="props.data.Description"
                      label="Description"
                      autogrow
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <q-select
                      readonly
                      multiple
                      v-model="form_data.restrictions"
                      :options="roleOptions"
                      use-chips
                      stack-label
                      label="Restrictions"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>

        <div class="text-center q-mt-md">
          <q-btn v-close-popup class="bg-default text-white font-oswald"
            >Close</q-btn
          >
        </div>
      </div>
    </u-q-modal>
    <!-- View Role -->

    <q-dialog v-model="success" persistent>
      <q-card class="q-pa-lg">
        <q-card-section class="text-center q-pb-none">
          <div class="q-mt-md text-h6">{{ message }}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-center row justify-around">
            <div class="col-5">
              <q-btn v-close-popup class="bg-default text-white font-oswald"
                >Close</q-btn
              >
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Remove button -->
    <q-dialog v-model="remove" persistent>
      <q-card class="q-pa-lg">
        <q-card-section class="text-center q-pb-none">
          <div class="text-h6 font-monseratt">
            Are you sure you want to remove this role?
          </div>
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
                >Yes</q-btn
              >
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
</template>

<script>
import {
  AdminAddRole,
  postRoleList,
  deleteRole,
  postRolesrestriction,
  updateRole
} from "../../references/url";
import UQTable from "../UQTable";
import UQModal from "../UQModal";

export default {
  components: {
    UQTable,
    UQModal
  },

  data: () => ({
    success: false,
    remove: false,
    addRole: false,
    message: "",
    role: "",
    roleOptions: [
      "User Creation",
      "KYC Approver",
      "Add Funds",
      "Wire Transfer",
      "Setting",
      "Reports",
      "View",
      "Encoding"
    ],
    modelMultiple: [],

    form_data: {
      role_ID: "",
      newRole: "",
      restrictions: [],
      description: ""
    },

    table: {
      title: "Role",
      columns: [
        {
          name: "Role",
          label: "Role",
          field: "role",
          align: "left",
          sortable: true
        },
        {
          name: "Action",
          label: "Action",
          field: "Action",
          align: "center",
          sortable: true
        }
      ],
      data: []
    },

    modal: {
      user_information: {},
      style: "width: 45vw;"
    }
  }),

  async mounted() {
    this.getRoles();
    this.role = this.$user_info.user_role;
  },

  methods: {
    async reset() {
      this.form_data.newRole = "";
      this.form_data.restrictions = [""];
      this.form_data.description = "";
    },

    async editRole(roleDetails) {
      this.$q.loading.show();
      this.$refs.role_modal.showModal();

      this.modal.user_information = roleDetails;
      this.form_data.restrictions = this.modal.user_information.Restrictions;
      this.form_data.newRole = this.modal.user_information.Role;
      this.form_data.description = this.modal.user_information.Description;
      this.$q.loading.hide();
    },

    async view(roleDetails) {
      this.$q.loading.show();
      this.$refs.view_role.showModal();

      this.modal.user_information = roleDetails;
      this.form_data.restrictions = this.modal.user_information.Restrictions;
      this.$q.loading.hide();
    },

    async callAddModal() {
      this.addRole = true;
      this.reset();
    },

    async addNewRole() {
      this.$q.loading.show();
      let res = await this.$_post(AdminAddRole, this.form_data);
      this.$q.loading.hide();

      if (res) {
        this.addRole = false;
        // this.$q.notify({
        //   type: `positive`,
        //   message: `User added successfully.`,
        //   position: "top"
        // });
        this.$q.notify({
            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>User added successfully.</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
        this.data = res.data;
        this.getRoles();
      }
    },

    async getRoles() {
      this.$q.loading.show();
      let res = await this.$_post(postRoleList);
      this.$q.loading.hide();

      if (res) {
        this.table.data = res.data;
        this.reset();
      }
    },

    async removeRole(roleID) {
      this.remove = true;
      this.form_data.role_ID = roleID;
    },

    async confirmRemoveUser() {
      this.$q.loading.show();
      let res = await this.$_post(deleteRole, this.form_data);
      this.$q.loading.hide();
      await this.getRoles();

      if (res) {
        // this.$q.notify({
        //   type: `negative`,
        //   message: `User removed successfully.`,
        //   position: "top"
        // });
        this.$q.notify({
            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>User removed successfully.</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
        this.data = res.data;
      }
    },

    async updateRole(roleInfo) {
      

      this.form_data.role_ID = roleInfo._id;
      this.$q.loading.show();
      let res = await this.$_post(updateRole, this.form_data);
      this.$q.loading.hide();
      console.log(this.form_data)

      if (res) {
        // this.$q.notify({
        //   type: `positive`,
        //   message: `Change have been made.`,
        //   position: "top"
        // });
        this.$q.notify({
            message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Changes have been made.</div>',
            position: 'top',
            color: 'white',
            html: true,
        });
        this.$refs.role_modal.hideModal();
        this.$q.loading.hide();
        this.data = res.data;

        await this.getRoles();
      }
    }
  }
};
</script>
<style>
.add-role-btn {
  background-color: #b5cef5;
}
.fa-eye {
  font-size: 20px;
}

.new-role-container {
  width: 500px;
  padding: 10px 20px 0 20px;
}
.new-role-font {
  font-size: 24px;
}
@media (max-width: 1023px) {
  .new-role-container {
    padding: 10px;
  }
}
</style>
