<template>
  <div>
    <q-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <p
        class="address-header-banner text-center font-header"
      >Please make sure all information below are correct before proceeding</p>
      <p class="personal-header-banner text-italic text-left font-header">
        Items with an asterisk
        <strong style="font-size: 1.3rem;">(&#42;)</strong> has to be filled out
      </p>
      <p class="id-header-banner font-header text-center">Which ID would you like to use?</p>
      <!-- <div class="field q-mt-md">
        <label>Type of ID</label>
        <div>
          <q-select v-model="form_data.identification_card" :options="id" outlined dense />
        </div>
      </div>-->

      <div class="field q-mt-md">
        <q-select
          v-model="id"
          behavior="menu"
          color="accent"
          label="*ID"
          :options="identification"
          outlined
          :rules="[val => !!val]"
        />
      </div>

      <div class="field q-mt-md" v-if="id == '(Others)' || id == 'Government ID'">
        <div>
          <q-input
            v-model="other_id"
            color="accent"
            placeholder="*Indicate ID"
            outlined
            :rules="[val => !!val]"
          ></q-input>
        </div>
      </div>

      <div class="field q-mt-md">
        <div>
          <q-input
            v-model="form_data.id_number"
            placeholder="*ID Number"
            outlined
            color="accent"
            :rules="[val => !!val]"
          ></q-input>
        </div>
      </div>

      <div class="field q-mt-md">
        <label>*Expiration Date</label>
        <div>
          <q-input
            v-model="form_data.id_expiry"
            :disable="is_no_expiration"
            type="date"
            data-date-format="DD MMMM YYYY"
            outlined
            dense
            color="accent"
            class="expiry-date"
          ></q-input>
          <q-checkbox type="submit" v-model="is_no_expiration" label="ID does not expire" />
        </div>
      </div>

      <!-- <div class="field q-mt-md">
        <label>*Upload image</label>
        <div>
          <q-input
            v-model="form_data.id_image"
            type="file"
            placeholder="ID Picture"
            color="accent"
            ref="file"
            @change="uploadFile1"
            :rules="[val => !!val]"
            accept="image/jpeg, image/jpg, image/png"
            outlined
            dense
          ></q-input>
        </div>
      </div>-->
      <div class="field q-mt-md">
        <label>*Upload image</label>
        <div>
          <u-q-uploader @upload="uploadFile1" ref="uploader" :is_zoomable="true" :color="'accent'" />
        </div>
      </div>

      <div class="text-center q-mt-md q-mb-md font-header" style="color: red">
        <b>Note: Make sure that image is clear and characters can be identified.</b>
      </div>

      <div class="row">
        <div class="col-6">
          <q-btn
            rounded
            flat
            class="field q-mt-md back-btn"
            icon="fas fa-long-arrow-alt-left"
            size="15px"
            @click="stepBack"
          />
        </div>
        <div class="col-6 text-right">
          <q-btn
            rounded
            type="submit"
            label="Proceed"
            :loading="loading2"
            class="field q-mt-md btn-continue btn-size"
            :disable="is_submit_disable"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import moment                       from 'moment-timezone';
import imageCompression             from 'browser-image-compression';
import UQUploader                   from '../UQUploader';
import ids                          from "../../references/ids";
import { putUpdateKycId, putStepDown, postGetKyc } from "../../references/url";
export default {
  name: "UQKycId",
  components: {
    UQUploader,
  },
  props: {},
  data: () => ({
    moment: moment,
    identification: ids,
    loading2: false,
    is_no_expiration: false,
    is_submit_disable: false,
    id: "",
    other_id: "",
    form_data: {
      identification_card: "",
      id_image: null,
      id_number: "",
      id_expiry: "",
    },
  }),
  async mounted() {
    let kyc_info = await this.getKycByUserId(this.$user_info._id);
    this.form_data.id_number            = kyc_info.id_number;
    this.form_data.id_expiry            = kyc_info.id_expiry;
    console.log(kyc_info)
    if(kyc_info.has_id_expiry == true)
    {
        this.form_data.id_expiry = kyc_info.id_expiry != null ? kyc_info.id_expiry : this.moment().tz("Europe/London").format('YYYY-MM-DD');
        // this.form_data.id_expiry = kyc_info.id_expiry != null || kyc_info.id_expiry == '' ? kyc_info.id_expiry : this.moment().format('YYYY-MM-DD');
    }
    else 
    {
        this.is_no_expiration   = true;
    }
  },
  methods: {
    async stepBack() {
      // let res = await this.$_put(putStepDown);
      // if (res.hasOwnProperty("data")) {
      this.$_update_step(0);
      // }
    },
    byteToMb(byte) {
      const megabyte = 0.000001;
      console.log(byte * megabyte);
      return byte * megabyte;
    },

    async uploadFile1(files) {
      try {
        let maximumMbSize = 10;
        this.form_data.id_image = files[0];
        if (this.byteToMb(this.form_data.id_image.size) > maximumMbSize) {
          console.log(this.form_data.id_image);
          this.form_data.id_image = null;
          // this.$q.notify({
          //         type: `negative`,
          //         message: `Image must not exceed to ${maximumMbSize}mb`,
          //         position: 'top',
          //         actions: [
          //         { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
          //         ],
          // });
          this.$q.notify({
            message: `<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Image must not exceed to ${maximumMbSize}mb.</div>`,
            position: "top",
            color: "white",
            html: true,
          });
          this.$refs.uploader.reset();
        } else {
          const options = {
            maxSizeMB: 10,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            onProgress: this.imageCompressionProgress,
          };
          this.$q.loading.show();
          const compressedFile = await imageCompression(
            this.form_data.id_image,
            options
          );
          this.form_data.id_image = compressedFile;
          this.$q.loading.hide();
        }
        console.log(this.form_data.id_image);
      } catch (error) {
        console.log(error);
      }
    },
    async imageCompressionProgress(progress) {
      this.is_submit_disable = progress < 100 ? true : false;
    },
    async handleSubmit() {
      try {
        this.form_data.user_id = this.$user_info._id;
        console.log(this.form_data);
        //expiry disable
        if (this.is_no_expiration == true) {
          this.form_data.id_expiry = null;
        }

        this.form_data.identification_card =
          this.id == "Others" ? this.other_id : this.id;

        const fd = new FormData();
        fd.append("user_id", this.form_data.user_id);
        fd.append(
          "identification_card",
          this.form_data.identification_card.toUpperCase()
        );
        fd.append("id_image_path", this.form_data.id_image);
        fd.append("id_number", this.form_data.id_number);
        fd.append("id_expiry", this.form_data.id_expiry);
        fd.append("has_id_expiry", !this.is_no_expiration);
        this.loading2 = true;
        let res = await this.$_put(putUpdateKycId, fd);
        this.loading2 = false;
        if (res.data.status == "success") {
          this.loading2 = false;
          this.$_update_step(1);
          window.scrollTo(0, 0);
        } /* else {
                this.loading2 = false;
            } */
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    async getKycByUserId(user_id) {
      let res = await this.$_post(postGetKyc, { user_id });
      return res.data;
    },
  },
};
</script>
<style scoped>
.expiry-date {
  padding-bottom: 0px;
}
.id-header-banner {
  margin: 20px 0px 50px 00px;
}
.btn-continue {
  background-color: #2f4c7e;
  color: white;
}
.back-btn {
  background-color: #2f4c7e;
  color: white;
}
</style>