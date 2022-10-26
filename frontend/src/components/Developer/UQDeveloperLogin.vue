 <template>
  <div>
    <div class="content text-left">
      <q-form @submit="verifyDeveloper()">
        <div class="field">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              v-model="form_data.email"
              placeholder="E-mail"
              outlined
              :rules="[val => !!val || '* Field is required' , val => val.includes('@') && val.includes('.com') || 'Please input a valid e-mail', ]"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="field">
          <div>
            <q-input
              bg-color="white"
              color="accent"
              v-model="form_data.password"
              :type="isPwd ? 'password' : 'text'"
              placeholder="Password"
              outlined
              :rules="[
                        val => !!val || '* Field is required',
                        val => val.length > 7 || 'Password must be more than 8 characters',
                        val => val.length < 17 || 'Password must not exceed 16 characters',
                        ]"
            >
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
          </div>
        </div>

        <div class="q-mt-sm">
          <q-btn
            type="submit"
            style="background: #34548b; color: white;"
            glossy
            unelevated
            class="full-width"
          >Login</q-btn>
        </div>

        <!-- <div class="q-mt-md">
          <q-btn type="submit" unelevated class="full-width">Login</q-btn>
          
        </div>-->
      </q-form>
    </div>
  </div>
</template>
<script>
import { verifyDeveloper } from "../../references/url";
export default {
  data: () => ({
    form_data: {
      email: "bernaljohnraymund777@gmail.com",
      password: "Water123",
    },
    isPwd: true,
  }),
  async mounted() {},

  methods: {
    async verifyDeveloper() {
      this.$q.loading.show();
      let res = await this.$_post(verifyDeveloper, this.form_data);
      this.$q.loading.hide();
      if (res.data.status != "error") {
        sessionStorage.setItem("auth", JSON.stringify(res.data));
        sessionStorage.setItem("token", res.data.token);
        this.$store.commit("user/updateUser", res.data);
        this.$router.push({ path: "/developer/dashboard" });
      } else if (
        res.data.status == "error" &&
        res.data.message == "Invalid Credentials"
      ) {
        this.$q.notify({
          message:
            '<div style="color: white; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>' +
            res.data.message +
            "</div>",
          position: "top",
          color: "red",
          html: true,
        });
      }
    },
  },
};
</script>
