<template>
  <div class="q-pa-md q-mt-xl kyc-table">
    <q-markup-table>
      <thead class="bg-teal text-white">
        <tr>
          <th colspan="7">
            <div class="row no-wrap items-center">
              <div class="text-h4 q-ml-md text-white">KYC Information</div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">Full Name</th>
          <th class="text-center">Country</th>
          <th class="text-center">Identification Card</th>
          <th class="text-center">Contact</th>
          <th class="text-center">Status</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="kyc in kyc_list" :key="kyc._id">
          <td class="text-center">{{kyc.user_id}}</td>
          <td class="text-center">{{ kyc.first_name}} {{ kyc.middle_name}} {{ kyc.last_name}}</td>
          <td class="text-center">{{kyc.country}}</td>
          <td class="text-center">{{kyc.identification_card}}</td>
          <td class="text-center">({{kyc.contact_code}}){{kyc.contact}}</td>
          <td class="text-center">Pending</td>
          <td class="text-center q-gutter-sm">
            <q-btn color="accent" label="Accept" />
            <q-btn color="red" glossy label="Reject" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import { getAllKycInfo } from "../../references/url";
export default {
  data() {
    return {
      filter: "",
      columns: [
        // {
        //   name: "desc",
        //   required: true,
        //   label: "Dessert (100g serving)",
        //   align: "left",
        //   field: row => row.name,
        //   format: val => `${val}`,
        //   sortable: true
        // },
        {
          name: "fullname",
          align: "left",
          label: "Full Name",
          field: "fullname"
        },
        {
          name: "address",
          align: "left",
          label: "Address",
          field: "address"
        },
        {
          name: "contact",
          align: "left",
          label: "Contact Number",
          field: "contact"
        },
        {
          name: "identification_card",
          align: "left",
          label: "Identification Card",
          field: "identification_card"
        },
        {
          name: "action",
          align: "left",
          label: "Action",
          field: "action"
        }
      ],
      data: [
        {
          fullname: "Pergentino S. Galang II",
          address: "Malolos, Bulacan",
          contact: "09567326252",
          identification_card: "Passport",
          action: ""
        },
        {
          fullname: "John Raymund",
          address: "Pasig",
          contact: "09567326252",
          identification_card: "Passport"
        },
        {
          fullname: "Paul Musa",
          address: "Cavite",
          contact: "09567326252",
          identification_card: "Passport"
        }
      ],
      kyc_list: []
    };
  },
  mounted() {
    this.getKyc();
  },
  methods: {
    async getKyc() {
      this.$q.loading.show();
      let res = await this.$_post(getAllKycInfo);
      //   if (res) {
      //     this.kyc_list = res;
      //   }
      this.kyc_list = res.data;
      this.$q.loading.hide();
      console.log(res);
    }
  }
};
</script>
<style>
</style>