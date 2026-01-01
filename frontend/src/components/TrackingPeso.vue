<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/user";
import HeaderHome from "./HeaderHome.vue"

const userStore = useUserStore();

const pesi = ref([]);
const obiettivoPeso = ref(0);
const obiettivo = ref("");
const loading = ref(true);



// carica dati utente
const loadUserInfo = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/users/${userStore.id}/profile`
    );

    pesi.value = data.pesi || [];
    obiettivoPeso.value = data.obiettivoPeso;
    obiettivo.value = data.obiettivo;
  } catch (err) {
    console.error("Errore caricamento dati", err);
  } finally {
    loading.value = false;
  }
};

// calcolo progresso
//const pesoIniziale = pesi.value[0].peso

const storicoPesi = computed(() => {
  return [...pesi.value].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );
});


const pesoIniziale = computed(() => {
  return pesi.value.length ? pesi.value[0].peso : 0;
});



const pesoAttuale = computed(() => {
  return pesi.value.length
    ? pesi.value[pesi.value.length - 1].peso
    : 0;
});

const progress = computed(() => {
  if (!pesi.value.length || !obiettivoPeso.value) return 0;

  let percent = 0;

  if (obiettivo.value === "dimagrimento") {
  const totale = pesoIniziale.value - obiettivoPeso.value;
  const fatto = pesoIniziale.value - pesoAttuale.value;
  percent = (fatto / totale) * 100;
}
  if (obiettivo.value === "aumento_peso") {
  const totale = obiettivoPeso.value - pesoIniziale.value;
  const fatto = pesoAttuale.value - pesoIniziale.value;
  percent = (fatto / totale) * 100;
}
if (obiettivo.value === "mantenimento") {
  const tolleranza = 1; // kg
  const maxDiff = 8;   // oltre questo sei fuori target

  const diff = Math.abs(pesoAttuale.value - pesoIniziale.value);

  if (diff <= tolleranza) {
    percent = 100;
  } else {
    percent = 100 - ((diff - tolleranza) / maxDiff) * 100;
  }
}  // se ci si allontana di 2 kg siamo a 80% 4 kg a 40% maggiore di target kg a 0%



  return Math.min(Math.max(Math.round(percent), 0), 100);

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
      <p><strong>Peso attuale:</strong> {{ pesoAttuale }} kg</p>

      <p><strong>Obiettivo:</strong> {{ obiettivoPeso }} kg</p>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <p class="percent">{{ Math.round(progress) }}%</p>
      <div class="storico">
  <h3>Storico pesi</h3>

  <ul v-if="storicoPesi.length">
    <li
      v-for="(p, index) in storicoPesi"
      :key="index"
      :class="{ current: index === 0 }"
    >
      <span class="date">
        {{ new Date(p.data).toLocaleDateString() }}
      </span>
      <span class="peso">
        {{ p.peso }} kg
      </span>
    </li>
  </ul>

  <p v-else class="empty">
    Nessun peso registrato
  </p>
</div>

    </div>
  </div>
  </div>
</template>

<style scoped>
  .storico {
  margin-top: 25px;
  text-align: left;
}

.storico h3 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 16px;
}

.storico ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.storico li {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 6px;
  border-radius: 6px;
  background-color: #f5f5f5;
  font-size: 14px;
}

.storico li.current {
  background-color: #e8f5e9;
  font-weight: bold;
}

.date {
  color: #555;
}

.peso {
  color: #2e7d32;
}

.empty {
  text-align: center;
  color: #888;
  font-style: italic;
}

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