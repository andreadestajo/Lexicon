=========================================
Title: Design
Author: Gelo
Date: 10 Aug 2020
Contributor:
=========================================


//  :src="`http://${server.host}:${server.port}/user/${$user_info._id}/images/${$user_info.kyc.selfie_image_path}`"

<template>
  <div class="q-pa-md">
    <img class="bg-laptop" src="bg-cover.jpg" />
    <img class="img-bg" src="white.png" />
    <div class="q-gutter-y-md absolute-center" id="profile-container">
      <div class="img-bg-container">
        <div>
          <div class="lt-md container-profile-mobile">
            <div class="try-mobile">
              <div v-if="$user_info.kyc.gender == 'MALE'" class="profile__mobile">
              <q-img
                class="displaying-mobile"
               src="avatar/boy.png"
               style="z-index: 1"
              ><img
                  class="displaying-mobile1"
                    v-if="url" :src="url" style="z-index: 3"/>
              <div class="absolute-bottom-right hovering-mobile1">
               <input type="file" @change="onFileChange" />
                <q-btn icon="fas fa-pen" size="8px" flat padding="xs">
                 </q-btn>
               </div>
              </q-img>
              </div>

                <div v-if="$user_info.kyc.gender == 'FEMALE'" class="profile__mobile">
              <q-img
                class="displaying-mobile"
               src="avatar/girl.png"
               style="z-index: 1"
              ><img
                  class="displaying-mobile1"
                    v-if="url" :src="url" style="z-index: 3"/>
               <div class="absolute-bottom-right hovering-mobile1">
               <input type="file" @change="onFileChange" />
                <q-btn icon="fas fa-pen" size="8px" flat padding="xs">
                 </q-btn>
               </div>
              </q-img>
              </div>
            </div>
            <div class="q-pt-md cover-btn-mobile">
              <!-- <q-btn outline class="text-default">Change Cover Photo</q-btn> -->
            </div>
          </div>
          <div class="row q-col-gutter-md q-pa-lg container-profile-all">
            <div class="col-7 container-profile-forms">
              <div class="text-positioning">
                <div class="text-h4 font-monseratt title__user">
                  <b>USER INFORMATION</b>
                </div>
              </div>
              <div class="font-raleway q-pt-md color-info">
                <b>Full Name</b>
              </div>
              <q-field class="text-h6" color="accent" v-model="text">
                <template v-slot:control>
                  <div
                    class="self-center full-width no-outline"
                    tabindex="0"
                  >{{$user_info.kyc.first_name}}  {{$user_info.kyc.middle_name}}{{$user_info.kyc.last_name}}</div>
                </template>
              </q-field>
              <div class="col-7 q-pt-md q-md-xl">
                <div class="font-raleway color-info">
                  <b>Birthdate</b>
                </div>
                <q-field class="text-h6" color="accent" v-model="text">
                  <template v-slot:control>
                    <div>{{ moment($user_info.kyc.birthday).tz("Europe/London").format('DD-MMM-YYYY')}}</div>
                  </template>
                </q-field>
              </div>
              <div class="col-7 q-pt-md q-md-xl">
                <div class="font-raleway color-info">
                  <b>Nationality</b>
                </div>
                <q-field class="text-h6" color="accent" v-model="text">
                  <template v-slot:control>
                    <div>{{$user_info.kyc.nationality}}</div>
                  </template>
                </q-field>
              </div>
              <div class="col-7 q-pt-md q-md-xl">
                <div class="font-raleway color-info">
                  <b>Email Address</b>
                </div>
                <q-field class="text-h6" color="accent" v-model="text">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{$user_info.email}}</div>
                  </template>
                  <template v-slot:append></template>
                </q-field>
              </div>

              <q-dialog v-model="icon">
                <q-card class="q-pa-md">
                  <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Change Your Email</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>
                  <q-card-section>
                    <q-input v-model="num" />
                  </q-card-section>
                </q-card>
              </q-dialog>

              <div class="col-7 q-pt-md q-md-xl">
                <div class="font-raleway color-info">
                  <b>Contact No.</b>
                </div>
                <q-field class="text-h6" color="accent" v-model="text">
                  <template v-slot:control>
                    <div>{{$user_info.kyc.contact_code}} {{$user_info.kyc.contact}}</div>
                  </template>
                  <template v-slot:append></template>
                </q-field>
              </div>

              <q-dialog v-model="cont">
                <q-card class="q-pa-md">
                  <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Change Your Number</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>
                  <q-card-section>
                    <q-input v-model="num" />
                  </q-card-section>
                </q-card>
              </q-dialog>

              <div class="col-7 q-pt-md q-md-xl">
                <div class="font-raleway color-info">
                  <b>Address</b>
                </div>
                <q-field class="text-h6" color="accent" v-model="text">
                  <template v-slot:control>
                    <div>{{$user_info.kyc.house_number}} {{$user_info.kyc.address}} {{$user_info.kyc.city}} {{$user_info.kyc.zip_code}}</div>
                  </template>
                  <template v-slot:append></template>
                </q-field>
              </div>

               <div class="col-7 q-pt-md q-md-xl">
                <div class="font-raleway color-info">
                  <b>Country</b>
                </div>
                <q-field class="text-h6" color="accent" v-model="text">
                  <template v-slot:control>
                    <div>{{$user_info.country}}</div>
                  </template>
                  <template v-slot:append></template>
                </q-field>
              </div>
              <br>

              <q-dialog v-model="location">
                <q-card class="q-pa-md" style="width: 100%">
                  <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Change Your Address</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>
                  <q-card-section>
                    <q-input v-model="loc" />
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
            <div class="col-5 gt-sm">
              <div class="try-mobile">
                <div v-if="$user_info.kyc.gender == 'MALE'">
                <q-img
                  class="displaying"
                    src="avatar/boy.png"
                    style="z-index: 1"
                >
                 <img
                  class="displaying"
                    v-if="url" :src="url" style="z-index: 3"/>
                <div class="absolute-bottom text-subtitle1 text-center hovering-mobile">
                    <input type="file" @change="onFileChange" />
                  <a
                    icon="fas fa-camera-retro"
                    size="15px"
                    type="file"
                    stack
                    flat
                    class="profile-btn-mobile font-bebas btn btn-info btn-sm remove"
                  >Update</a>
                </div>
                </q-img>
                </div>
                <div v-if="$user_info.kyc.gender == 'FEMALE'">
                <q-img
                  class="displaying"
                    src="avatar/girl.png"
                > <img
                  class="displaying"
                    v-if="url" :src="url" style="z-index: 3"/>
                <div class="absolute-bottom text-subtitle1 text-center hovering-mobile">
                    <input type="file" @change="onFileChange" />
                  <a
                    icon="fas fa-camera-retro"
                    size="15px"
                    type="file"
                    stack
                    flat
                    class="profile-btn-mobile font-bebas btn btn-info btn-sm remove"
                  >Update</a>
                </div></q-img>
                </div>
                  <!-- <div class="absolute-bottom text-subtitle1 text-center hovering">
                                  <q-btn icon="fas fa-camera-retro" size="15px" stack flat class="profile-btn font-bebas">Update</q-btn>
                  </div>-->
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Layout from "./Profile.scss";
// import config from "../../../config";
import moment from "moment-timezone";

export default {
  data: () => ({
    tab: "mails",
    splitterModel: 20,
    icon: false,
    cont: false,
    location: false,
    text: "",
    num: "",
    loc: "",
    moment: moment,
    url: null,

    // server: {
    //   host: config.SERVER.HOST,
    //   port: config.SERVER.PORT,
    // },
  }),
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
  },
};
</script>

<style>
.upload__pic {
  padding: 0;
}
.profile__mobile {
  padding: 0 177px;
}
.profile-container {
  max-width: 1000px;
}
.text-desktop {
  padding: 15px 50px;
}
.profile-btn-mobile {
  letter-spacing: 1.3px;
}
.container-profile-mobile {
  position: absolute;
  top: 300px;
}
.try-mobile {
  text-align: center;
}
.displaying-mobile {
  opacity: 1;
  transition: 0.5s ease;
  backface-visibility: hidden;
  width: 245px;
  height: 230px;
}
.displaying-mobile1 {
  opacity: 1;
  transition: 0.5s ease;
  backface-visibility: hidden;
  width: 245px;
  height: 230px;
}
.hovering-mobile {
  transition: 0.5s ease;
  opacity: 0  ;
  position: absolute;
  text-align: center;
}
.cover-btn-mobile {
  padding: 20px 220px;
}
.try {
  margin-left: 50px;
  margin-right: 80px;
}
.displaying {
  opacity: 1;
  transition: 0.5s ease;
  backface-visibility: hidden;
  border-radius: 10px;
  width: 245px;
  height: 230px;
}
.hovering {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  text-align: center;
}
.try:hover .hovering {
  opacity: 1;
}
.try-mobile:hover .hovering-mobile {
  opacity: 1;
}
.img-bg {
  margin-left: -20px;
  padding-top: 350px;
  z-index: -1;
  position: fixed;
}
.img-bg-container {
  width: 900px;
  height: 750px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 2;
  border-radius: 10px;
  margin-top: 400px;
  margin-bottom: 50px;
}
.bg-laptop {
  position: fixed;
  z-index: -2;
  width: 1700px;
  bottom: 40px;
  left: -200px;

}
.color-info {
  color: #7d7d7d;
}
.profile-btn {
  border-radius: 5px;
  padding: 0px 60px;
  letter-spacing: 1.3px;
}
</style>
<style>
@media (max-width: 982px) {
  .img-bg-container {
    max-width: 600px;
    height: 900px;
    margin-bottom: -300px;
  }
  .displaying {
    width: 180px;
    height: 180px;
    margin-left: -30px;
  }
  .profile-btn {
    padding: 0px 30px;
  }
  .hidden {
    display: block;
  }
  .container-profile-forms {
    margin-top: 150px;
    text-align: center;
  }
  .container-profile-all {
    width: 1000px;
  }
  .displaying-mobile {
    border-radius: .8em;
    box-shadow: 0 0 0 .8em #fff;
  }
  .cover-btn-mobile {
    padding: 0px 200px;
  }
}
@media (max-width: 699px) {
  .img-bg-container {
    max-width: 400px;
    height: 950px;
  }
  .profile__mobile {
      padding: 0 78px
    }
  .cover-btn-mobile {
    padding: 0px 120px;
  }
  .container-profile-all {
    width: 680px;
  }
}
@media (max-width: 452px) {
  .img-bg-container {
    max-width: 350px;
    margin-top: 400px;
  margin-bottom: -300px;
  height: 900px;
  }
  .title__user {
    font-size: 24px;
  }
  .cover-btn-mobile {
    padding: 0px 60px;
  }
  .container-profile-all {
    width: 595px;
  }
  .profile__mobile {
      padding: 0 52px
    }
}
@media (min-height: 834px) {
  .bg-laptop {
    top: 10px;
  }
}
/* tv */
@media (min-width: 1599px) {
  .bg-laptop {
    width: 1800px;
  }
}
</style>