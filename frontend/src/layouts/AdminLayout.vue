========================================= 
Title: Design 
Author: Pergentino S. Galang II 
Date: 12 Aug 2020 
Contributor:
=========================================

<template>
  <!-- <q-layout view="hHh Lpr lff"> -->
  <q-layout view="lHh LpR lff">
    <!-- Header -->
    <q-header elevated class="text-white header-bg" id="header-index" height-hint="98">
      <q-toolbar>

        <q-toolbar-title class="font-toolbar">
          <q-icon name="img:icons/lexicon07-stroke.png" />
          <span class="q-ml-xs">LEXICONBANK</span>
        </q-toolbar-title>

        <q-btn-dropdown v-if="!left" class="prof-drop" flat no-caps :label="$user_info.email">
          <q-list>

            <q-item
              class="q-pa-sm row text-center"
              v-close-popup
              @click="onItemClick"
              v-if="
                role == 'Administrator' ||
                role == 'Approver' ||
                role == 'Reviewer' ||
                role == 'Read-only'
              "
            >
              <div class="col-12">
                <q-btn class="q-px-lg" flat>Settings</q-btn>
              </div>
            </q-item>

            <q-separator />

            <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
              <div class="col-12">
                <q-btn class="q-px-lg" flat @click="logout()">Logout</q-btn>
              </div>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- <q-toggle v-model="is_view_option" color="white" keep-color /> -->

        <!-- Notification -->
          <!-- <q-btn round icon="notifications">
            <q-badge class="badge-num" color="red" floating>4</q-badge>
          </q-btn> -->
          <!-- <u-q-notification></u-q-notification> -->
      </q-toolbar>
      <!-- end of notification -->

    <!-- tab -->
      <u-q-admin-tab></u-q-admin-tab>
    <!-- end of tab -->
    
    </q-header>
    <!-- end of header -->

    <q-separator />

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- Footer -->
    <!-- <u-q-footer></u-q-footer> -->
    <!-- End of Footer -->
  </q-layout>
</template>

<script>
import { postGetKyc, getNotifications } from "../references/url";
import UQFooter from "../components/Admin/UQFooter";
import UQAdminTab from "../components/Admin/UQAdminTab";
import UQNotification from "../components/UQNotification";
export default {
  components: {
    UQFooter,
    UQAdminTab,
    UQNotification,
  },
  data: () => ({}),
  navigations: [
    {
      label: "Dashboard",
      icon: "img:wallets/wallet-icon.png",
      side: "",
      route: "admin_dashboard",
    },
  ],
  navigations2: [
    // { label: "Profile", icon: "people", side: "", route: "" },
    {
      label: "Settings",
      icon: "settings",
      side: "",
      route: "admin_settings",
    },
    { label: "Logout", icon: "logout", side: "", route: "logout" },
  ],

  methods: {
    goToRoute(route) {
      if (route === "logout") {
        this.$_logout().then(() => {
          this.$router.push({ name: "admin_login" });
        });
      } else {
        route === this.$route.name
          ? (this.drawer = false)
          : this.$router.push({ name: route });
      }
    },
    async logout() {
      this.$_logout();
      this.$router.push({ name: "admin_login" });
    },
    async settings() {
      this.$router.push({ name: "admin_settings" });
    },
    async getKycByUserId(user_id) {
      let res = await this.$_post(postGetKyc, { user_id });
      console.log(res);
      return res.data;
    },
  },

  async mounted() {
    this.role = this.$user_info.user_role;

    if (this.role == "Encoder") {
      this.$router.push({ path: "/admin/admin_add_account" });
    }
  },
};
</script>

<style>
#email-margin {
  padding-top: 50px;
}
#header-index {
  z-index: 9;
}
.active {
  background-color: #e6e6e6;
}
.tab-bg {
  background: white;
  padding: 0;
  font-weight: bold;
  letter-spacing: 1px;
}
.header-bg {
  background: #2f4c7e;
  z-index: 0;
}
.font-toolbar {
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1.5px;
}
.colored {
  color: #2f4c7e;
}

.know-more {
  color: blue;
}
.container-proceed {
  padding: 0px 16px;
  margin-top: 10px;
}
.container-cancel {
  padding: 0px 16px;
}
.btn-proceed {
  background-color: #2f4c7e;
  color: white;
  padding: 3px 50px;
  font-size: 18px;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1px;
}

.btn-cancel {
  font-size: 16px;
  color: #2f4c7e;
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1px;
}

.kyc-icons {
  width: 70px;
  height: 70px;
}

.header-kyc {
  color: #828282;
}
.header-kyc-2 {
  color: #828282;
  padding-bottom: 0;
}
.header-kyc-3 {
  color: #828282;
  padding-top: 0;
}
.header-kyc-3-text {
  padding: 0 30px;
  font-weight: 500;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}

.kyc-p {
  padding-bottom: 0;
  font-weight: 500;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}
.kyc-welcome {
  font-size: 30px;
  padding-top: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: bolder;
}
.kyc-container {
  padding: 0 70px;
}
.vector {
  position: absolute;
  width: 300px;
  height: 300px;
  left: 20px;
  top: 290px;
}
.vector-2 {
  position: absolute;
  width: 300px;
  height: 300px;
  right: 20px;
  bottom: 290px;
}
.badge-num {
  margin-right: 5px;
  margin-top: 5px;
}
.container-view-options {
  padding: 50px 100px 50px 100px;
}
.container-add-funds {
  padding: 100px;
}
.add-funds {
  justify-content: center;
  align-items: center;
}
.pop-up-kyc {
  z-index: 9999999999999999999;
}
</style>

<style>
@media (min-width: 586px) {
  .header-bg {
    z-index: 999999999999999999;
  }
}
@media (max-width: 585px) {
  .header-bg {
    z-index: 99999999999;
  }
}
@media (max-width: 853px) {
  .header-kyc-3-text {
    padding: 10px 0;
  }
  .vector {
    display: none;
  }
  .vector-2 {
    display: none;
  }
  .kyc-container {
    padding: 0 0px;
  }
}
@media (max-width: 1024px) {
  .vector {
    display: none;
  }
  .vector-2 {
    display: none;
  }
  .container-view-options {
    padding: 20px;
  }
}
</style>
