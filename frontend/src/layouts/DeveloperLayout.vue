=========================================
Title: Design
Author: Gelo
Date: 10 Aug 2020
Contributor: Pergentino
=========================================

<template>
  <q-layout view="lHh LpR lff">
    <q-header elevated class="text-white header-bg" height-hint="98" style="z-index: 9">
      <q-toolbar>
        <!-- sidenav -->
        <!-- <q-btn dense flat round icon="menu" class="burger-btn" @click="left = !left" /> -->

        <q-toolbar-title class="font-toolbar">
          <a @click="$router.push({name: 'dashboard'})" style="cursor: pointer !important">
            <q-icon
              name="img:icons/lexicon07-stroke.png"
              class="icon-rotate"
              style="cursor: pointer !important"
            />
            <span class="q-ml-xs">LEXICONBANK</span>
          </a>
        </q-toolbar-title>

        <div class="q-px-sm font-raleway prof-drop">
          <b>Developer</b>
        </div>

        <q-btn-dropdown
          v-if="!left"
          style="float: left;"
          :label="$user_info.full_name"
          flat
          no-caps
        >
          <q-list>
            <q-separator />

            <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
              <div class="col-12">
                <q-btn class="q-px-lg full-width" flat @click="logout()">Logout</q-btn>
              </div>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>

      <!-- NAVBAR -->
      <div class="text-center">
        <q-tabs no-caps indicator-color="transparent" outside-arrows mobile-arrows>
          <q-tab
            @click.native="$router.push({name: 'developer_dashboard'})"
            :class="$route.name === 'developer_dashboard' ? 'btn-indicate': ''"
          >
            <q-icon size="50px" name="img:wallets/wallet-icon.png"></q-icon>
            <span class="font-monseratt text-bold">Super Admin</span>
          </q-tab>

          <q-tab
            @click.native="$router.push({name: 'developer_database'})"
            :class="$route.name === 'developer_database' ? 'btn-indicate': ''"
            class="q-px-lg"
          >
            <q-icon size="50px" name="img:wallets/add-fund-icon.png"></q-icon>
            <span class="font-monseratt text-bold">Database</span>
          </q-tab>
        </q-tabs>
      </div>
      <!-- END OF NAVBAR -->
    </q-header>

    <q-separator />

    <q-tab-panels v-model="tab" id="tab-panels-container" animated></q-tab-panels>
    <q-page-container style="margin-top: -130px">
      <router-view />
    </q-page-container>

    <u-q-footer></u-q-footer>
  </q-layout>
</template>

<script>
import UQFooter from "../components/Admin/UQFooter";
export default {
  components: {
    UQFooter,
  },
  data: () => ({
    form_data: {
      id: "",
    },
    tab: "mails",
    left: false,
  }),
  computed: {},

  async mounted() {},

  methods: {
    async logout() {
      this.$_logout();
      this.$router.push({ name: "developer_login" });
    },
  },
};
</script>

<style>
.icon-rotate {
  transition: transform 2s;
}
.icon-rotate:hover {
  transform: rotate(900deg);
}
.btn-indicate {
  border-bottom: 3px solid #fff;
  transition: 0.5s;
}
.btn-indicate2 {
  border-right: 3px solid #2f4c7e;
  transition: 0.5s;
}
#kyc-popup-card {
  width: 700px;
  max-width: 80vw;
}
#drawer-avatar {
  padding: 30px 50px;
  width: 200px;
  height: 200px;
}
#tab-panels-container {
  background: transparent;
  margin-top: 150px;
  z-index: -9;
}
#dropdwn-ico {
  font-size: 14px;
}
#item-column-notif {
  height: 100%;
  margin-top: 58px;
  z-index: 8;
  max-width: 350px;
}
#item-btn-read {
  font-size: 14px;
  min-width: 202px;
}
#item-label-notif {
  letter-spacing: 1px;
  font-size: 25px;
}
#item-notif {
  position: fixed;
  z-index: 9;
  background: white;
  min-width: 350px;
  border-bottom: 1px solid #aaa;
}
.menu-notif {
  width: 350px;
  height: auto;
  background: white;
}
.send-disabled {
  opacity: 0.5;
}
.active {
  background: #e6e6e6;
}
.tab-bg {
  background: white;
  padding: 0;
  font-family: "Montserrat", sans-serif;
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
}

.btn-cancel {
  font-size: 16px;
  color: #2f4c7e;
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
  .prof-drop {
    display: none;
  }
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
  /* .container-view-options {
    padding: 20px;
  } */
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background-color: grey;
}
</style>