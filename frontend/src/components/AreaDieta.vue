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
  });
</script>

<template>
  <div class="area-dieta">

    <p v-if="loading">Caricamento dieta...</p>


    <p v-else-if="error">{{ error }}</p>


    <div v-else>
      <div v-for="day in days" :key="day" class="day-block">
        <h2>{{ day }}</h2>

        <div v-for="meal in ['colazione', 'pranzo', 'merenda', 'cena']" :key="meal" class="meal-block">
          <h3>{{ meal }}</h3>

          <div v-if="diet.settimana[day][meal].recipe">
            <p><strong>{{ diet.settimana[day][meal].recipe.nome }}</strong></p>

            <ul>
              <li v-for="(ing, i) in diet.settimana[day][meal].recipe.ingredienti" :key="i">
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

<style scoped>
  .area-dieta {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
  }

  .area-dieta h1 {
    text-align: center;
    margin-bottom: 32px;
  }

  /* BLOCCO GIORNO */
  .day-block {
    margin-bottom: 32px;
    padding: 20px;
    border-radius: 12px;
    background-color: #f7f9fc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .day-block h2 {
    text-transform: capitalize;
    margin-bottom: 16px;
    color: #2c3e50;
  }

  /* BLOCCO PASTO */
  .meal-block {
    margin-bottom: 16px;
    padding: 12px 16px;
    border-left: 4px solid #4caf50;
    background-color: #ffffff;
    border-radius: 8px;
  }

  .meal-block h3 {
    text-transform: capitalize;
    margin-bottom: 8px;
    color: #333;
  }

  /* RICETTA */
  .meal-block p {
    margin: 4px 0;
  }

  .meal-block ul {
    margin: 8px 0 0 16px;
    padding: 0;
  }

  .meal-block li {
    font-size: 14px;
    margin-bottom: 4px;
  }

  /* STATO VUOTO */
  .empty {
    font-style: italic;
    color: #999;
  }

  /* LOADING / ERROR */
  .area-dieta p {
    text-align: center;
    font-size: 16px;
  }
</style>
