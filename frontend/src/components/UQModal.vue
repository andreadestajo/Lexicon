=========================================
Title: Design
Author: Pergentino S. Galang II
Date: 12 Aug 2020
Contributor:
=========================================

<template>
  <div>
    <q-dialog v-model="is_show" :persistent="is_persistent">
      <q-card :style="'max-width: none;' + $props.modal_style">
        <q-card-section class="font-monseratt text-weight-bold">
          <slot name="modal-header" :data="$props.modal_data"></slot>
        </q-card-section>

        <q-card-section class="q-pt-none font-monseratt text-weight-bold">
          <slot name="modal-content" :data="$props.modal_data"></slot>
        </q-card-section>

        <q-card-actions align="right" class="font-oswald text-weight-bold buttons">
          <slot name="modal-footer" :data="$props.modal_data"></slot>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "UQModal",
  data: () => ({
    is_show: false,
  }),
  props: {
    card_width: { type: String, default: "600px" },
    card_section_height: { type: String, default: "20vh" },
    is_persistent: { type: Boolean, default: true },
    modal_data: { type: Object, default: {} },
    modal_style: { type: String, default: "" },

    // Header
    title: "",
    icon: "",
  },
  methods: {
    showModal() {
      this.is_show = true;
    },
    hideModal() {
      this.is_show = false;
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style>
.buttons {
  letter-spacing: 3px;
}
</style>