<template>
    <div>
	    <!-- content -->
	    <div class='content text-left'>
	    	<q-form @submit="findOldPassword()">
		     	<div class="field">
		       		<div>
                        <q-input v-model="form_data.old_password" :type="isOldPwd ? 'password' : 'text'" label="Old Password" outlined  :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 16 || 'Password must not exceed 16 characters',
                        ]">
                        <template v-slot:prepend>
                        <q-icon name="lock" />
                        </template>
                        <template v-slot:append>
                            <q-icon
                            :name="isOldPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isOldPwd = !isOldPwd"
                            />
                        </template>
                        </q-input>
                    </div>
		       </div>
                               <div class="field q-mt-sm">
		       		<div>
                        <q-input @input="p_len" v-model="form_data.password" :type="isPwd ? 'password' : 'text'" label="Password" outlined  :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 16 || 'Password must not exceed 16 characters',
                        val => /[a-z]/.test(val) && /\d/.test(val) && /[A-Z]/.test(val),
                        ]">
                        <template v-slot:prepend>
                        <q-icon name="lock" />
                        </template>
                            <template v-slot:append>
                              <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                              />
                            </template>
                        </q-input>
                        <div v-bind:class="{ show_password_length: typed }" class="lnu_container">
                            <p v-bind:class="{ lovercase_valid: contains_lovercase }">Lowercase</p>
                            <p v-bind:class="{ number_valid: contains_number }">Number</p>
                            <p v-bind:class="{ uppercase_valid: contains_uppercase }">Uppercase</p>
                        </div>
                    </div>
		       </div>

		        <div class="field q-mt-sm">
		       		<div>
                        <q-input @input="cp_len" v-model="form_data.confirm_password" :type="isConfirmPwd ? 'password' : 'text'" label="Confirm Password" outlined  :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 16 || 'Password must not exceed 16 characters',
                        val => /[a-z]/.test(val) && /\d/.test(val) && /[A-Z]/.test(val),
                        ]">
                        <template v-slot:prepend>
                        <q-icon name="lock" />
                        </template>
                            <template v-slot:append>
                              <q-icon
                                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isConfirmPwd = !isConfirmPwd"
                              />
                            </template>
                        </q-input>
                        <div v-bind:class="{ show_password_length: cp_typed }" class="lnu_container">
                            <p v-bind:class="{ lovercase_valid: cp_contains_lovercase }">Lowercase</p>
                            <p v-bind:class="{ number_valid: cp_contains_number }">Number</p>
                            <p v-bind:class="{ uppercase_valid: cp_contains_uppercase }">Uppercase</p>
                        </div>
                    </div>
		       </div>
		       <div class="q-pa-md q-gutter-sm text-center">
                   <q-btn type="submit" color="accent" unelevated>Change Password</q-btn>
                   <q-btn type="submit" color="secondary" unelevated @click="$router.replace('../Documentation/login')">Cancel</q-btn>
                </div>
	   		</q-form>
	    </div>
    </div>
</template>

<script>
import { postUpdateProfile, postChangePassword } from '../references/url';

export default
{
    data:() =>(
    {
        form_data:
        {
            old_password: '',
            password: '',
            confirm_password: '',
        },
        isOldPwd: true,
        isPwd: true,
        isConfirmPwd: true,
        typed: false,
        cp_typed: false,
        contains_lovercase: false,
        contains_number: false,
        contains_uppercase: false,
        cp_contains_lovercase: false,
        cp_contains_number: false,
        cp_contains_uppercase: false,
    }),
    mounted()
    {

    },
    methods:
    {
        async findOldPassword()
        {
            this.$q.loading.show();
            let res = await this.$_post(postChangePassword, this.form_data);
            this.$q.loading.hide();

            if(res)
            {
                this.$emit('success', res);
            }
        },
        p_len: function() {

            if (this.form_data.password.length > 0) {
                this.typed = true;
            } else {
                this.typed = false;
            }

            this.contains_lovercase = /[a-z]/.test(this.form_data.password);
            this.contains_number = /\d/.test(this.form_data.password);
            this.contains_uppercase = /[A-Z]/.test(this.form_data.password);
        },
        cp_len: function() {

            if (this.form_data.confirm_password.length > 0) {
                this.cp_typed = true;
            } else {
                this.cp_typed = false;
            }

            this.cp_contains_lovercase = /[a-z]/.test(this.form_data.confirm_password);
            this.cp_contains_number = /\d/.test(this.form_data.confirm_password);
            this.cp_contains_uppercase = /[A-Z]/.test(this.form_data.confirm_password);
        },
    }
}
</script>
<style scoped>
.lnu_container 
{
    display: block;
    margin: 10px auto;
    width: 320px;
    height: auto;
    display: none;
    justify-content: space-between;
}

.lnu_container p 
{
    width: 100px;
    height: auto;
    font-size: 12px;
    line-height: 1.2;
    text-align: center;
    border-radius: 2px;
    color: rgba(71, 87, 98, .8);
    background: linear-gradient(to right, #00AD7C 50%, #eee 50%);
    background-size: 201% 100%;
    background-position: right;
    -webkit-transition: background .3s;
    transition: background .3s;
}

.lovercase_valid,
.number_valid,
.uppercase_valid 
{
    background-position: left !important;
    color: rgba(255, 255, 255, .9) !important;
}

.show_password_length {
  display: flex;
}
</style>