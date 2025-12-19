<!-- componente home -->

<script setup>
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import NavBar from "./NavBar.vue";
  import AreaDieta from "./AreaDieta.vue";
  import HeaderHome from "./HeaderHome.vue";

  const router = useRouter();
  const userStore = useUserStore()
  const userName = userStore.nome

  const vaiAComponiDieta = () => {
    router.push({ name: "ComponiDieta" });
  };

</script>

<template>
  <div class="home-container">
    <HeaderHome :userName="userName" /> <!--passo la variabile al componente-->
    <NavBar />
    <div class="actions">
      <button @click="vaiAComponiDieta">
        ➕ Componi Dieta
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