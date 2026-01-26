<script setup>
  import { reactive, ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user';
  import axios from "axios";
  import HeaderHome from "./HeaderHome.vue"

  const router = useRouter();
  const userStore = useUserStore();
  const days = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
  const kcalUser = ref(0);
  const userDiet = reactive({}); // diet built by the user, organized by day
  const selectedDayIndex = ref(0); // index of the currently selected day 
  const currentDay = computed(() => days[selectedDayIndex.value]); // current day labe
  const openRecipes = ref(new Set());

  // contains all recipes fetched from the database, grouped by meal type
  const mealsByType = reactive({
    colazione: [],
    pranzo: [],
    merenda: [],
    cena: []
  });

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  days.forEach((day) => { // for each day of the week
    userDiet[day] = { // creates a key-value pair with the weekday as key and meal categories as value
      colazione: { recipe: null, time: "" },
      pranzo: { recipe: null, time: "" },
      merenda: { recipe: null, time: "" },
      cena: { recipe: null, time: "" }
    };
  });

  const getKcal = async () => {
    try {
      const resProfile = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`);
      kcalUser.value = resProfile.data.kcal;
      console.log("KCAL USER:", kcalUser.value);
    } catch (error) {
      console.error("Errore caricamento ricette:", error);
    }
  }

  const getRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recipes");
      res.data.recipes.forEach((ricetta) => {
        const ricettaScalata = scaleRecipe(ricetta, ricetta.categoria);
        mealsByType[ricetta.categoria].push(ricettaScalata); // insert the recipe into the correct category array
      });
    } catch (error) {
      console.error("Errore caricamento ricette:", error);
    }
  }

  // returns the user's calorie target based on meal category
  const getTargetKcal = (categoria) => {
    if (!kcalUser.value) {
      return 0;
    }

    switch (categoria) {
      case "colazione": return Math.round(kcalUser.value * 0.25);
      case "pranzo": return Math.round(kcalUser.value * 0.35);
      case "merenda": return Math.round(kcalUser.value * 0.10);
      case "cena": return Math.round(kcalUser.value * 0.30);
      default: return 0;
    }
  };

  const saveDiet = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/diets", {
        userId: userStore.id,
        settimana: userDiet
      });

      if (data.status) {
        router.push({ name: "Home" });
      }
    } catch (err) {
      alert("Errore nel salvataggio della dieta");
      console.error(err);
    }
  };

  // collapsible menu for recipe details
  const toggleRecipe = (id) => {
    if (openRecipes.value.has(id)) { // if the recipe is already open
      openRecipes.value.delete(id); // close that recipe's details
    } else { // otherwise open the recipe details
      openRecipes.value.add(id);
    }
  };

  const scaleRecipe = (ricetta, categoria) => {
    const targetKcal = getTargetKcal(categoria);
    if (!targetKcal || !ricetta.kcal) return { ...ricetta, kcalTotali: ricetta.kcal };

    const fattore = targetKcal / ricetta.kcal;

    const ingredientiScalati = ricetta.ingredienti.map(ing => ({
      ...ing,
      peso: Math.round(ing.peso * fattore),
      kcal: Math.round(ing.kcal * fattore)
    }));

    const kcalTotali = ingredientiScalati.reduce((acc, ing) => acc + ing.kcal, 0);

    return {
      ...ricetta,
      ingredienti: ingredientiScalati,
      kcalTotali // add the kcalTotali property
    };
  };

  const descrizioneKcal = (ricetta) => {
    if (!ricetta.kcalTotali || !ricetta.categoria) {
      return '';
    }

    const target = getTargetKcal(ricetta.categoria);
    const percentuale = ((ricetta.kcalTotali - target) / target) * 100;

    if (percentuale < -10) return "Opzione leggera";
    if (percentuale <= 10) return "Opzione equilibrata";
    if (percentuale > 10) return "Opzione abbondante";
  };

  const goToPreviousDay = () => {
    if (selectedDayIndex.value > 0) {
      selectedDayIndex.value--;
      openRecipes.value.clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextDay = () => {
    if (selectedDayIndex.value < days.length - 1) {
      selectedDayIndex.value++;
      openRecipes.value.clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getRecipeImage = (imageName) => {
    return imageName ? `/images/recipes/${imageName}` : '';
  };


  onMounted(() => {
    const init = async () => {
      await userStore.fetchUser(router);
      await getKcal();
      await getRecipes();
    };
    init();
  });
</script>

<template>
  <HeaderHome :userName="userStore.nome" />
  <div class="componi-dieta">
    <div class="day-block">
      <h2 class="day-title">{{ capitalizeFirst(currentDay) }}</h2>
      <!-- updates automatically when selectedDayIndex changes -->
      <div class="legend">
        <div class="legend-item">
          <span><strong>Leggera</strong> – sotto il target calorico</span>
        </div>

        <div class="legend-item">
          <span><strong>Equilibrata</strong> – vicina al target calorico</span>
        </div>

        <div class="legend-item">
          <span><strong>Abbondante</strong> – sopra il target calorico</span>
        </div>
      </div>

      <div v-for="mealCategory in ['colazione', 'pranzo', 'merenda', 'cena']" :key="mealCategory" class="meal-block"
        :class="mealCategory">

        <!-- Vue generates 4 blocks, one for each meal category -->
        <h3>{{ mealCategory }}</h3> <!-- displays the current meal name -->

        <h3>Target calorico: {{ getTargetKcal(mealCategory) }} kcal</h3>

        <div class="time-field">
          <label>Orario</label>
          <input type="time" v-model="userDiet[currentDay][mealCategory].time" required />
        </div>


        <div v-for="ricetta in mealsByType[mealCategory]" :key="ricetta._id" class="recipe-option">
          <!--Radio buttons allow a single choice per meal.
          :name creates a unique group per day and meal.
          :value binds the selected recipe.
          v-model saves the recipe for the selected day and meal.-->
          <div class="recipe-header">
            <label class="recipe-label">
              <input type="radio" :name="`${currentDay}-${mealCategory}`" :value="ricetta"
                v-model="userDiet[currentDay][mealCategory].recipe" />

              <img class="recipe-img" :src="getRecipeImage(ricetta.immagine)" :alt="ricetta.nome" />


              {{ ricetta.nome }}
            </label>

            <button class="toggle-btn" @click="toggleRecipe(ricetta._id)">
              {{ openRecipes.has(ricetta._id) ? '▲' : '▼' }}
            </button>
          </div>

          <div v-if="openRecipes.has(ricetta._id)" :class="['recipe-details', mealCategory]">

            <div class="ingredients">
              <h4>Ingredienti</h4>
              <ul>
                <li v-for="(ing, i) in ricetta.ingredienti" :key="i">
                  <span class="ing-name">{{ capitalizeFirst(ing.nome) }}</span>
                  <span class="ing-weight">{{ ing.peso }} g</span>
                </li>
              </ul>
            </div>

            <div v-if="ricetta.info" class="recipe-info">
              <h4>Note nutrizionali</h4>
              <ul>
                <li class="badge">{{ descrizioneKcal(ricetta) }}</li>
                <li>{{ ricetta.info[1].descrizioneTipoDieta }}</li>
                <li>{{ ricetta.info[2].descrizioneIntolleranze }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 10px;"></div>

    <div class="navigation">
      <button @click="goToPreviousDay" :disabled="selectedDayIndex === 0">
        Giorno precedente
      </button>

      <button @click="goToNextDay" :disabled="selectedDayIndex === days.length - 1">
        Giorno successivo
      </button>
    </div>

    <div style="height: 50px;"></div>

    <button v-if="selectedDayIndex === days.length - 1" class="save-btn" @click="saveDiet">
      Salva dieta
    </button>
  </div>
</template>

<style scoped lang="scss">
  .componi-dieta {
    max-width: 900px;
    margin: 0 auto;
    padding: 160px 16px 0;

    .day-block {
      margin-bottom: 32px;
      border-radius: 16px;
      background: linear-gradient(180deg, #def5e0, #dff1df);
      box-shadow: 0 8px 100px rgba(0, 0, 0, 0.06);
      padding-top: 3px;
      padding-bottom: 3px;

      .day-title {
        font-size: 29px;
        font-weight: 700;
        text-align: center;
        line-height: 1.3;
        margin-bottom: 32px;
        text-transform: capitalize;
      }

      .legend {
        display: flex;
        justify-content: center;
        gap: 18px;
        margin-bottom: 28px;
        flex-wrap: wrap;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          background: #ffffff;
          padding: 8px 12px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          font-weight: 500;

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #4caf50;
          }
        }
      }

      .meal-block {
        margin-bottom: 28px;
        padding: 20px;
        border-radius: 16px;
        background: #ffffff;
        border: 3px solid #36abbb;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);

        &.colazione {
          border-color: #36abbb;
        }

        &.pranzo {
          border-color: #f89604;
        }

        &.merenda {
          border-color: #4caf50;
        }

        &.cena {
          border-color: #5564b6;
        }

        h3 {
          margin-bottom: 6px;

          &:first-of-type {
            text-transform: capitalize;
            font-size: 21px;
          }

          &:last-of-type {
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 40px;
          }
        }
      }
    }

    .time-field {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 30px;
      padding: 6px 12px;
      background: #f1f8f4;
      border-radius: 999px;

      label {
        font-weight: 600;
      }

      input[type="time"] {
        border: none;
        background: transparent;
        font-size: 14px;
        color: #1b5e20;
        padding: 0;

        &:focus {
          outline: none;
        }
      }
    }

    .recipe-option {
      margin-bottom: 26px;

      .recipe-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .recipe-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-weight: 500;

          .recipe-img {
            width: 65px;
            height: 65px;
            object-fit: cover;
            border-radius: 999px;
          }
        }

        .toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
      }

      .recipe-details {
        margin: 12px auto 0;
        padding: 16px 18px;
        max-width: 400px;
        background: #f1f8f4;
        border-radius: 14px;
        border-left: 4px solid;
        animation: fadeIn 0.25s ease;

        &.colazione {
          border-left-color: #36abbb;
        }

        &.pranzo {
          border-left-color: #f89604;
        }

        &.merenda {
          border-left-color: #4caf50;
        }

        &.cena {
          border-left-color: #5564b6;
        }

        h4 {
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .ingredients,
        .recipe-info {
          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              margin-bottom: 6px;
              font-size: 14px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }

        .recipe-info {
          margin-top: 30px;
        }

        .ingredients {
          li {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            padding-top: 5px;
            border-bottom: 1px dashed #999;

            &:last-child {
              border-bottom: none;
            }

            .ing-name {
              color: #000000;
              font-weight: 500;
            }

            .ing-weight {
              color: #000000;
              font-weight: 600;
            }
          }
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 500;
          font-size: 12px;
          width: fit-content;
        }

        &.colazione .badge {
          background: rgba(109, 200, 212, 0.2);
        }

        &.pranzo .badge {
          background: rgba(248, 150, 4, 0.15);
        }

        &.merenda .badge {
          background: rgba(76, 175, 80, 0.15);
        }

        &.cena .badge {
          background: rgba(85, 100, 182, 0.15);
        }
      }
    }

    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin: 48px auto 0;
      max-width: 500px;

      button {
        flex: 1;
        padding: 14px 18px;
        border-radius: 14px;
        background: #64cb37;
        color: #1b5e20;
        font-size: 15px;
        font-weight: 700;
        border: 2px solid #c8e6c9;
        cursor: pointer;
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        &:hover:not(:disabled) {
          background: #e8f5e9;
          border-color: #4caf50;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(76, 175, 80, 0.2);
        }

        &:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
      }
    }

    .save-btn {
      display: block;
      margin: 40px auto;
      padding: 14px 28px;
      font-size: 16px;
      border-radius: 14px;
      background: #4caf50;
      color: white;
      font-weight: 700;
      border: none;

      &:hover {
        background: #388e3c;
      }
    }
  }
</style>