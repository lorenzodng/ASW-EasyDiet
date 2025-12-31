<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/user";
import HeaderHome from "./HeaderHome.vue"

const userStore = useUserStore();

const peso = ref(0);
const obiettivoPeso = ref(0);
const obiettivo = ref("");
const loading = ref(true);

// carica dati utente
const loadUserInfo = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/users/${userStore.id}/profile`
    );

    peso.value = data.peso;
    obiettivoPeso.value = data.obiettivoPeso;
    obiettivo.value = data.obiettivo;
  } catch (err) {
    console.error("Errore caricamento dati", err);
  } finally {
    loading.value = false;
  }
};

// calcolo progresso
const progress = computed(() => {
  if (!peso.value || !obiettivoPeso.value) return 0;

  const min = Math.min(peso.value, obiettivoPeso.value);
  const max = Math.max(peso.value, obiettivoPeso.value);

  const percent = (min / max) * 100;
  return Math.round(percent);
});
onMounted(loadUserInfo);
</script>

<template>
  <div>
  <HeaderHome :userName="userStore.nome" />
  <div class="tracking-container">
    <h2>Tracking Peso</h2>

    <p v-if="loading">Caricamento...</p>

    <div v-else>
      <p><strong>Peso attuale:</strong> {{ peso }} kg</p>
      <p><strong>Obiettivo:</strong> {{ obiettivoPeso }} kg</p>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <p class="percent">{{ Math.round(progress) }}%</p>
    </div>
  </div>
  </div>
</template>

<style scoped>
.tracking-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px 0;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.4s ease;
}

.percent {
  font-weight: bold;
}
</style>