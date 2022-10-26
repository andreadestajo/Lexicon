<template>
  <div class="container-1">
    <div class="container-kyc">
      <u-q-kyc></u-q-kyc>
    </div>
  </div>
</template>
<script>
import UQKyc from "../../components/Kyc/UQKYC";
export default {
  components: { UQKyc }
};
</script>
<style>
.container-kyc {
  padding: 10px 300px 50px 300px;
  background-color: #f6f6f6;
  -webkit-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
  box-shadow: -3px 3px 23px 0px rgba(0, 0, 0, 0.75);
}
.container-1 {
  padding-bottom: 50px;
  padding-right: 350px;
  padding-left: 350px;
  padding-top: 20px;
}
@media (max-width: 999px) {
  .container-kyc {
    padding: 10px 20px 50px 20px;
  }
  .container-1 {
    padding-bottom: 50px;
    padding-right: 30px;
    padding-left: 30px;
    padding-top: 20px;
  }
}

@media (min-width: 794px) {
  .container-kyc {
    padding: 10px 50px 50px 50px;
  }
}
</style>