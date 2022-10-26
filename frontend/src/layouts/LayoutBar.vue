=========================================
Title: Design
Author: Gelo
Date: 10 Aug 2020
Contributor: Pergentino
=========================================

<template>
  <q-layout class="main" view="hHh Lpr lFf">
    <q-page-container>
      <q-header elevated class="text-white header-bg" height-hint="98" style="z-index: 9">
        <q-toolbar>
          <!-- <q-btn dense flat round icon="menu" class="burger-btn" @click="left = !left" /> -->

          <q-toolbar-title class="font-toolbar">
            <q-icon name="img:icons/lexicon07-stroke.png" />LEXICONBANK
          </q-toolbar-title>

          <q-btn-dropdown
            v-if="!left"
            no-caps
            fit
            style="border: 1px solid white; border-radius: 10px 10px 0 0"
            class="prof-drop1 text-left"
            flat
            :label="$user_info.full_name"
          >
            <q-list>
              <q-separator />
              <q-list>
                <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
                  <div class="col-12">
                    <q-btn class="q-px-lg" to="/home/dashboard" flat>Dashboard</q-btn>
                  </div>
                </q-item>

                <q-separator />

                <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
                  <div class="col-12">
                    <q-btn class="q-px-lg" to="/home/profile" flat>Profile</q-btn>
                  </div>
                </q-item>

                <q-separator />

                <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
                  <div class="col-12">
                    <q-btn class="q-px-lg" flat @click="logout()">Logout</q-btn>
                  </div>
                </q-item>
              </q-list>
            </q-list>
          </q-btn-dropdown>
          <div>
            <q-item>
              <div>
                <u-q-notification></u-q-notification>
              </div>
            </q-item>
          </div>
        </q-toolbar>
      </q-header>

      <!-- DRAWER -->
      <q-drawer v-model="left" show-else-above>
        <q-list>
          <q-item
            @click.native="$router.push({name: 'dashboard'})"
            class="profile full-width column no-wrap justify-center items-center content-center q-pa-lg"
          >
            <span
              style="padding-top: 50px"
              class="profile-name text-weight-bold"
            >{{$user_info.email}}</span>
            <span class="profile-email">{{$user_info.full_name}}</span>
          </q-item>

          <q-item
            :class="item.route === $route.name ? 'active' : ''"
            clickable
            v-ripple
            v-for="item in $options.navigations"
            @click="goToRoute(item.route)"
            :key="item.label"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon"></q-icon>
            </q-item-section>
            <q-item-section class="nav-label">{{ item.label }}</q-item-section>
            <q-item-section side>
              <!--You can put badge here-->
            </q-item-section>
          </q-item>

          <q-separator />
          <q-item
            :class="item.route === $route.name ? 'active' : ''"
            clickable
            v-ripple
            v-for="item in $options.navigations2"
            @click="goToRoute(item.route)"
            :key="item.label"
          >
            <q-item-section avatar>
              <!-- <q-icon :name="item.icon" ></q-icon> -->
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section class="nav-label">{{ item.label }}</q-item-section>
            <q-item-section side>
              <!--You can put badge here-->
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { getNotifications, updateNotifications } from "../references/url";
import EssentialLink from "components/EssentialLink.vue";
import navigation from "../references/nav";
import UQNotification from "../components/UQNotification";
export default {
  name: "FrontLayout",
  components: { EssentialLink, UQNotification },
  data: () => ({
    link: "inbox",
    package_data: { version: "0.0.0" },
    leftDrawerOpen: false,
    navigation: [],
    left: false,
    count: 2,
  }),
  navigations: [
    {
      label: "Dashboard",
      icon: "img:wallets/wallet-icon.png",
      side: "",
      route: "dashboard",
    },
  ],
  navigations2: [
    { label: "Profile", icon: "people", side: "", route: "" },
    { label: "Logout", icon: "logout", side: "", route: "logout" },
  ],
  mounted() {
    this.navigation = navigation;
  },
  methods: {
    goToRoute(route) {
      if (route === "dashboard") {
        this.$router.push({ name: "dashboard" });
      }
    },
    async logout() {
      this.$_logout();
      this.$router.push({ name: "front_login" });
    },
    async getNotifs() {
      this.form_data.id = this.$user_info._id;
      let res = await this.$_post(getNotifications, this.form_data);
      // console.log(this.form_data)
      // console.log(res)

      if (res) {
        this.$q.loading.hide();
        this.notifList = res.data;

        this.count = this.notifList.filter((x) => x.is_open == false).length;
      }
    },
  },
  async mounted() {
    this.getNotifs();
  },
};
</script>
<style>
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
.menu-notif-bar {
  width: 350px;
  height: auto;
  background: white;
}
.header-bg {
  background: #2f4c7e;
}
.font-toolbar {
  font-family: "Bebas Neue", cursive;
  letter-spacing: 1.5px;
}
.colored {
  color: #2f4c7e;
}
</style>