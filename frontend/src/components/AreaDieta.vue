<!-- componente area dieta -->

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const diet = ref(null);
const loading = ref(true);
const error = ref("");
const currentDayIndex = ref(0);
const days = [
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
  "domenica"
];


const nextDay = () => {
  if (currentDayIndex.value < days.length - 1) {
    currentDayIndex.value++;
  }
};

const prevDay = () => {
  if (currentDayIndex.value > 0) {
    currentDayIndex.value--;
  }
};



const fetchDiet = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/diets/${userStore.id}`);
    console.log("USER ID:", userStore.id);

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
};

onMounted(() => {
  fetchDiet();
});
</script>

<template>
  <div class="area-dieta">

    <!-- LOADING -->
    <p v-if="loading">Caricamento dieta...</p>

    <!-- ERROR -->
    <p v-else-if="error">{{ error }}</p>

    <!-- CONTENUTO -->
    <div v-else class="day-navigation">

      <!-- BOTTONI DI NAVIGAZIONE -->
      <div class="nav-buttons">
        <button @click="prevDay" :disabled="currentDayIndex === 0">
          ◀
        </button>

        <button @click="nextDay" :disabled="currentDayIndex === days.length - 1">
          ▶
        </button>
      </div>

      <!-- GIORNO CORRENTE -->
      <div class="day-block">
        <h2>{{ days[currentDayIndex] }}</h2>

        <div v-for="meal in ['colazione', 'pranzo', 'merenda', 'cena']" :key="meal" class="meal-block">
          <span class="meal-badge" :class="meal">
            {{ meal }}
          </span>


          <div v-if="diet.settimana[days[currentDayIndex]][meal].recipe">
            <p>
              <strong>
                {{ diet.settimana[days[currentDayIndex]][meal].recipe.nome }}
              </strong>
            </p>

            <ul>
              <li v-for="(ing, i) in diet.settimana[days[currentDayIndex]][meal].recipe.ingredienti" :key="i">
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


<style scoped lang="scss">
.area-dieta {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

/* CARD GIORNO */
.day-block {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(180deg, #f9fbff, #f1f4f9);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

  h2 {
    margin-bottom: 20px;
    text-transform: capitalize;
    font-size: 22px;
    color: #2c3e50;
    border-bottom: 1px solid #e0e6ef;
    padding-bottom: 8px;
  }
}

/* LISTA PASTI */
.meal-block {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: #ffffff;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  .meal-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px; // ovale
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    color: white;
    width: fit-content;
  }

  .meal-badge.colazione {
    background-color: #fbc02d; // giallo
  }

  .meal-badge.pranzo {
    background-color: #4caf50; // verde
  }

  .meal-badge.merenda {
    background-color: #ff9800; // arancione
  }

  .meal-badge.cena {
    background-color: #3f51b5; // blu/viola
  }


  p {
    margin: 4px 0;
  }

  ul {
    margin: 8px 0 0 16px;

    li {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 4px;
    }
  }

  /* STATO VUOTO */
  .empty {
    font-style: italic;
    color: #888;
  }
}

.day-navigation {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* HEADER NAVIGAZIONE */
.nav-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  button {
    padding: 8px 14px;
    font-size: 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background-color: #4caf50;
    color: white;
    transition: background-color 0.2s ease, opacity 0.2s ease;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #43a047;
    }
  }
}
</style>
