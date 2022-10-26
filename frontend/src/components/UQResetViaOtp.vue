<template>
  <div class="q-pa-md">
    <!-- Account Lock Form OTP -->
    <div class="text-center">
        <div class="q-my-lg">
            <span style="font-size: 20px; font-weight: 450">Sending Disabled</span>
        </div>

        <div>
          <q-form @submit="validateOTP()">
            <div class="field q-mb-lg">
              <label style="font-size: 17px;">Input OTP</label>
              <q-input type="text" v-model="code" color="accent" outlined dense label="OTP" />
            </div>
            <q-btn type="submit" color="accent">Submit</q-btn>
          </q-form>
        </div>

    </div>
  </div>
</template>

<script>
import { 
  postOTPForgotSecurity,
} from "../references/url";

export default {
	data() {
   return{
     code: "",
     res: null
    }
  },

  mounted() 
  {

  },

  methods: 
  {
    async validateOTP()
    {
        this.$q.loading.show();
        let res = await this.$_post(postOTPForgotSecurity, { code: this.code });
        this.$q.loading.hide();

        if(res.status != undefined)
        {
          this.$emit('success', res);
        }
    },

  }
}
</script>
