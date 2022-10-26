
=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================


<template>
  <div>
    <!-- container of admin dashboard -->
    <div class="container-admin-dashboard">
      <!-- WElcome Banner -->
      <div class="row q-mb-md">
        <div class="col-12">
          <q-card class="my-card dashboard-cards">
            <q-card-section class>
              <div class="row justify-around">
                <div class="col-md-6">
                  <div class="text-dark font-monseratt welcome-banner">
                    <b>Welcome {{$user_info.full_name}}</b>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="text-white text-right font-monseratt welcome-banner">
                    <q-badge class="q-pa-sm bg-default q-ml-md badge-font">{{$user_info.user_role}}</q-badge>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- end of Welcome Banner -->

      <!-- FEE CARDS -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <conversion-frequency-table></conversion-frequency-table>
            </div>
            <div class="col-12 col-md-6">
              <internal-transfer-fee></internal-transfer-fee>
            </div>
            <div class="col-12 col-md-6">
              <conversion-fee></conversion-fee>
            </div>
            <div class="col-12 col-md-6">
              <wire-transfer-fee></wire-transfer-fee>
            </div>

            <div class="col-12 col-md-6">
              <cancelation-fee></cancelation-fee>
            </div>
            <div class="col-12 col-md-6">
              <management-fee></management-fee>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-5">
          <user-table></user-table>
        </div>
      </div>
      <!-- END OF FEE CARDS -->

      <!-- USER and DEPOSIT TABLE -->
      <!-- <div class="row q-mt-xl">
        <div class="col-12 col-md-6">
          <user-table></user-table>
        </div>
      </div>-->
      <!-- END OF USER -->

      <!-- WIRE TRANSFER AND DEPOSIT TABLE -->
      <div class="row q-mt-xl">
        <div class="col-12">
          <wire-transfer-table></wire-transfer-table>
        </div>
      </div>
      <div class="row q-mt-xl">
        <div class="col-12">
          <add-funds-transaction-table></add-funds-transaction-table>
        </div>
      </div>
      <!-- END OF WIRE TRANSFER AND DEPOSIT TABLE -->

      <!-- CLIENT VERIFICATION TABLES -->
      <div class="row q-mt-xl">
        <div class="col-12 col-md-4">
          <kyc-approved-table></kyc-approved-table>
        </div>
        <div class="col-12 col-md-4">
          <kyc-pending-table></kyc-pending-table>
        </div>
        <div class="col-12 col-md-4">
          <kyc-rejected-table></kyc-rejected-table>
        </div>
      </div>
      <!-- END CLIENT VERIFICATION TABLES -->

      <div class="row q-col-gutter-xl q-mb-xl q-mt-xl">
        <!-- Success Deposit -->
        <!-- <div class="col-md-4 col-12">
          <q-card class="my-card dashboard-cards deposit-card">
            <q-card-section class="text-center text-white">
              <div class="font-raleway container-p">
                <b>SUCCESSFUL DEPOSIT</b>
              </div>
              <p class="font-bebas p-font">
                <b>120</b>
              </p>
            </q-card-section>
          </q-card>
        </div>-->
        <!-- End of Success Deposit -->

        <!-- Success Withdraw -->
        <!-- <div class="col-md-4 col-12">
          <q-card class="my-card dashboard-cards withdraw-card">
            <q-card-section class="text-center text-white">
              <div class="font-raleway container-p">
                <b>SUCCESSFUL WITHDRAWAL</b>
              </div>
              <p class="font-bebas p-font">
                <b>50</b>
              </p>
            </q-card-section>
          </q-card>
        </div>-->
        <!-- End of Success Withdraw  -->

        <!-- New USer -->
        <!-- <div class="col-md-4 col-12">
          <q-card class="my-card dashboard-cards user-card">
            <q-card-section class="text-center text-white">
              <div class="font-raleway container-p">
                <b>NEW USERS</b>
              </div>
              <p class="font-bebas p-font">
                <b>5</b>
              </p>
            </q-card-section>
          </q-card>
        </div>-->
        <!-- End of new user -->
      </div>
      <!-- <div class="row justify-around q-col-gutter-md">
        <div class="col-md-6 col-12">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-card class="my-card dashboard-cards">
                <q-card-section class="text-center">
                  <div class="text-grey font-raleway" style="font-size: 18px">
                    <b>
                      <i
                        class="fas fa-users q-mr-md q-pa-sm"
                        style="font-size: 25px; border-radius: 50%; background-color: #2f4c7e; color: #fff"
                      ></i>TOTAL USERS
                    </b>
                  </div>
                  <p style="font-size: 75px; transition-delay: 2s" class="font-bebas">
                    <b>40</b>
                  </p>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-6">
              <q-card class="my-card dashboard-cards">
                <q-card-section class="text-center">
                  <div class="text-grey font-raleway" style="font-size: 18px; ">
                    <b>
                      <i
                        class="fas fa-user-check q-mr-md q-pa-sm"
                        style="font-size: 25px; border-radius: 50%; background-color: #2f4c7e; color: #fff"
                      ></i> VERIFIED CLIENT
                    </b>
                  </div>
                  <p style="font-size: 75px" class="font-bebas">
                    <b>18</b>
                  </p>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-xs">
            <div class="col-12 col-md-6">
              <q-card class="my-card dashboard-cards">
                <q-card-section class="text-center">
                  <div class="text-grey font-raleway" style="font-size: 18px">
                    <b>
                      <i
                        class="fas fa-money-bill-wave q-mr-md q-pa-sm"
                        style="font-size: 25px; border-radius: 50%; background-color: #2f4c7e; color: #fff"
                      ></i>DEPOSIT
                    </b>
                  </div>
                  <p style="font-size: 55px" class="font-bebas">
                    <b>$ 18,809</b>
                  </p>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-6">
              <q-card class="my-card dashboard-cards">
                <q-card-section class="text-center">
                  <div class="text-grey font-raleway" style="font-size: 18px">
                    <b>
                      <i
                        class="fas fa-money-bill-wave q-mr-md q-pa-sm"
                        style="font-size: 25px; border-radius: 50%; background-color: #2f4c7e; color: #fff"
                      ></i>WIRE TRANSFER
                    </b>
                  </div>
                  <p style="font-size: 55px" class="font-bebas">
                    <b>$ 38,189</b>
                  </p>
                </q-card-section>
              </q-card>
            </div>
          </div>
      </div>-->
      <!-- <div class="col-12 col-md-6"> -->
      <!-- <div class="row">
      <div class="col-12 col-md-10">-->
      <!-- <q-card class="my-card dashboard-cards" style="height: 390px;">
            <q-card-section class="text-center">
              <div class="text-grey font-raleway" style="font-size: 40px">
                <b>PROFIT</b>
              </div>
              <q-circular-progress
                show-value
                font-size="40px"
                :value="value"
                size="200px"
                :thickness="0.22"
                color="accent"
                track-color="grey-3"
                class="q-ma-md font-bebas"
              >
                <b>{{ value }}%</b>
              </q-circular-progress>
            </q-card-section>
      </q-card>-->
      <!-- </div>
      </div>-->
      <!-- </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import UserTable from "../Admin/DashboardTable/UserTable";
import AddFundsTransactionTable from "../Admin/DashboardTable/AddFundsTransactionTable";
import KycPendingTable from "../Admin/DashboardTable/KycPendingTable";
import KycRejectedTable from "../Admin/DashboardTable/KycRejectedTable";
import KycApprovedTable from "../Admin/DashboardTable/KycApprovedTable";
import WireTransferTable from "../Admin/DashboardTable/WireTransferTransactionTable";
import ConversionFrequencyTable from "../Admin/DashboardTable/ConversionFrequencyTable";
import InternalTransferFee from "../Admin/DashboardTable/InternalTransferFee";
import ConversionFee from "../Admin/DashboardTable/ConversionFee";
import WireTransferFee from "../Admin/DashboardTable/WireTransferFee";
import CancelationFee from "../Admin/DashboardTable/CancelationFee";
import ManagementFee from "../Admin/DashboardTable/ManagementFee";
import PerformanceFee from "../Admin/DashboardTable/PerformanceFee";

export default {
  data: () => ({
    moment: moment,
    date: "",
    value_transactions: 10,
    value_verfied_client: 35,
    value_users: 20,
    value: 81,
    filter: "",
  }),

  components: {
    PerformanceFee,
    ManagementFee,
    CancelationFee,
    WireTransferFee,
    ConversionFee,
    InternalTransferFee,
    ConversionFrequencyTable,
    AddFundsTransactionTable,
    KycPendingTable,
    KycRejectedTable,
    KycApprovedTable,
    UserTable,
    WireTransferTable,
  },
  mounted() {
    this.role = this.$user_info.user_role;

    if (this.role == "Encoder") {
      this.$router.push({ path: "/admin/admin_add_account" });
    }
  },

  methods: {},
};
</script>
<style>
.welcome-banner {
  font-size: 18px;
}
.container-admin-dashboard {
  padding: 10px 80px;
}
.deposit-card {
  background-color: rgb(69, 161, 100);
}
.withdraw-card {
  background-color: rgb(71, 153, 235);
}
.user-card {
  background-color: rgb(209, 103, 103);
}
.container-p {
  font-size: 18px;
}
.p-font {
  font-size: 75px;
}
.badge-font {
  font-size: 15px;
}
#first-option {
  margin-top: 30px;
}
#second-option {
  margin-top: 30px;
}
</style>

<style>
@media (max-width: 1023px) {
  .container-admin-dashboard {
    padding: 10px;
  }
  #first-option {
    padding: 0 10px;
  }
  #add-fund-history {
    padding: 0 10px;
    margin-top: 20px;
    margin-left: 0;
  }
  #second-option {
    padding: 0 10px;
  }
  div #carousel {
    margin-top: 20px;
  }
}
</style>