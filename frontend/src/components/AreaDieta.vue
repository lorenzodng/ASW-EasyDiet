<!-- componente area dieta -->

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const diet = ref(null);
const loading = ref(true);
const error = ref("");

const days = [
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
  "domenica"
];

onMounted(async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/diets/${userStore.id}`
    );

    if (res.data.status) {
      diet.value = res.data.data;
    } else {
      error.value = "Nessuna dieta trovata";
    }
  } catch (err) {
    error.value = "Errore nel recupero della dieta";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>



<template>
  <div class="area-dieta">
    <h1>Area Dieta</h1>

    <!-- LOADING -->
    <p v-if="loading">Caricamento dieta...</p>

    <!-- ERRORE -->
    <p v-else-if="error">{{ error }}</p>

    <!-- DIETA -->
    <div v-else>
      <div
        v-for="day in days"
        :key="day"
        class="day-block"
      >
        <h2>{{ day }}</h2>

        <div
          v-for="meal in ['colazione', 'pranzo', 'merenda', 'cena']"
          :key="meal"
          class="meal-block"
        >
          <h3>{{ meal }}</h3>

          <div v-if="diet.settimana[day][meal]">
            <p><strong>{{ diet.settimana[day][meal].nome }}</strong></p>
            <p>Kcal: {{ diet.settimana[day][meal].kcalTotali }}</p>

            <ul>
              <li
                v-for="(ing, i) in diet.settimana[day][meal].ingredienti"
                :key="i"
              >
                {{ ing.nome }} – {{ ing.peso }} g
              </li>
            </ul>
          </div>

          <p v-else class="empty">
            Nessuna ricetta selezionata
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


