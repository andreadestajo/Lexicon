 <template>
  <div>
    <q-tabs
      v-model="tab"
      align="center"
      no-caps
      indicator-color="accent"
      active-color="accent"
      class="text-black tab-bg font-oswald"
      isShown="true"
      v-if="!left"
    >
      <div v-if="role != 'Encoder' && role != 'Client'">
        <q-route-tab class="q-mx-md" name="dashboard" to="/admin/dashboard">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/dashboard.png" />
          <q-label class="q-p-sm">DASHBOARD</q-label>
        </q-route-tab>
      </div>

      <!-- <q-route-tab class="q-mx-md" name="users" to="/admin/users">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/user.png" />
          <q-label>USERS</q-label>
      </q-route-tab>-->

      <div v-if="role == 'Administrator'" class="q-mx-md">
        <q-btn no-caps flat>
          <div class="column">
            <div class="col">
              <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/user.png" />
            </div>
            <div class="col">
              <q-label style="letter-spacing: 1px" class="q-pa-sm text-weight-bold">USERS</q-label>
            </div>
          </div>
          <q-menu>
            <div class="q-pa-sm">
              <q-route-tab class="q-mx-md" to="/admin/client-list">
                <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/user.png" />
                <q-label style="letter-spacing: 1px" class="q-pa-sm text-weight-bold">Client</q-label>
              </q-route-tab>

              <q-route-tab class="q-mx-md" to="/admin/users">
                <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/user.png" />
                <q-label style="letter-spacing: 1px" class="q-pa-sm text-weight-bold">Admin</q-label>
              </q-route-tab>
            </div>
          </q-menu>
        </q-btn>
      </div>

      <div v-if="role == 'Administrator'">
        <q-route-tab class="q-mx-md" name="client-verification" to="/admin/kyc/submits">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/client_verification.png" />
          <q-label>CLIENT VERIFICATION</q-label>
        </q-route-tab>
      </div>

      <div v-if="role == 'Administrator' || role == 'Approver' || role == 'Reviewer' ">
        <q-route-tab class="q-mx-md" name="add-funds" to="/admin/transactions/add-funds">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/deposit.png" />
          <q-label>DEPOSIT</q-label>
        </q-route-tab>
      </div>

      <div v-if="role != 'Encoder' && role != 'Client'">
        <q-route-tab class="q-mx-md" name="wire-transfer" to="/admin/transactions/transfer">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/wire-transfer.png" />
          <q-label>WIRE TRANSFER</q-label>
        </q-route-tab>
      </div>

      <div v-if="role == 'Administrator'">
        <q-route-tab class="q-mx-md" name="hedge" to="/admin/hedge_fund">
          <q-icon size="40px" class="q-mt-md" name="img:admin_icons/hedgefund2.png" />
          <q-label class="q-pt-sm">HEDGE FUND</q-label>
        </q-route-tab>
      </div>

      <div v-if="role == 'Administrator'">
        <q-route-tab class="q-mx-md" name="settings" to="/admin/settings">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/settings.png" />
          <q-label>SETTINGS</q-label>
        </q-route-tab>
      </div>

      <div v-if="role == 'Administrator'">
        <q-route-tab class="q-mx-md" name="history" to="/admin/reports">
          <q-icon size="50px" class="q-mt-sm" name="img:admin_icons/report.png" />
          <q-label>REPORTS</q-label>
        </q-route-tab>
      </div>

      <div v-if="role == 'Administrator'">
        <q-route-tab class="q-mx-md" name="activity-logs" to="/admin/activity-logs">
          <q-icon size="40px" class="q-mt-md" name="img:admin_icons/activity-logs.png" />
          <q-label class="q-pt-xs">ACTIVITY LOGS</q-label>
        </q-route-tab>
      </div>
    </q-tabs>
  </div>
</template>

<script>
export default {
  data: () => ({
    role: "",
    left: false,
  }),
  async mounted() {
    this.role = this.$user_info.user_role;
  },
};
</script>
<style>
</style>

