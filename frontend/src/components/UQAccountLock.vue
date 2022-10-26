<template>
  <div class="q-pa-md">
    <!-- Account Lock Form -->
    <div class="text-center">
      <div class="q-my-lg">
        <span style="font-size: 20px; font-weight: 450" class="font-raleway">You're account is temporarily diabled.</span>
        <br />
        <span style="font-size: 20px; font-weight: 400" class="font-raleway">Please fill-up this form to enable sending again.</span>
      </div>
      <q-form @submit="validateIdNumber()">
        <div class="field q-mb-lg">
          <q-input type="text" v-model="id_number" outlined  label="ID Number (Provided in KYC)" />
        </div>
        <!-- <div class="field q-mb-lg">
          <q-input type="file" outlined dense />
        </div> -->
        <q-btn type="submit" class="bg-default color-default">Submit</q-btn>
      </q-form>
    </div>
  </div>
</template>

<script>
import { postAccountLocked } from "../references/url";

export default {
	data() 
  {
   return{
     id_number: "",
    }
  },

  mounted() 
  {

  },

  methods: 
  {
    async validateIdNumber()
    {
      this.$q.loading.show();
      let res = await this.$_post(postAccountLocked, { id_number: this.id_number });
      this.$q.loading.hide();

      window.location.reload();
    },

  }
}
</script>
