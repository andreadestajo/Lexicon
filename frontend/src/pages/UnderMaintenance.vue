<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound__container">
        <img class="notfound__img" src="computer-settings.gif" />
      </div>
      <h2>Sorry for the inconvenience</h2>
      <p class="q-px-md">We are currently doing maintenance work. We will be back soon!</p>
      <div>
        <Countdown end="August 28, 2020"></Countdown>
      </div>
    </div>
  </div>
</template>

<script>
import UnderMaintenance from "./undermaintenance.scss";
import Countdown from "vuejs-countdown";
export default {
  components: { Countdown },
};
</script>
