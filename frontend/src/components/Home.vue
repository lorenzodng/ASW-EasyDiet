<!-- componente home -->

<script setup>
import NavBar from "./NavBar.vue"; 
import AreaDieta from "./AreaDieta.vue";
import { useRouter } from "vue-router";
import HeaderHome from "./HeaderHome.vue";
import { ref } from "vue";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("accounts")); //local storage per fissare il nome anche quando si ricarica la pagina 

//variabile reattiva
const userName = ref(user ? user.nome : "");

const vaiAComponiDieta = () => {
  router.push({ name: "ComponiDieta" });
};

 </script>

<template>
  <div class="home-container">
    <HeaderHome :username="userName"/>  <!--passo la variabile al componente-->
    <NavBar />
    <div class="actions">
      <button @click="vaiAComponiDieta">
       ➕  Componi Dieta
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