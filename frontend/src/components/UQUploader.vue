<template>
    <div>
        <q-uploader
            @added="uploadFile"
            :rules="[val => !!val]"
            accept="image/jpeg, image/jpg, image/png"
            outlined
            dense
            :color="color"
            hide-upload-btn
            ref="uploader" >
        <!-- <q-btn v-if="$props.is_zoomable"
            @click="showImage">
            Zoom Image
        </q-btn> -->
        <template v-slot:list="scope">
        <q-list separator>

        <div v-if="$props.is_zoomable == true">
            <q-item  v-for="file in scope.files" :key="file.name">
                <q-item-section>

                    <q-item-label caption style="text-align: center;">
                        Click on image to zoom.
                    </q-item-label>

                </q-item-section>

                <q-item-section
                    v-if="file.__img"
                    thumbnail
                    class=""
                    >
                    <img :src="file.__img.src" title="Click to zoom" @click="showImage">
                </q-item-section>

                <q-item-section top side>
                <q-btn
                    class=""
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file)"
                />
                </q-item-section>
            </q-item>
        </div>
        <div v-if="$props.is_zoomable == false">
          <q-item  v-for="file in scope.files" :key="file.name">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>

              <q-item-label caption>
                Status: {{ file.__status }}
              </q-item-label>

              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="file.__img"
              thumbnail
              class="gt-xs"
            >
              <img :src="file.__img.src">
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </q-item-section>
          </q-item>
          </div>

        </q-list>
      </template>
        </q-uploader>
        <u-q-modal ref="image_modal" v-if="$props.is_zoomable" :modal_data="modal_data" :is_persistent="false">
            <div slot="modal-header"></div>
            <div slot="modal-content" slot-scope="props">
                <img :src="props.data.file.__img.src" />
            </div>
            <div slot="modal-footer"></div>
        </u-q-modal>
    </div>
</template>
<script>
import UQModal from "./UQModal"
export default {
    name: "UQUploader",
    props: {
        is_zoomable: {type: Boolean, default: false},
        color: {type: String, default: "blue"}
    },
    components : {
        UQModal,
    },
    data: () => ({
        modal_data: {
            file: {}
        }
    }),
    mounted() {
        console.log(this.$el.querySelector('div.q-uploader__file.relative-position.q-uploader__file--img'))
    },
    methods: {
        async uploadFile(file) {
            this.$emit('upload', file);
            this.modal_data.file = file[0];
        },

        async reset()
        {
            this.$refs.uploader.reset()
        },

        async showImage()
        {
            console.log('this.$refs.image_modal')
            this.$refs.image_modal.showModal()
        }
    }
}
</script>

<style scoped>
div.q-uploader.column.no-wrap {
    width: 100%; 
    max-height: 70vh;
}
div.q-uploader__file.relative-position.q-uploader__file--img
{
    height: 70vh; 
    max-height: 70vh;
}
div.q-uploader__title, div.q-uploader__subtitle
{
    display: none;
}
div.q-item__section.column.gt-xs.q-item__section--thumbnail.q-item__section--side.justify-center > img
{
    cursor: pointer;
}
</style>