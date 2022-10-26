<template>
  <div>
    <q-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- <p
        class="p-verification font-header text-center"
      >You're a few step from opening a LEXICON Bank Account!</p>
      <p
        class="p-verification-selfie font-header text-center"
      >Take a Selfie Check to complete your Virtual Verification</p>-->
      <p
        class="address-header-banner text-center font-header"
      >Please make sure all information below are correct before proceeding</p>
      <p
        class="personal-header-banner text-italic text-left font-header"
      >Items with an asterisk <strong style="font-size: 1.3rem;">	(&#42;)</strong> has to be filled out</p>
      <p
        class="p-verification font-header text-center"
      >You're almost there! Take a picture of yourself to complete your Virtual Verification.</p>

       <div class="field q-mt-md">
        <label>*Upload image</label>
        <div> 
            <u-q-uploader
                @upload="uploadFile2"
                ref="uploader"
                :is_zoomable="true"
                :color="'accent'"
            />
        </div>
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

      <!-- <q-btn color="secondary" label="Back" class="field q-mt-md" @click="stepBack" />
      <q-btn type="submit" color="primary" label="Continue" class="field q-mt-md" />-->
    </q-form>
  </div>
</template>

<script>
import imageCompression             from 'browser-image-compression';
import UQUploader                   from '../UQUploader';
import ids from "../../references/ids";
import { putUpdateKycSelfie, putStepDown } from "../../references/url";
export default {
  name: "UQKycSelfie",
  components: {
    UQUploader
  },
  props: {},
  data: () => ({
    ids,
    loading2: false,
    is_submit_disable: false,
    id: "",
    form_data: {
      selfie_image: null
    }
  }),
  methods: {
    byteToMb(byte) {
      const megabyte  = 0.000001;
      return byte * megabyte;
    },
    async uploadFile2(files) {
        try {
            let maximumMbSize           = 10;
            this.form_data.selfie_image = files[0];
            console.log(this.form_data.selfie_image)
            // if image exceeds to 10 mb, prevent from uploading
            if(this.byteToMb(this.form_data.selfie_image.size) > maximumMbSize)
            {
              this.form_data.selfie_image = null;
              // this.$q.notify({ 
              //           type: `negative`, 
              //           message: `image must not exceed to ${maximumMbSize}mb`,
              //           position: 'top',
              //           actions: [
              //           { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
              //           ], 
              //       });
              this.$q.notify({
                  message: `<div style="color: red; font-weight: bold;"><i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>Image must not exceed to ${maximumMbSize}mb.</div>`,
                  position: 'top',
                  color: 'white',
                  html: true,
              }); 
                    
              this.$refs.uploader.reset();
            }else {
              const options = {
                  maxSizeMB           : 10,
                  maxWidthOrHeight    : 1920,
                  useWebWorker        : true,
                  onProgress          : this.imageCompressionProgress
              }
              this.$q.loading.show();
              const compressedFile        = await imageCompression(this.form_data.selfie_image, options);
              this.$q.loading.hide();
              this.form_data.selfie_image = compressedFile;
            }
            console.log(this.form_data.selfie_image );
        } catch (error) {
            console.log(error);
        }
    },
    async stepBack() {
      // let res = await this.$_put(putStepDown);
      // if (res.hasOwnProperty("data")) {
        this.$_update_step(0);
      // }
    },
    async imageCompressionProgress (progress)
    {
        this.is_submit_disable = progress < 100 ? true : false;
    },
    async handleSubmit() {
      this.form_data.user_id = this.$user_info._id;

      const fd = new FormData();
      fd.append("user_id", this.form_data.user_id);
      fd.append("selfie_image_path", this.form_data.selfie_image);
      this.loading2 = true;
      let res = await this.$_put(putUpdateKycSelfie, fd);
      this.loading2 = false;

      if (res.data.status == 'success') {
        this.loading2 = false;
        this.$_update_step(1);
        window.scrollTo(0, 0);
      }
      console.log(fd);
    }
  }
};
</script>
<style scoped>
</style>
<style scoped>

.p-verification {
  padding: 20px 0 20px 0;
}

.p-verification-selfie {
  padding: 0px 0 20px 0;
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