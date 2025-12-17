<!-- componente home -->

<script setup>
import HeaderUser from "@/components/HeaderUser.vue";
import NavBar from "@/components/NavBar.vue"; 
import AreaDieta from "./AreaDieta.vue";

import { useRouter } from "vue-router";

const router = useRouter();

const vaiAComponiDieta = () => {
  router.push({ name: "ComponiDieta" });
};

 </script>

<template>
  <div class="home-container">
    <HeaderUser />
    <NavBar />
    <div class="actions">
      <button @click="vaiAComponiDieta">
        Componi Dieta
      </button>
    </div>
    <AreaDieta />
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
}

.actions {
  text-align: center;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>

<!--magari aggiungere un più nel bottone e verificare come mette i componenti-->