<template>
  <div class="q-pa-md">
    <q-btn label="Open Dialog" color="accent" @click="dialog = true" />

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span>
        </q-card-section>

        <q-card-section class="row items-center">
          <q-toggle v-model="cancelEnabled" label="Cancel button enabled" />
        </q-card-section>

        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="accent"
            v-close-popup="cancelEnabled"
            :disable="!cancelEnabled"
          />
          <q-btn flat label="Turn on Wifi" color="accent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "UQKycLanding",
  data() {
    return {
      dialog: false,
      cancelEnabled: false
    };
  }
};
</script>