=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div class>
    <!-- <q-btn @click="deleteAllUserInfo">Delete all User</q-btn> -->
    <div class="q-ma-lg">
      <div class>
        <u-q-table
          :tbl_title="table.title"
          :tbl_columns="table.columns"
          :tbl_data="table.data"
          :pgntn_is_show="false"
        >
          <template slot="table_rows" slot-scope="props">
            <q-td key="date_created">{{ moment(props.data.date_created).tz("Europe/London").format('DD-MMM-YYYY') }}</q-td>
            <q-td key="first_name">{{props.data.first_name}}</q-td>
            <q-td key="last_name">{{props.data.last_name}}</q-td>
            <q-td align="center">
              <q-btn flat @click="viewKyc(props.data)" class="text-white">
                <i class="fas fa-eye"></i>
              </q-btn>
            </q-td>
          </template>
        </u-q-table>
      </div>
    </div>

    <u-q-modal
      ref="kyc_modal"
      :is_persistent="true"
      :modal_data="modal.kyc_details"
      :modal_style="modal.style"
    >
      <div class="text-h6" slot="modal-header">Client Verification</div>
      <div slot="modal-content" slot-scope="props">
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>NAME</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.first_name}} {{props.data.middle_name}} {{props.data.last_name}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>GENDER</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.gender}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>BIRTHDATE</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.birthday}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>CONTACT NO</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.contact_code}} {{props.data.contact}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>ADDRESS</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.house_number}} {{props.data.address}} {{props.data.city}} {{props.data.zip_code}} {{props.data.country}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>NATIONALITY</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.nationality}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>ID</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.identification_card}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>ID Image</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-img
                @click="zoomImageIn(`https://${server.host}/user/${props.data.user_id}/images/${props.data.id_image_path}`)"
                :src="`https://${server.host}/user/${props.data.user_id}/images/${props.data.id_image_path}`"
              ></q-img>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Selfie Image</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-img
                @click="zoomImageIn(`https://${server.host}/user/${props.data.user_id}/images/${props.data.selfie_image_path}`)"
                :src="`https://${server.host}/user/${props.data.user_id}/images/${props.data.selfie_image_path}`"
              ></q-img>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>ID NUMBER</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.id_number}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>ID EXPIRY</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{props.data.has_id_expiry == true ? moment(props.data.id_expiry).tz("Europe/London").format('DD-MM-YYYY') : 'No expiration'}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div slot="modal-footer" slot-scope="props">
        <q-card-actions>
          <q-btn
            v-for="action in modal.actions"
            :color="action.color"
            :label="action.label"
            v-close-popup="action.label == 'Close' ? true : false"
            :key="action.key"
            :outline="action.label == 'Close' ? true : false"
            @click="action.label != 'Close' ? kycAction({user_id: props.data.user_id, action: action.key}) : ''"
            unelevated
          ></q-btn>
        </q-card-actions>
      </div>
    </u-q-modal>
    <u-q-modal ref="image_modal" :modal_data="image_modal" :is_persistent="false">
      <div class="text-h6" slot="modal-header"></div>
      <div class="text-h6" slot="modal-content" slot-scope="props">
        <div class="zoom-container">
          <img :src="props.data.src" />
        </div>
      </div>
      <div class="text-h6" slot="modal-footer"></div>
    </u-q-modal>

    <u-q-modal
      ref="confirmation_modal"
      :is_persistent="false"
      :modal_data="confirmation_modal.kyc_action"
    >
      <div
        class="text-h6"
        slot="modal-header"
        slot-scope="props"
      >Are you sure to {{props.data.action}} this KYC?</div>
      <div slot="modal-content" slot-scope="props">
        This action cannot be undone.
        <div v-if="props.data.action == 'reject'" class="q-mt-md">
          <q-select
            v-model="confirmation_modal.remark"
            :options="confirmation_modal.options.reject"
            label="Remarks"
            outlined
            :rules="[val => !!val || '*Field is required']"
          />
        </div>
        <div
          v-if="confirmation_modal.remark == 'Others' && props.data.action == 'reject'"
          class="q-mt-md"
        >
          <textarea
            v-model="confirmation_modal.other_remark"
            outline
            class="text-area-style"
            :rules="[val => !!val || '*Field is required']"
          ></textarea>
        </div>
      </div>
      <div slot="modal-footer" slot-scope="props">
        <q-card-actions>
          <q-btn
            color="accent"
            class="q-px-md"
            v-for="action in confirmation_modal.actions"
            :outline="action.label == 'No' ? true : false"
            :key="action.key"
            :label="action.label"
            v-close-popup="action.label == 'No' ? true : false"
            @click="action.label == 'Yes' ? confirmKycAction({user_id: props.data.user_id, action: props.data.action}) : confirmation_modal.model = ''"
            unelevated
          ></q-btn>
        </q-card-actions>
      </div>
    </u-q-modal>
  </div>
</template>


<script>
import moment from "moment";
import config from "../../../config";
import UQTable from "../../components/UQTable";
import UQModal from "../../components/UQModal";
import {
  getKycByStatus,
  putUpdateKycStatus,
  deleteAllUserInfo,
} from "../../references/url";
export default {
  components: {
    UQTable,
    UQModal,
  },
  data: () => ({
    moment: moment,
    server: {
      host: config.SERVER.HOST,
      port: config.SERVER.PORT,
    },
    table: {
      title: "Client Verification",
      columns: [
        {
          name: "date_created",
          label: "DATE ",
          field: "date_created",
          align: "left",
          sortable: true,
        },
        {
          name: "first_name",
          label: "FIRST NAME",
          field: "first_name",
          align: "left",
          sortable: true,
        },
        {
          name: "last_name",
          label: "LAST NAME",
          field: "last_name",
          align: "left",
          sortable: true,
        },

        { name: "action", label: "ACTION", field: "action", align: "center" },
      ],
      data: [],
    },
    modal: {
      kyc_details: {},
      actions: [
        {
          label: "Approve",
          icon: "fas fa-check",
          key: "approve",
          color: "accent",
        },
        { label: "Reject", icon: "fas fa-ban", key: "reject", color: "red" },
        {
          label: "Close",
          icon: "fas fa-window-close",
          key: "close",
          color: "accent",
        },
      ],
      style: "width: 45vw;",
    },
    image_modal: {
      src: "",
    },
    confirmation_modal: {
      kyc_action: {},
      actions: [
        { label: "Yes", color: "green" },
        { label: "No", color: "negative" },
      ],
      options: {
        reject: ["ID is blurred", "ID is already expired", "Others"],
        approve: [
          "Approve Comment1",
          "Approve Comment2",
          "Approve Comment3",
          "Approve Comment4",
          "Others",
        ],
      },
      remark: "ID is blurred",
      other_remark: "",
    },
  }),
  image_modal: {
    src: "",
  },
  confirmation_modal: {
    kyc_action: {},
    actions: [
      { label: "Yes", color: "green" },
      { label: "No", color: "red" },
    ],
    options: {
      reject: ["ID is blurred", "ID is already expired", "Others"],
      approve: [
        "Approve Comment1",
        "Approve Comment2",
        "Approve Comment3",
        "Approve Comment4",
        "Others",
      ],
    },
    remark: "ID is blurred",
    other_remark: "",
  },
  async mounted() {
    this.$q.loading.show();
    await this.setKycSubmits();
    this.$q.loading.hide();
  },
  computed: {},
  methods: {
    async viewKyc(kycData) {
      this.$q.loading.show();
      this.$refs.kyc_modal.showModal();
      delete kycData.step;

      kycData.id_expiry = moment(kycData.id_expiry).tz("Europe/London").format("DD-MMM-YYYY");
      kycData.birthday = moment(kycData.birthday).tz("Europe/London").format("DD-MMM-YYYY");

      this.modal.kyc_details = kycData;
      this.$q.loading.hide();
    },
    async kycAction(kycData) {
      this.confirmation_modal.kyc_action = {
        user_id: kycData.user_id,
        action: kycData.action,
      };
      this.$refs.confirmation_modal.showModal();
    },
    async confirmKycAction(kycData) {
      let form_data = {};
      form_data.user_id = kycData.user_id;
      if (kycData.action == "approve") {
        form_data.status = "APPROVED";
      } else if (kycData.action == "reject") {
        form_data.status = "REJECTED";
        form_data.message =
          this.confirmation_modal.comment == "Others"
            ? this.confirmation_modal.other_comment
            : this.confirmation_modal.comment;
      }
      this.$q.loading.show();
      let res = await this.$_put(putUpdateKycStatus, form_data);
      if (res.status == "success");
      {
        await this.setKycSubmits();
      }
      this.$refs.kyc_modal.hideModal();
      this.$refs.confirmation_modal.hideModal();
      this.$q.loading.hide();
    },
    async setKycSubmits() {
      let kyc_pending = await this.getKycByStatus("pending");
      if (kyc_pending.data.status == "success") {
        this.table.data = kyc_pending.data.data;
      } else if (kyc_pending.data.status == "error") {
        console.error(kyc_pending.data.message);
      }
    },

    async zoomImageIn(src) {
      this.image_modal.src = src;
      this.$refs.image_modal.showModal();
    },

    async getKycByStatus(status) {
      let form_data = {};
      form_data.status = status;
      let kyc = await this.$_post(getKycByStatus, form_data);
      return kyc;
    },

    async deleteAllUserInfo() {
      this.$_delete(deleteAllUserInfo);
    },
  },
};
</script>

<style>
.zoom-container {
  width: 100%;
  max-height: 80vh;
}
.zoom-container img {
  width: 100%;
}
.text-area-style {
  width: 100%;
  height: 20vh;
}
.fa-eye {
  color: green;
  font-size: 20px;
}
</style>
