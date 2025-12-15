<!-- componente home -->

<script setup>
import { ref } from "vue"

const msg = ref("Welcome to the app") //variabile reattiva
</script>

<template>
  <h1>{{ msg }}</h1> 
</template>

<style scoped></style>