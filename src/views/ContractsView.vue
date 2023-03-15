<template>
  <div id="launch_bottom">
    <div class="launch_bottom_connet">
      <div class="contracts">
        <div>
          <span>
            <img
              class="token_icon"
              src="@/assets/filecoin-logo.svg"
              width="25"
              height="25"
            />
          </span>
          <span>FILaunch</span>
        </div>
        <div>
          <span>
            <img
              class="token_icon"
              src="@/assets/twitter43.svg"
              width="20"
              height="20"
          /></span>
          <span>
            <img
              class="token_icon"
              src="@/assets/medium.svg"
              width="20"
              height="20"
          /></span>
        </div>
      </div>
    </div>
    <div class="resources">
      <p>Resources</p>
      <p>Audit</p>
      <p>Contracts</p>
      <p><a href="https://filaunch.gitbook.io/filaunch/">Documentation</a></p>
      <p>Contract Us</p>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data: function () {
    return {
      width: "20px",
    };
  },
};
</script>

<style scoped>
@import "@/assets/css/contracts.css";
</style>
