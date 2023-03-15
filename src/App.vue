<script setup lang="ts">
import HeaderView from "./views/HeaderView.vue";
import ContractsView from "./views/ContractsView.vue";
</script>

<template>
  <HeaderView />
  <router-view></router-view>
  <ContractsView />
</template>

<style>

</style>
