<script setup>
  import { reactive, ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import axios from "axios";

  const router = useRouter();
  const userStore = useUserStore();

  const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

  //pasti per categoria
  const pastiPerCategoria = reactive({
    colazione: [],
    pranzo: [],
    merenda: [],
    cena: []
  });

</script>

<template>
  <div>
    <h1>Componi Dieta</h1>
  </div>
</template>


<style scoped></style>
