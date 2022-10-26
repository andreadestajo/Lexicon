<template>
  <div>
    <q-btn flat round icon="notifications" class="shake">
      <div v-if="count == 0"></div>
      <div v-if="count != 0">
        <q-badge style="margin-top: 6px" color="red" floating>{{ count }}</q-badge>
      </div>
      <q-tooltip>Notifications</q-tooltip>
      <q-menu>
        <div class="q-pt-xs; menu-notif" id="style-4">
          <div>
            <q-item id="item-notif">
              <q-item-section class="font-bebas text-bold" id="item-label-notif">Notifications</q-item-section>
              <q-item-section avatar clickable>
                <q-btn flat round icon="settings">
                  <q-menu>
                    <div class="column">
                      <div class="col">
                        <q-btn
                          flat
                          no-caps
                          id="item-btn-read"
                          @click="readAllNotification()"
                        >Mark All as Read</q-btn>
                      </div>
                      <div class="col">
                        <!-- centent here -->
                      </div>
                    </div>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-separator />
            <!-- <q-item-section avatar>
            <q-avatar size="50px">-->
            <!-- </q-avatar>
            </q-item-section>-->
            <div id="item-column-notif">
              <q-item class="q-pa-none">
                <div class="q-pa-none">
                  <q-list
                    style="min-width: 350px"
                    v-for="notifList  in notifList "
                    :key="notifList._id"
                  >
                    <q-btn
                      clickable
                      v-if="notifList.is_open == false"
                      class="bg-notification full-width"
                      style="border-bottom: 1px solid #d4d4d4"
                      flat
                      no-caps
                      @click=" updateNotifStatus(notifList._id)"
                    >
                      <q-item-section class="font-raleway text-bold">
                        <q-item-label
                          lines="1"
                          @click=" updateNotifStatus(notifList._id)"
                        >{{notifList.message}}</q-item-label>
                      </q-item-section>
                      <q-item-section class="font-monseratt text-bold">
                        <!-- <q-item-label
                          lines="1"
                        >{{ moment(notifList.date_created).format('D-MMM-YYYY') }} {{ new Date(notifList.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</q-item-label> -->
                        <q-item-label
                          lines="1"
                        >{{ moment(notifList.date_created).tz("Europe/London").format('DD-MMM-YYYY HH:mm') }}</q-item-label>
                      </q-item-section>
                    </q-btn>
<!--                     <q-btn
                      clickable
                      v-if="notifList.is_open == true"
                      style="border-bottom: 1px solid #d4d4d4"
                      flat
                      class="full-width"
                      no-caps
                      @click=" updateNotifStatus(notifList._id)"
                    >
                      <q-item-section>
                        <q-item-label class="font-raleway text-bold" lines="1">{{notifList.message}}</q-item-label>
                      </q-item-section>
                      <q-item-section class="font-monseratt text-bold">
                        <q-item-label
                          lines="1"
                        >{{ moment(notifList.date_created).format('d-MMM-yyyy') }} {{ new Date(notifList.date_created).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) }}</q-item-label>
                      </q-item-section>
                    </q-btn> -->
                  </q-list>
                </div>
              </q-item>
            </div>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>


<script>
import {
  getNotifications,
  updateNotifications,
  readAllNotifications,
} from "../references/url";
import moment from "moment-timezone";

export default {
  data: () => ({
    medium: false,
    moment: moment,
    notifList: [],
    count: 0,
    form_data: {
      id: "",
      notifId: "",
    },
    columns: [
      {
        name: "message",
        label: "Message",
        field: "message",
        align: "center",
        sortable: true,
      },
      {
        name: "date_created",
        label: "Date Created",
        field: "date_created",
        align: "center",
        sortable: true,
      },
      { name: "status", label: "Status", field: "status", align: "center" },
    ],
  }),

  async mounted() {
    this.getNotifs();
    // this.$nextTick(function(){
    //   window.setInterval(() => {
    //     this.getNotifs();
    //   }, 5000);
    // });
  },

  methods: {
    async getNotifs() {
      this.form_data.id = this.$user_info._id;
      let res = await this.$_post(getNotifications, this.form_data);

      if (res) {
        // this.$q.loading.hide();
        this.notifList = res.data;

        this.count = this.notifList.filter((x) => x.is_open == false).length;
      }
    },

    async updateNotifStatus(notifId) {
      this.form_data.notifId = notifId;
      this.$q.loading.show();

      // setTimeout(3000);
      // {
      //   window.location.reload();
      // }
      let res = await this.$_post(updateNotifications, this.form_data);
      this.$q.loading.hide();
      await this.getNotifs();

      if (res) {
        this.$q.loading.hide();
        this.data = res.data;
      }
    },

    async readAllNotification() {
      // alert('hello')
      this.form_data.id = this.$user_info._id;
      this.$q.loading.show();

      // window.location.reload();
      let res = await this.$_post(readAllNotifications, this.form_data);
      this.$q.loading.hide();
      console.log(res);
      await this.getNotifs();

      if (res) {
        this.$q.loading.hide();
        this.data = res.data;
      }
    },
  },
};
</script>

<style type="text/css">
.q-td {
  cursor: pointer;
}
.bg-notification {
  background: #e6e6e6;
}
.shake:hover, .shake:focus {
  animation: bellshake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  backface-visibility: hidden;
}
@keyframes bellshake {
  0% {
    transform: rotate(0);
  }
  15% {
    transform: rotate(20deg);
  }
  30% {
    transform: rotate(-20deg);
  }
  45% {
    transform: rotate(13deg);
  }
  60% {
    transform: rotate(-13deg);
  }
  75% {
    transform: rotate(8deg);
  }
  85% {
    transform: rotate(-9deg);
  }
  92% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
