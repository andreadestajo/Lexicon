<template>
  <div>
    <div>
      <q-card class="border-deposit">
          <!-- Manual add funds component -->
            <div>
              <u-q-manual-add-funds />
              <div class="q-px-md">
              <!-- <q-btn
                type="submit"
                @click="isManual = false"
                color="accent"
                unelevated
                class="full-width"
                outline
                to="/home/dashboard"
              >Cancel</q-btn> -->
              </div>
            </div>
            <!-- end of Manual add funds component -->
      </q-card>
    </div>
  </div>
</template>
<script>
import UQManualAddFunds from "../components/UQManualAddFundsTwo";
export default {
  data() {
    return {
      emails: [
        {
          id: 1,
          title: "Hi"
        },
        {
          id: 2,
          title: "Hello"
        }
      ],
      tab: "USD",
      isManual: false
    };
  },
  components: { UQManualAddFunds },
  methods: {}
};
</script>
<style>
.border-deposit
{
  border-radius: 30px;
   border: 4px solid #2f4c7e;
  transition: 0.5s;
  box-shadow: 0px 0px 5px 0.5px #2f4c7e;
}
.border-deposit:hover {
  box-shadow: 0px 0px 15px 0.5px #2f4c7e;
}
.btn-manual {
  background-color: transparent;
  border: none;
}
</style>