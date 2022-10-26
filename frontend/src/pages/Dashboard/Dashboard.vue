<template>
  <div>
    <!-- <u-q-wallet-view-options></u-q-wallet-view-options> -->
    <div class="container-dashboard">
      <div id="welcome-location">
        <q-card class="dashboard__container">
          <div class="row">
            <div class="col-12">
              <div class="row font-raleway centering__txt">
                <div class="q-py-md col-sm-2 col-12 border__size">
                  <div
                    id="border__time"
                    class="text-white time__text q-ml-sm q-mr-sm flag__newyork"
                  >
                    <span class="font-raleway title__country">
                      NewYork
                      <br />
                    </span>
                    <span class="font-orbitron text-weight-bold">
                       <div style="font-size: 13px">{{ newyork_day }}</div>
                      <span class="time__country">{{ newyork_gmt }}</span>
                    </span>
                  </div>
                </div>

                  <div class="q-py-md col-sm-2 col-12 border__size">
                  <div id="border__time" class="text-white time__text q-mx-sm flag__london">
                    <span class="font-raleway title__country">
                      London
                      <br />
                    </span>
                    <span class="font-orbitron text-on-right text-weight-bold">
                       <div style="font-size: 13px">{{ london_day }}</div>
                      <span class="time__country">{{ london_gmt }}</span>
                    </span>
                  </div>
                </div>

                <div class="q-py-md col-sm-2 col-12 border__size">
                  <div id="border__time" class="text-white time__text q-mx-sm flag__paris">
                    <span class="font-raleway title__country">
                      Paris
                      <br />
                    </span>
                    <span class="font-orbitron text-on-right text-weight-bold">
                       <div style="font-size: 13px">{{ paris_day }}</div>
                      <span class="time__country">{{ paris_gmt }}</span>
                    </span>
                  </div>
                </div>

                <div class="q-py-md col-sm-2 col-12 border__size">
                  <div id="border__time" class="text-white time__text q-mx-sm flag__singapore">
                    <span class="font-raleway title__country">
                      Singapore
                      <br />
                    </span>
                    <span class="font-orbitron text-on-right text-weight-bold">
                       <div style="font-size: 13px">{{ singapore_day }}</div>
                      <span class="time__country">{{ singapore_gmt }}</span>
                    </span>
                  </div>
                </div>
                <div class="q-py-md col-sm-2 col-12 border__size">
                  <div id="border__time" class="text-white time__text q-mr-sm q-ml-sm flag__tokyo">
                    <span class="font-raleway title__country">
                      Tokyo
                      <br />
                    </span>
                    <span class="font-orbitron text-on-right text-weight-bold">
                       <div style="font-size: 13px">{{ tokyo_day }}</div>
                     <span class="time__country">{{ tokyo_gmt }}</span>
                    </span>
                  </div>
                </div>

                <!-- <q-space></q-space>
              <q-toggle v-model="is_view_option" color="accent" keep-color unchecked-icon="list">
                <q-tooltip>Click to Tab view</q-tooltip>
                </q-toggle>-->
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div v-if="!is_view_option">
        <div class="row justify-around" id="first-option">
          <div class="col-12 col-md-6">
          <div id="padding-mobile" class="q-pr-md q-pt-md q-pb-md" >
              <u-q-wallet-view-options></u-q-wallet-view-options>
            </div>
            <div class="deposit__history__desktop">
              <div class="q-pr-md">
                <u-q-wallet-add-funds-history></u-q-wallet-add-funds-history>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 q-mt-md">
            <div class="row">
               <div
                class="col-12 q-mb-md dashboard__container"
                style="background: white;"
              >
                <krypto></krypto>
              </div>
              <div
                class="col-12 q-mb-md dashboard__container"
                style="background: white;"
              >
                <hedge-fund></hedge-fund>
              </div>
               <div
                class="col-12 q-mb-md deposit__history__mobile"
              >
                 <div>
                <u-q-wallet-add-funds-history></u-q-wallet-add-funds-history>
              </div>
              </div>
              <div class="col-12">
                <q-card class="my-card dashboard__container">
                  <q-card-section>
                    <q-carousel
                      style="height: 300px; border-radius: 20px"
                      animated
                      v-model="slide"
                      infinite
                      :autoplay="autoplay"
                      swipeable
                      transition-prev="slide-right"
                      transition-next="slide-left"
                      @mouseenter="autoplay = false"
                      @mouseleave="autoplay = true"
                    >
                      <q-carousel-slide :name="1" img-src="offices/1.png" />
                      <q-carousel-slide :name="2" img-src="offices/2.png" />
                    </q-carousel>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="row justify-around" id="first-option">
          <div class="col-12 col-md-6 q-mb-md">
            <q-card-section>
              <u-q-dashboard></u-q-dashboard>
            </q-card-section>
            <div>
              <q-card-section>
                <u-q-wallet-add-funds-history></u-q-wallet-add-funds-history>
              </q-card-section>
            </div>
          </div>
          <div class="col-12 col-md-6 q-mt-md">
            <div class="row">
              <div
                class="col-12 q-mb-md cont-shadows"
                style="background: white; border-radius: 30px"
              >
                <hedge-fund></hedge-fund>
              </div>
              <div class="col-12">
                <q-card class="my-card" style="border-radius: 30px">
                  <q-card-section>
                    <q-carousel
                      style="height: 300px; border-radius: 20px"
                      animated
                      v-model="slide"
                      infinite
                      :autoplay="autoplay"
                      swipeable
                      transition-prev="slide-right"
                      transition-next="slide-left"
                      @mouseenter="autoplay = false"
                      @mouseleave="autoplay = true"
                    >
                      <q-carousel-slide :name="1" img-src="offices/1.png" />
                      <q-carousel-slide :name="2" img-src="offices/2.png" />
                    </q-carousel>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-pl-md q-pr-xl">
          <div class="col-12 col-md-6">
            <u-q-crypto-wallet></u-q-crypto-wallet>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UQDashboard from "../../components/UQDashboard";
import UQWalletViewOptions from "../../components/UQWalletViewOptions";
import UQWalletReceive from "../../components/UQWalletReceive";
import HedgeFund from "../Dashboard/hedgefund";
import krypto from "../Dashboard/krypto";
import UQWalletAddFundsHistory from "../../components/UQWalletAddFundsHistory";
import UQCryptoWallet from "../../components/Crypto/UQCryptoWallet";
import moment from "moment-timezone";

export default {
  data: () => ({
    is_view_option: false,
    slide: 1,
    autoplay: true,
    alert: false,
    tokyo_gmt: "",
    singapore_gmt: "",
    paris_gmt: "",
    london_gmt: "",
    newyork_gmt: "",

    paris_day: "",
    singapore_day: "",
    london_day: "",
    tokyo_day: "",
    newyork_day: "",
    step: "",
  }),
  created() {
    setInterval(this.getNow, 1000);
  },

  methods: {
    getNow: function () {
      const today = new Date();

      this.newyork_day = moment( today ).tz("America/New_York").format('dddd');
      this.paris_day = moment( today ).tz("Europe/Paris").format('dddd');
      this.london_day = moment( today ).tz("Europe/London").format('dddd');
      this.singapore_day = moment( today ).tz("Asia/Singapore").format('dddd');
      this.tokyo_day = moment( today ).tz("Asia/Tokyo").format('dddd');

      this.newyork_gmt = moment( today ).tz("America/New_York").format('HH:mm');
      this.london_gmt = moment( today ).tz("Europe/London").format('HH:mm');
      this.singapore_gmt = moment( today ).tz("Asia/Singapore").format('HH:mm');
      this.tokyo_gmt = moment( today ).tz("Asia/Tokyo").format('HH:mm');
      this.paris_gmt = moment( today ).tz("Europe/Paris").format('HH:mm');
    },

  },
  
  components: {
    UQDashboard,
    HedgeFund,
    UQWalletViewOptions,
    UQWalletReceive,
    UQWalletAddFundsHistory,
    UQCryptoWallet,
    krypto,
  },

  async mounted(){
    if (this.step >= 6) {
      this.alert = false;
    } else {
      this.alert = true;
    }
    
    this.role = this.$user_info.user_role;

    if(this.role == "Encoder"){
      this.$router.push({ path: "/admin/admin_add_account" });
    }
  },

  computed: {

  }
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap');


.dashboard__container {
  border-radius: 30px;
  border: 2px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
.dashboard__container:hover {
   box-shadow: 0px 0px 10px 0.5px #2f4c7e;
}


.container-dashboard {
  padding: 0px 80px;
}
.title__country
{
  font-size: 19px;
}
.time__country
{
  font-size: 19px;
}
#first-option {
  margin-top: 30px;
}

#second-option {
  margin-top: 30px;
}
#border__time {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  padding: 7px 0;
  border-radius: 10px;
  transition: 0.5s;
}
#border__time:hover {
  box-shadow: 0 4px 8px 0 rgba(47, 76, 126, 0.5), 0 6px 20px 0 rgba(47, 76, 126, 0.5);
}
.flag__newyork {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../../public/Flags/newyork.gif");
  background-size: 250px 95px;
  background-repeat: no-repeat;
}
.flag__london {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../../public/Flags/london_gif.gif");
  background-size: 250px 95px;
  background-repeat: no-repeat;
  background-position: center;
}
.flag__paris {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../../public/Flags/paris_gif.gif");
  background-size: 250px 95px;
  background-repeat: no-repeat;
  background-position: center;
}
.flag__singapore {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../../public/Flags/singapore_gif.gif");
  background-size: 250px 95px;
  background-repeat: no-repeat;
}
.flag__tokyo {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../../public/Flags/japagg_gif.gif");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-position: center;
}
#gretting {
  font-size: 18px;
}
#country-gretting {
  border-radius: 5px;
  font-size: 15px;
}
#text-on-right {
  text-align: right;
}
#text-on-left {
  text-align: center;
}
.font-orbitron {
  font-family: 'Roboto Mono', monospace;
}
.time__text {
  font-size: 21px;
  text-align: center;
}
.centering__txt {
  justify-content: center;
}
</style>

<style>
@media (min-width: 1023px) {
  .deposit__history__mobile {
    display: none;
  }
}
@media (max-width: 1023px) {
  .deposit__history__desktop {
    display: none;
  }
}
@media (max-width: 1253px) {
  .time__text {
    font-size: 17px;
  }
}
@media (max-width: 1085px) {
  .time__text {
    font-size: 15px;
  }
  .flag__singapore {
    background-size: 140px 90px;
  }
  .flag__paris {
    background-size: 140px 90px;
  }
  .flag__london {
    background-size: 140px 90px;
  }
  .flag__newyork {
    background-size: 140px 90px;
  }
}
@media (max-width: 848px) {
  .time__text {
    font-size: 13px;
  }
  .flag__singapore {
    background-size: 130px 90px;
  }
  .flag__paris {
    background-size: 130px 90px;
  }
  .flag__london {
    background-size: 130px 90px;
  }
  .flag__newyork {
    background-size: 130px 90px;
  }
}
@media (max-width: 744px) {
  .time__text {
    font-size: 10px;
  }
  .flag__singapore {
    background-size: 100px 90px;
  }
  .flag__paris {
    background-size: 100px 90px;
  }
  .flag__london {
    background-size: 100px 90px;
  }
  .flag__newyork {
    background-size: 130px 90px;
  }
}
@media (max-width: 1023px) {
  .container-dashboard {
    padding: 10px 0;
  }
  #padding-mobile {
    padding-left: 16px;
  }
  #welcome-location {
    padding: 0 20px;
  }
  #first-option {
    padding: 0 10px;
  }
  #add-fund-history {
    padding: 0 10px;
    margin-top: 20px;
    margin-left: 0;
  }
  #second-option {
    padding: 0 10px;
  }
  div #carousel {
    margin-top: 20px;
  }
}
@media (max-width: 599px) {
  .time__text {
    font-size: 20px;
    padding: 0 20px 0 20px;
  }
  #border__time {
    padding: 50px 0;
  }
  .border__size {
    padding: 20px 100px;
  }
  .flag__london {
    background-size: cover;
  }
  .flag__paris {
    background-size: cover;
  }
  .flag__newyork {
    background-size: cover;
  }
  .flag__singapore {
    background-size: 350px 180px;
  }
}
@media (max-width: 496px) {
  #border__time {
    padding: 30px 0;
  }
  .border__size {
    padding: 20px 80px;
  }
  .flag__singapore {
    background-size: 300px 140px;
  }
}
@media (max-width: 410px) {
  #border__time {
    padding: 30px 0;
  }
  .border__size {
    padding: 20px 30px;
  }
}
</style>