<template>
  <div class="q-pa-md">
    <!-- Account Lock Form -->
    <div class="text-center">
<!--       <div class="q-my-lg">
        <span style="font-size: 20px; font-weight: 450">Sending Disabled</span>
        <br />
        <span style="font-size: 20px; font-weight: 400">Fill-up Form for Verification</span>
      </div> -->
      <div class="field q-my-md" style="font-size: 14.5px; font-weight: bold;">
          <span>Enter the last four (4) characters of your ID Number</span>
      </div>
      <q-form @submit="validateIdNumber()">
        <div>
          <q-input type="text" v-model="id_number" color="accent" outlined dense label="ID Number (Provided in Verification)" />
        </div>
        <!-- <div class="field q-mb-lg">
          <q-input type="file" outlined dense />
        </div> -->
        <q-btn class="q-mt-md" type="submit" color="accent">Submit</q-btn>
      </q-form>
    </div>
  </div>
</template>

<script>
import { postRequestEmail } from "../references/url";

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
      let res = await this.$_post(postRequestEmail, { id_number: this.id_number });
      this.$q.loading.hide();

      if(res.status != undefined)
      {
        this.$emit('success', res);
      }
    },

  }
}
</script>
