<template>
  <div class="q-pa-md">

    <!-- Receive Component -->
    <div class="content text-center">
       <div >
        <!-- <qrcode-vue :value="$user_info.wallet[indexNumber].wallet_address" :size="size" level="H" :logoSrc="src2"></qrcode-vue> -->
        <vue-qr  
                :logoSrc="src='../../lexicon001.png'"
                :text="wallet_details[tab_currency_index].wallet_address"
                :size= "size"
                :logoScale= "logoScale"
        ></vue-qr>
      </div>
        <br>
      <q-input 
        readonly 
        outlined
        class="q-mb-md" 
        type="text" 
        label="Account Name"
        v-model="$user_info.full_name"
        v-if="wallet_details[tab_currency_index].is_fiat"
      />

      <q-input 
        readonly 
        outlined 
        type="text" 
        :label="wallet_details[tab_currency_index].is_fiat ? 'Account Number' : 'Wallet Address' "
        v-model="wallet_details[tab_currency_index].wallet_address"
      >
        <q-btn @click="copy()" class="bg-default color-default" label="Copy" />
      </q-input>

      <div v-if="is_copy_clipboard == true">
        <q-tooltip
          v-model="is_copy_clipboard"
        >
        {{ wallet_details[tab_currency_index].currency }} Wallet Address Copied !
        </q-tooltip>
      </div>
    </div>

  </div>
</template>

<script>
import { copyToClipboard } from "quasar";
import QrcodeVue from 'qrcode.vue';
import VueQr from 'vue-qr';

export default {
  props: ['tab_currency_index', 'wallet_details'],
  data() {
    return {
      is_copy_clipboard: false,
      size: 250,
      logoScale: 0.18,
    };
  },

  mounted() 
  {

  },
  components: { QrcodeVue, VueQr },
  methods: {
    async copy() {
      copyToClipboard(this.wallet_details[this.tab_currency_index].wallet_address)
        .then(() => {
          this.is_copy_clipboard = true;
      });

      setTimeout(() => {
        this.is_copy_clipboard = false;
      }, 2000);
    },

  }
};
</script>
