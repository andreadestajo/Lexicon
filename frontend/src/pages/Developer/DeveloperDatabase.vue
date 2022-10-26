<template>
  <div class="row">
    <div class="col-12">
      <div class="q-pa-sm" style=" padding: 20px 450px">
        <q-card class="my-card admin-card" style=" padding: 20px 50px; ">
          <q-card-section>
            <div class="q-gutter-md">
              <div class="text-center logo-admin">
                <h6
                  class="font-bebas"
                  style="font-size: 40px; border-bottom: 3px solid #2f4c7e; padding-bottom: 10px; margin:10px 0"
                >Data Base</h6>
              </div>
              <div>
                <div class="content text-left">
                  <q-form @submit="clearDataBase()">
                    <div class="q-mt-sm">
                      <q-btn
                        type="submit"
                        style="background: #34548b; color: white;"
                        glossy
                        unelevated
                        class="full-width"
                      >Clean Up</q-btn>
                    </div>
                  </q-form>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Dialog for clean data base -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-database" color="accent" text-color="white" />
          <span
            class="q-ml-sm font-raleway"
          >Are you sure you want to clear all the data from database?</span>
        </q-card-section>

        <q-card-actions align="right" class="font-raleway">
          <q-btn flat label="Yes" color="accent" v-close-popup />
          <q-btn flat label="No" color="accent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    confirm: false,
  }),
  async mounted() {},

  methods: {
    clearDataBase() {
      this.confirm = true;
    },
  },
};
</script>
<style>
</style>