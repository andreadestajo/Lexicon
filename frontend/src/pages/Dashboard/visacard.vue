// =========================================
// Title: Design
// Author: Gelo
// Date: 10 Aug 2020
// Contributor:
// =========================================
<template>
  <div class="q-pa-md positioning">
    <!-- <img class="bg-visa" src="white.png"/>
        <img class="visa-card-plat" src="visa-gold.png"/>
    <img class="visa-card-gold" src="visa-platinum.png"/> -->
    <h4 class="font-bebas">COMING SOON!</h4>
  </div>
</template>

<style scoped lang="scss">
.bg-visa {
  width: 700px;
  height: 400px;
  margin-top: 220px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: absolute;
  border-radius: 20px;
}
.positioning {
  display: flex;
  align-items: center;
  justify-content: center;
}
.visa-card-plat {
  width: 550px;
  height: 400px;
  z-index: 1;
  position: absolute;
  margin-top: 250px;
  margin-left: -50px;
}
.visa-card-gold {
  width: 550px;
  height: 400px;
  z-index: 0;
  position: absolute;
  margin-top: 200px;
  margin-left: 50px;
}
</style>