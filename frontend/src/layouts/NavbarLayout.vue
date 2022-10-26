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
          <q-icon name="img:icons/lexicon07-stroke.png" class="icon-rotate" style="cursor: pointer !important"/><Span class="q-ml-xs">LEXICONBANK</span>
          </a>
        </q-toolbar-title>

          <div class="q-px-sm font-raleway prof-drop">
            <b>Welcome</b>
          </div>
        <q-btn-dropdown
          v-if="!left"
          style="float: left; border: 1px solid white; border-radius: 10px 10px 0 0"
          flat
          fit
          dense
          no-caps
          class="q-px-sm"
          :label="$user_info.full_name"
        >
          <q-list>
            <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
              <div class="col-12">
                <q-btn :to="$wallet.kyc_status == 'APPROVED' ? '/home/profile' : '' " class="q-px-lg full-width" flat>Profile</q-btn>
              </div>
            </q-item>

            <q-separator />

            <q-item class="q-pa-sm row text-center" v-close-popup @click="onItemClick">
              <div class="col-12">
                <q-btn class="q-px-lg full-width" flat @click="logout()">Logout</q-btn>
              </div>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- <q-toggle v-model="is_view_option" color="white" keep-color /> -->

        <!-- Notification -->
        <u-q-notification></u-q-notification>
      </q-toolbar>

      <!-- NAVBAR -->
      <div class="text-center">
        <q-tabs no-caps indicator-color="transparent" outside-arrows mobile-arrows>
          <q-tab  
          @click.native="$router.push({name: 'dashboard'})" 
          :class="$route.name === 'dashboard' ? 'btn-indicate': ''">
          <q-icon size="50px" name="img:wallets/wallet-icon.png"></q-icon>
          <span class="font-monseratt text-bold">Dashboard</span>
          </q-tab>

        <q-tab
          @click.native="$router.push({name: 'deposit'})" 
          :class="$route.name === 'deposit' ? 'btn-indicate': ''"
          class="q-px-lg"
        >
            <q-icon size="50px" name="img:wallets/add-fund-icon.png"></q-icon>
          <span class="font-monseratt text-bold">Deposit</span>
        </q-tab>

        
         
        <!-- fund transfer -->
        <div v-if="!$wallet.is_account_locked && $wallet.kyc_status == 'APPROVED'"
        >
          <q-tab 
          :class="$route.name === 'transfer-fund'  || $route.name === 'wire-transfer' ? 'btn-indicate': '' "> <q-icon size="50px" name="img:wallets/fund-transfer.png" ></q-icon>
          <span class="font-monseratt text-bold">Fund Transfer</span>
                   <q-menu fit>
                      <div class="column">
            <div class="col">
        <q-btn flat
          @click.native="$router.push({name: 'transfer-fund'})" 
          :class="$route.name === 'transfer-fund' ? 'btn-indicate2': ''"
        >
        <div class="column">
        <div class="col">
        <q-icon size="50px" name="img:wallets/cash-out-icon.png"></q-icon>
        </div>
        <div class="col">
          <span class="font-monseratt text-bold">Transfer Fund</span>
        </div>
        </div>
        </q-btn>
        </div>
      <q-separator />
        <q-btn flat
          @click.native="$router.push({name: 'wire-transfer'})" 
          :class="$route.name === 'wire-transfer' ? 'btn-indicate2': ''"
        >
        <div class="column">
          <div class="col">
        <q-icon size="50px" name="img:wallets/wire-transfer-transaction1.png"></q-icon>
          </div>
          <div class="col">
          <span class="font-monseratt text-bold">Wire Transfer</span>
          </div>
        </div>
        </q-btn>
          </div>
            </q-menu>
          </q-tab>
        </div>
        
        <!-- if else -->
        <div v-else>
          <q-tab> 
            <q-icon size="50px" name="img:wallets/fund-transfer.png" ></q-icon>
          <span class="font-monseratt text-bold">Fund Transfer</span>
            <q-menu>
              <div class="column">
                <div class="col">
          <q-btn flat
          @click.native="$router.push({name: ''})" 
          disabled
          >
             <div class="column">
        <div class="col">
        <q-icon size="50px" name="img:wallets/cash-out-icon.png"></q-icon>
        </div>
        <div class="col">
          <span class="font-monseratt text-bold">Transfer Fund</span>
        </div>
        </div>
          </q-btn>
                </div>
                <q-separator />
                <div class="col">
          <q-btn flat
            @click.native="$router.push({name: ''})" 
            disabled
          >
          <div class="column">
          <div class="col">
        <q-icon size="50px" name="img:wallets/wire-transfer-transaction1.png"></q-icon>
          </div>
          <div class="col">
          <span class="font-monseratt text-bold">Wire Transfer</span>
          </div>
        </div>
          </q-btn>
                </div>
              </div>
            </q-menu>
          </q-tab>
        </div>
        <!-- end of fund transfer -->

        <q-tab
          @click.native="$router.push({name: 'convert'})" 
          :class="$route.name === 'convert' ? 'btn-indicate': ''"
          class="q-px-lg"
        ><q-icon size="50px" name="img:wallets/convert.png"></q-icon>
          <span class="font-monseratt text-bold">Convert</span>
        </q-tab>

        <!-- hedge fund -->
          <q-tab 
            v-if="!$wallet.is_account_locked && $wallet.kyc_status == 'APPROVED'"
            @click.native="$router.push({name: 'hedgefund'})" 
            :class="$route.name === 'hedgefund' ? 'btn-indicate': ''"
            class="q-px-sm"
          ><q-icon size="50px" name="img:wallets/hedge-fund.png"></q-icon>
          <span class="font-monseratt text-bold">Hedge Fund</span>
          </q-tab>
          <q-tab v-else
             :class="$route.name === 'hedgefund' ? 'btn-indicate': ''"
            class="q-px-sm"
            @click.native="$router.push({name: ''})"
            disabled
          >
           <q-icon size="50px" name="img:wallets/hedge-fund.png"></q-icon>
          <span class="font-monseratt text-bold">Hedge Fund</span>
          </q-tab>
        <!-- end of hedge fund -->

        <q-tab 
          @click.native="$router.push({name: 'history'})" 
          :class="$route.name === 'history' ? 'btn-indicate': ''" class="q-px-lg"
        ><q-icon size="50px" name="img:wallets/status.png"></q-icon>
          <span class="font-monseratt text-bold">History</span>
        </q-tab>

        <!-- Other Routes -->
        <div>
        <q-tab  :class="$route.name === 'visa_card'  || $route.name === 'add_account' || $route.name === 'transaction' || $route.name === 'transaction_reports' ? 'btn-indicate': '' " class="q-px-lg">
          <q-icon class="q-mt-sm" size="40px" name="img:wallets/more.png"></q-icon>
          <span class="font-monseratt text-bold q-mt-xs">More</span>
          <q-menu fit>
            <div class="column">
              <div class="col">
        <q-btn flat
          @click.native="$router.push({name: 'visa_card'})" 
          :class="$route.name === 'visa_card' ? 'btn-indicate2': ''"
          class="full-width"
        ><div class="column">
          <div class="col">
        <q-icon size="50px" name="img:wallets/req.png"></q-icon>
          </div>
          <div class="col">
          <span class="font-monseratt text-bold">Visa Card</span>
          </div>
          </div>
        </q-btn>
              </div>
        <q-separator />
          <div class="col">
        <q-btn flat
          @click.native="$router.push({name: 'add_account'})" 
          :class="$route.name === 'add_account' ? 'btn-indicate2': ''"
          class="full-width"
        ><div class="column">
          <div class="col">
        <q-icon size="40px" name="img:wallets/user.png"></q-icon>
          </div>
          <div class="col">
          <span class="font-monseratt text-bold">Add Account</span>
          </div>
          </div>
        </q-btn>
          </div>
        <q-separator />
        <div class="col">
        <q-btn flat
          @click.native="$router.push({name: 'transaction'})" 
          :class="$route.name === 'transaction' ? 'btn-indicate2': ''"
          class="full-width"
        ><div class="column">
          <div class="col">
        <q-icon size="50px" name="img:wallets/manage-transaction.png"></q-icon>
          </div>
          <div class="col">
          <span class="font-monseratt text-bold">Transaction</span>
          </div>
          </div>
        </q-btn>
        </div>      
              <q-separator />
          <div class="col">
        <q-btn flat
          @click.native="$router.push({name: 'transaction_reports'})" 
          :class="$route.name === 'transaction_reports' ? 'btn-indicate2': ''"
          class="full-width"
        ><div class="column">
          <div class="col">
        <q-icon size="40px" name="img:wallets/transaction-reports.png"></q-icon>
          </div>
          <div class="col">
          <span class="font-monseratt text-bold">Transaction Reports</span>
          </div>
          </div>
        </q-btn>
        </div>
            </div>
          </q-menu>
        </q-tab>
        </div>
        </q-tabs>
        </div>
    <!-- END OF NAVBAR -->

      <!-- tabs -->
      <!-- <q-tabs
        v-model="tab"
        align="center"
        no-caps
        indicator-color="accent"
        active-color="accent"
        class="tab-bg text-black"
        isShown="true"
        v-if="!left"
      >
        <q-route-tab class="q-mx-md" to="/home/dashboard">
          <q-icon size="50px" name="img:wallets/wallet-icon.png" />
          <q-label class>Dashboard</q-label>
        </q-route-tab>

        <q-route-tab class="q-px-lg" to="/home/deposit">
          <q-icon size="50px" name="img:wallets/add-fund-icon.png" />
          <q-label class>{{ is_fiat ? 'Deposit' : 'Receive'}}</q-label>
        </q-route-tab>

          <q-btn no-caps flat class="q-mx-sm q-py-md">
            <div class="column">
              <div class="col">
                <q-icon :class="{'send-disabled': $wallet.is_account_locked || $wallet.kyc_status == '' || $wallet.kyc_status == 'REJECTED' }" size="53px" name="img:wallets/fund-transfer.png" />
              </div>
              <div class="col">
                <q-label class>
                  <b>Fund Transfer</b>
                </q-label>
              </div>
            </div>
            <q-menu>
              <div class="q-pa-sm" v-if="$wallet.is_account_locked == false && $wallet.kyc_status == 'APPROVED'">
                <q-btn class="q-mx-sm" @click.native="$router.push({name: 'wire-transfer'})">
                  <q-icon size="60px" name="img:wallets/wire-transfer-transaction1.png" />
                  <q-label style="font-size: 12px">Wire Transfer</q-label>
                </q-btn>

                <q-btn class="q-mx-sm" @click.native="$router.push({name: 'transfer-fund'})">
                  <q-icon size="53px" name="img:wallets/cash-out-icon.png" />
                  <q-label style="font-size: 12px">{{ is_fiat ? 'Transfer Fund' : 'Send'}}</q-label>
                </q-btn>
              </div>

              <div class="q-pa-sm" v-else>
                <q-route-tab class="q-mx-sm" to="">
                  <q-icon class="send-disabled" size="60px" name="img:wallets/wire-transfer-transaction1.png" />
                  <q-label style="font-size: 12px">Wire Transfer</q-label>
                </q-route-tab>

                <q-route-tab class="q-mx-sm" to="">
                  <q-icon class="send-disabled" size="53px" name="img:wallets/cash-out-icon.png" />
                  <q-label style="font-size: 12px">{{ is_fiat ? 'Transfer Fund' : 'Send'}}</q-label>
                </q-route-tab>
              </div>
            </q-menu>
          </q-btn>

        <q-route-tab class name="convert" to="/home/convert">
          <q-icon size="50px" class="q-mx-lg" name="img:wallets/convert.png" />
          <q-label id="dropdwn-ico">Convert</q-label>
        </q-route-tab>

        <q-route-tab class name="hedge" :to="!$wallet.is_account_locked && $wallet.kyc_status == 'APPROVED' ? '/home/hedgefund' : '' ">
          <q-icon class="q-mt-sm q-pt-md" :class="{'send-disabled': $wallet.is_account_locked || $wallet.kyc_status == '' || $wallet.kyc_status == 'PENDING' || $wallet.kyc_status == 'REJECTED' }" size="50px" name="img:wallets/hedge-fund.png" />
          <q-label class="q-mb-lg" id="dropdwn-ico">Hedge Fund</q-label>
        </q-route-tab>

        <q-route-tab class="q-mx-md" to="/home/history">
          <q-icon class="q-mt-md q-mx-lg" size="50px" name="img:wallets/status.png" />
          <q-label class="q-mb-md">Transaction History</q-label>
        </q-route-tab>

        <q-btn flat class="q-mx-sm q-py-md q-px-md" name="hedge">
          <div class="column">
            <div class="col">
              <q-icon size="45px" name="img:wallets/more.png" />
            </div>
              <div class="col">
               <q-label class>
                <b>More</b>
              </q-label>
            </div>
          </div>
          <q-menu>
            <q-tabs vertical no-caps indicator-color="accent" active-color="accent">
              <q-route-tab name="visacard" to="/home/visacard">
                <q-icon size="70px" class="q-pt-md" name="img:wallets/req.png" />
                <q-label id="dropdwn-ico">Req. Visa Card</q-label>
              </q-route-tab>

              <q-route-tab class name="account" to="/home/add/account">
                <q-icon size="50px" class="q-pt-md" name="img:wallets/user.png" />
                <q-label class="q-pt-md" id="dropdwn-ico">Accounts</q-label>
              </q-route-tab>

              <q-route-tab class name="manage" to="/home/transaction">
                <q-icon size="50px" class="q-pt-md" name="img:wallets/manage-transaction.png" />
                <q-label class="q-pt-md" id="dropdwn-ico">Manage Transaction</q-label>
              </q-route-tab>

              <q-route-tab class name="transaction_reports" to="/home/transaction/reports">
                <q-icon size="50px" class="q-pt-md" name="img:wallets/manage-transaction.png" />
                <q-label class="q-pt-md" id="dropdwn-ico"> Transaction Reports</q-label>
              </q-route-tab>
            </q-tabs>
          </q-menu>
        </q-btn>
      </q-tabs> -->
    </q-header>

    <q-separator />

    <q-tab-panels v-model="tab" id="tab-panels-container" animated></q-tab-panels>

    <!-- DRAWER -->
    <q-drawer v-model="left" show-else-above>
      <q-list>
        <q-avatar @click.native="$router.push({name: 'settings'})" id="drawer-avatar">
          <img
            :src="`https://${server.host}/user/${$user_info._id}/images/${$user_info.kyc.selfie_image_path}`"
          />
        </q-avatar>

        <q-item
          @click.native="$router.push({name: 'settings'})"
          class="profile full-width column no-wrap justify-center items-center content-center q-pa-lg"
        >
          <span style="padding-top: 50px" class="profile-name text-weight-bold">{{$user_info.email}}</span>
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
            <q-icon size="35px" :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section class="nav-label">{{ item.label }}</q-item-section>
          <q-item-section side>
            <!--You can put badge here-->
          </q-item-section>
        </q-item>
        <q-expansion-item
          expand-separator
          icon="img:wallets/fund-transfer.png"
          label="Fund Transfer"
        >
          <q-item
            :class="item.route === $route.name ? 'active' : ''"
            clickable
            v-ripple
            v-for="item in $options.navigations_expands_2"
            @click="goToRoute(item.route)"
            :key="item.label"
          >
            <q-item-section avatar>
              <q-icon size="35px" :name="item.icon"></q-icon>
            </q-item-section>
            <q-item-section class="nav-label">{{ item.label }}</q-item-section>
            <q-item-section side>
              <!--You can put badge here-->
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item
          :class="item.route === $route.name ? 'active' : ''"
          clickable
          v-ripple
          v-for="item in $options.navigations3"
          @click="goToRoute(item.route)"
          :key="item.label"
        >
          <q-item-section avatar>
            <q-icon size="35px" :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section class="nav-label">{{ item.label }}</q-item-section>
          <q-item-section side>
            <!--You can put badge here-->
          </q-item-section>
        </q-item>
        <q-expansion-item expand-separator icon="img:wallets/more.png" label="More...">
          <q-item
            :class="item.route === $route.name ? 'active' : ''"
            clickable
            v-ripple
            v-for="item in $options.navigations_expands"
            @click="goToRoute(item.route)"
            :key="item.label"
          >
            <q-item-section avatar>
              <q-icon size="35px" :name="item.icon"></q-icon>
            </q-item-section>
            <q-item-section class="nav-label">{{ item.label }}</q-item-section>
            <q-item-section side>
              <!--You can put badge here-->
            </q-item-section>
          </q-item>
        </q-expansion-item>

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

    <!-- Popup -->
    <div class="pop-up-kyc">
      <q-dialog v-model="alert" persistent>
        <q-card style="border-radius: 10px" id="kyc-popup-card" class="kyc-container">
          <q-card-section class="header-kyc">
            <div class="text-center">
              <p class="text-h6 text-center kyc-p kyc-welcome">Welcome!</p>
            </div>

            <p class="text-h6 text-center kyc-p">
              Verify your account now.
              <br />Get verified with Lexicon and enjoy the full benefits of the platform.
            </p>
          </q-card-section>

          <q-card-section class="q-pt-none text-center header-kyc-2">
            <div class="row">
              <div class="col-12 col-md-4">
                <img src="kyc-icons/CashOut.png" alt="icon" class="kyc-icons" />
                <p class="text-h6 kyc-p">Cash out</p>
              </div>
              <div class="col-12 col-md-4">
                <img src="kyc-icons//lexicontoken.png" alt="icon" class="kyc-icons" />
                <p class="text-h6 kyc-p">Lexicon Token</p>
              </div>
              <div class="col-12 col-md-4">
                <img src="kyc-icons/HigherTransactioon.png" alt="icon" class="kyc-icons" />
                <p class="text-h6 kyc-p">Higher Transaction Limit</p>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="header-kyc-3">
            <div
              class="text-h6 text-center header-kyc-3-text"
            >If so, verify your ID. It only takes a few minutes to answer these basic questions, and upload an ID.</div>
          </q-card-section>
          <div class="q-mt-lg q-mb-md text-center container-proceed">
            <q-btn
              rounded
              type="submit"
              class="btn-proceed"
              @click="$router.push({name: 'kyc_personal_information'})"
              unelevated
            >PROCEED</q-btn>
          </div>
          <div class="q-mt-md q-mb-lg container-cancel">
            <q-btn
              type="submit"
              class="full-width btn-cancel"
              v-close-popup
              unelevated
              no-caps
            >Dismiss</q-btn>
          </div>
        </q-card>
        <img src="kyc-icons/tao.png" alt="icon" class="vector" />
        <img src="kyc-icons/tao-2.png" alt="icon" class="vector-2" />
      </q-dialog>
    </div>

    <q-page-container style="margin-top: -130px">
      <router-view />
    </q-page-container>

    <u-q-footer></u-q-footer>
  </q-layout>
</template>

<script>
import {
  postGetKyc,
  getNotifications,
  updateNotifications,
  postWalletDetailsOptions,
} from "../references/url";
import config from "../../config";
import UQFooter from "../components/Admin/UQFooter";
import UQDashboard from "../components/UQDashboard";
import UQWalletViewOptions from "../components/UQWalletViewOptions";
import UQNotification from "../components/UQNotification";
import UQAddFundsVTwo from "../components/UQAddFundsVTwo";
import UQWalletAddFundsHistory from "../components/UQWalletAddFundsHistory";
import UQWalletHistory from "../components/UQWalletHistory";
// import Routes from "../router/routes";

export default {
  components: {
    UQDashboard,
    UQFooter,
    UQWalletViewOptions,
    UQAddFundsVTwo,
    UQWalletAddFundsHistory,
    UQWalletHistory,
    UQNotification,
  },
  data: () => ({
    // routes: Routes[6].children,
    form_data: {
      id: "",
    },
    is_view_option: null,
    tab: "mails",
    left: false,
    slide: 1,
    autoplay: true,
    is_account_locked: false,
    wallet_details: [],
    conversion: {},
    kyc_status: "",
    total_wallet: 0,
    //  tab: 'dashboard',
    currency: "USD",
    link: "inbox",
    alert: false,
    count: 0,
    server: {
      host: config.SERVER.HOST,
      port: config.SERVER.PORT,
    },
    // is_fiat: true,
    step: 1,
  }),
  navigations: [
    {
      label: "Dashboard",
      icon: "img:wallets/wallet-icon.png",
      side: "",
      route: "dashboard",
    },
    {
      label: "Deposit",
      icon: "img:wallets/add-fund-icon.png",
      side: "",
      route: "deposit",
    },
  ],
  navigations_expands_2: [
    {
      label: "Transfer Funds",
      icon: "img:wallets/cash-out-icon.png",
      side: "",
      route: "transfer-fund",
    },
    {
      label: "Wire Transfer",
      icon: "img:wallets/wire-transfer-transaction1.png",
      side: "",
      route: "wire-transfer",
    },
  ],
  navigations3: [
    {
      label: "Convert",
      icon: "img:wallets/convert.png",
      side: "",
      route: "convert",
    },
    {
      label: "Hedge Fund",
      icon: "img:wallets/hedge-fund.png",
      side: "",
      route: "hedgefund",
    },
    {
      label: "Transaction History",
      icon: "img:wallets/status.png",
      side: "",
      route: "history",
    },
  ],
  navigations_expands: [
    {
      label: "Request Visa Card",
      icon: "img:wallets/req.png",
      side: "",
      route: "visa_card",
    },
    {
      label: "Accounts",
      icon: "img:wallets/user.png",
      side: "",
      route: "add_account",
    },
    {
      label: "Manage Transaction",
      icon: "img:wallets/manage-transaction.png",
      side: "",
      route: "transaction",
    },
  ],
  navigations2: [
    { label: "Profile", icon: "people", side: "", route: "settings" },
    { label: "Logout", icon: "logout", side: "", route: "logout" },
  ],
  computed: {
    // is_fiat() {
    //   return this.$store.state.user.is_fiat;
    // },
  },

  async beforeMount() {
    await this.viewWalletOptions();
    await this.saveState();
  },

  async mounted() {
    this.$q.loading.show();
    if (this.$user_info != null) 
    {
      let kyc = await this.getKycByUserId(this.$user_info._id);
      this.step = kyc.step;

      if (this.step >= 6) 
      {
        this.alert = false;
      } else {
        this.alert = true;
      }
    }
    this.$q.loading.hide();
  },

  methods: {
    goToRoute(route) {
      if (route === "logout") {
        this.$_logout().then(() => {
        this.$router.push({ name: "front_login" });
        });
      } else if (route === "deposit") {
        route === this.$route.name
          ? (this.drawer = false)
          : this.$router.push({
              name: route,
              params: { currency: this.selected_currency },
            });
      } else {
        route === this.$route.name
          ? (this.drawer = false)
          : this.$router.push({ name: route });
      }
    },
    async fromWalletViewOptions(currency) {
      // alert(currency);
      this.currency = currency;
    },
    async logout() {
      this.$_logout();
      this.$router.push({ name: "front_login" });
    },
    async getKycByUserId(user_id) {
      let res = await this.$_post(postGetKyc, { user_id });
      return res.data;
    },

    // async getNotifs() {
    //   this.form_data.id = this.$user_info._id;
    //   let res = await this.$_post(getNotifications, this.form_data);

    //   if (res) {
    //     this.$q.loading.hide();
    //     this.notifList = res.data;

    //     this.count = this.notifList.filter((x) => x.is_open == false).length;
    //   }
    // },

    async viewWalletOptions() {
      let res = await this.$_post(postWalletDetailsOptions)
      this.wallet_details    = res.data.wallet;
      this.is_account_locked = res.data.is_account_locked;
      this.conversion        = res.data.conversion;
      this.kyc_status        = res.data.kyc_status;

      this.total_wallet = 0;
      for (let i = 0; i < this.wallet_details.length; i++) {
        if (this.wallet_details[i].currency == "USD") {
          this.total_wallet +=
            this.wallet_details[i].balance /
            10 ** this.wallet_details[i].decimal_places;
        } else {
          this.total_wallet +=
            (this.wallet_details[i].balance /
              10 ** this.wallet_details[i].decimal_places) *
            this.conversion[this.wallet_details[i].currency];
        }
      }
    },

    async saveState() {
      this.$store.state.user.wallet = await {
        dashboard:        this.wallet_details,
        conversion:       this.conversion,
        total_balance:    this.total_wallet,
        is_account_locked:this.is_account_locked,
        kyc_status:       this.kyc_status,
      };
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