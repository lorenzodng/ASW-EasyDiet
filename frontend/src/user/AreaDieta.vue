<!-- componente area dieta -->

<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useUserStore } from "../stores/user";
  import { useDietStore } from "../stores/diet";

  const userStore = useUserStore();
  const dietStore = useDietStore();

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

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  //PRENDERE FETCH DIET DALLO STORE
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
                {{ capitalizeFirst(ing.nome) }} – {{ ing.peso }} g
              </li>
            </ul>
          </div>

          <p v-else class="empty">
            Nessun pasto selezionato
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
  .area-dieta {
    max-width: 700px;
    margin: 0 auto;
  }

  //CARD GIORNO
  .day-block {
    margin-bottom: 32px;
    border-radius: 16px;
    background: linear-gradient(180deg, #def5e0, #dff1df);
    box-shadow: 0 8px 100px rgba(0, 0, 0, 0.06);

    h2 {
      margin-bottom: 20px;
      text-transform: capitalize;
      font-size: 29px;
      color: #2c3e50;
      border-bottom: 1px solid #e0e6ef;
      padding-bottom: 8px;
    }
  }

  //LISTA PASTI
  .meal-block {
    margin-bottom: 15px;
    padding: 30px;
    border-radius: 12px;
    background-color: #ffffff;
    gap: 8px;
    text-align: left;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    }

    //badge del pasto
    .meal-badge {
      display: block;
      padding: 6px 14px;
      border-radius: 12px;
      font-size: 17px;
      font-weight: 600;
      text-transform: capitalize;
      color: white;
      text-align: center;
      width: 150px;
      margin: 6px auto 40px auto;


      &.colazione {
        background-color: #36abbb;
      }

      &.meal-badge.pranzo {
        background-color: #f89604;
      }

      &.meal-badge.merenda {
        background-color: #4caf50;
      }

      &.meal-badge.cena {
        background-color: #5564b6;
      }
    }

    //paragrafi e liste
    p {
      margin: 4px 0;
      font-size: 16px;
    }

    ul {
      margin: 8px 0 0 16px;

      li {
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 4px;
      }
    }

    //stato vuoto del pasto
    .empty {
      font-style: italic;
      color: #888;
    }
  }

  //NAVIGAZIONE GIORNI
  .day-navigation {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;

    //header navigazione
    .nav-buttons {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      pointer-events: none;

      button {
        pointer-events: auto;
        padding: 8px 14px;
        font-size: 18px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background-color: #3da73f;
        color: white;
        transition: background-color 0.2s ease, opacity 0.2s ease;

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        &:hover:not(:disabled) {
          background-color: #43a047;
        }

        &:first-child {
          margin-left: -200px;
        }

        &:last-child {
          margin-right: -200px;
        }
      }
    }
  }
</style>