=============================
Title : SMS
Author: Andrea Antonio Destajo
Contributor:
=============================
<template>
	<div class="column">
	  <div class="row">
	    <q-card square bordered class="q-pa-lg shadow-1">
	      <q-card-section>
	        <div class="row">
	          <h5 class="text-h5 q-my-md">Send Message</h5>
	        </div>
	      </q-card-section>
	      <q-card-section>
	        <q-form class="q-gutter-md">
	          <div class="col-4">
	            <div>
	              <q-input
	                outlined
	                color="accent"
	                square
	                v-model="form_data.sender"
	                label="To"
	                required
	              />
	            </div>
	          </div>
	          <div class="col-4">
	            <div>
	              <q-input
	                outlined
	                color="accent"
	                square
	                v-model="form_data.receiver"
	                label="From"
	                required
	              />
	            </div>
	          </div>
	          <div class="col-4">
	            <div>
				<q-input
					outlined
				  v-model="form_data.message"
				  type="textarea"
				  float-label="Textarea"
				  placeholder="Message"
				  :max-height="100"
				  :min-rows="7"
				/>
	            </div>
	          </div>
	        </q-form>
	      </q-card-section>
	      <q-card-actions class="q-px-md">
			<q-btn color="primary" icon="mail" icon-right="send" label="Send" @click="sendMessage()" />
	      </q-card-actions>
	    </q-card>
	  </div>
	</div>
</template>

<script>
import {postSendMessage} from "../../references/url";

	export default{
		data: () => ({
			form_data:{
				sender: '',
				receiver:'+639169779809',
				message: 'Hello This Lexicon Bank!',
			}
		}),

		methods:{

			async sendMessage(){

				if(this.form_data.sender != '' || this.form_data.receiver != '' || this.form_data.message != '')
				{
			      this.$q.loading.show();
			      let res = await this.$_post(postSendMessage, this.form_data);
			      this.$q.loading.hide();

			      if (res) 
			      {
			        this.data = res.data;
			        // this.$q.notify({
			        //   type: `positive`,
			        //   message: `Message Sent!`,
			        //   position: "top"
					// });
					this.$q.notify({
						message: '<div style="color: green; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Message Sent.</div>',
						position: 'top',
						color: 'white',
						html: true,
					});		        
			      }
				}else{
			        // this.$q.notify({
			        //   type: `negative`,
			        //   message: `Please fill the details.`,
			        //   position: "top"
					// });
					this.$q.notify({
						message: '<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Please fill the details.</div>',
						position: 'top',
						color: 'white',
						html: true,
					});				
				}
			}
		}
	}
</script>

<style>
	.q-pa-lg{
		width: 40%;
	}
</style>