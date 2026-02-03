<script setup>
  import { reactive, ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from "../../stores/user";
  import axios from "axios";
  import HeaderHome from "../components/HeaderHome.vue";

  const router = useRouter();
  const userStore = useUserStore();
  const days = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
  const kcalUser = ref(0);
  const userDiet = reactive({}); // Diet built by the user
  const selectedDayIndex = ref(0);
  const currentDay = computed(() => days[selectedDayIndex.value]);
  const openDishes = ref(new Set());

  // Initialize the user's diet object with empty meals for each day of the week
  days.forEach((day) => {
    userDiet[day] = {
      colazione: { dish: null, time: "" },
      pranzo: { dish: null, time: "" },
      merenda: { dish: null, time: "" },
      cena: { dish: null, time: "" }
    };
  });

  // Contains all dishes fetched from the database, grouped by meal type
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

  // Loads the user's daily calories
  const getKcal = async () => {
    try {
      const resProfile = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`);
      kcalUser.value = resProfile.data.kcal;
      console.log("KCAL USER:", kcalUser.value);
    } catch (error) {
      console.error("Errore caricamento piatti:", error);
    }
  }

  // Load all the dishes and categorize them by meal type
  const getDishes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/dishes");
      res.data.dishes.forEach((piatto) => {
        const piattoScalato = scaleDish(piatto, piatto.categoria);
        mealsByType[piatto.categoria].push(piattoScalato); // Insert the dish into the correct category array
      });
    } catch (error) {
      console.error("Errore caricamento piatti:", error);
    }
  }

  // Returns the user's calorie target based on meal category
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

  //Save the created diet
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

  // Collapsible menu for dish details
  const toggleDish = (id) => {
    if (openDishes.value.has(id)) {
      openDishes.value.delete(id);
    } else {
      openDishes.value.add(id);
    }
  };

  // Scale the dish ingredients and calories according to the target kcal for the meal category
  const scaleDish = (piatto, categoria) => {
    const targetKcal = getTargetKcal(categoria);
    if (!targetKcal || !piatto.kcal)
      return { ...piatto, kcalTotali: piatto.kcal };
    const fattore = targetKcal / piatto.kcal;
    const ingredientiScalati = piatto.ingredienti.map(ing => ({
      ...ing,
      peso: Math.round(ing.peso * fattore),
      kcal: Math.round(ing.kcal * fattore)
    }));
    const kcalTotali = ingredientiScalati.reduce((acc, ing) => acc + ing.kcal, 0);
    return {
      ...piatto,
      ingredienti: ingredientiScalati,
      kcalTotali
    };
  };

  // Return a textual description of the dish based on how its calories compare to the target
  const descrizioneKcal = (piatto) => {
    if (!piatto.kcalTotali || !piatto.categoria) {
      return '';
    }
    const target = getTargetKcal(piatto.categoria);
    const percentuale = ((piatto.kcalTotali - target) / target) * 100;
    if (percentuale < -10) return "Opzione leggera";
    if (percentuale <= 10) return "Opzione equilibrata";
    if (percentuale > 10) return "Opzione abbondante";
  };

  const goToPreviousDay = () => {
    if (selectedDayIndex.value > 0) {
      selectedDayIndex.value--;
      openDishes.value.clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextDay = () => {
    if (selectedDayIndex.value < days.length - 1) {
      selectedDayIndex.value++;
      openDishes.value.clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getDishImage = (imageName) => {
    return imageName ? `/images/dishes/${imageName}` : '';
  };

  onMounted(async () => {
    await userStore.fetchUser(router);
    await getKcal();
    await getDishes();
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
        <h3>{{ mealCategory }}</h3>

        <h3>Target calorico: {{ getTargetKcal(mealCategory) }} kcal</h3>

        <div class="time-field">
          <label>Orario</label>
          <input type="time" v-model="userDiet[currentDay][mealCategory].time" required />
        </div>


        <div v-for="piatto in mealsByType[mealCategory]" :key="piatto._id" class="dish-option">

          <!-- Radio buttons allow a single choice per meal.
          :name creates a unique group per day and meal.
          :value binds the selected dish.
          v-model saves the dish for the selected day and meal. -->
          <div class="dish-header">
            <label class="dish-label">
              <input type="radio" :name="`${currentDay}-${mealCategory}`" :value="piatto"
                v-model="userDiet[currentDay][mealCategory].dish" />

              <img class="dish-img" :src="getDishImage(piatto.immagine)" :alt="piatto.nome" />

              {{ piatto.nome }}
            </label>

            <button class="toggle-btn" @click="toggleDish(piatto._id)">
              {{ openDishes.has(piatto._id) ? '▲' : '▼' }}
            </button>
          </div>

          <div v-if="openDishes.has(piatto._id)" :class="['dish-details', mealCategory]">

            <div class="ingredients">
              <h4>Ingredienti</h4>
              <ul>
                <li v-for="(ing, i) in piatto.ingredienti" :key="i">
                  <span class="ing-name">{{ capitalizeFirst(ing.nome) }}</span>
                  <span class="ing-weight">{{ ing.peso }} g</span>
                </li>
              </ul>
            </div>

            <div v-if="piatto.info" class="dish-info">
              <h4>Note nutrizionali</h4>
              <ul>
                <li class="badge">{{ descrizioneKcal(piatto) }}</li>
                <li>{{ piatto.info[1].descrizioneTipoDieta }}</li>
                <li>{{ piatto.info[2].descrizioneIntolleranze }}</li>
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

  $blue-shadow: rgba(109, 200, 212, 0.2);
  $orange-shadow: rgba(248, 150, 4, 0.15);
  $blue-dark-shadow: rgba(85, 100, 182, 0.15);

  .componi-dieta {
    max-width: 900px;
    margin: 0 auto;
    padding: 160px 16px 1px;

    .day-block {
      margin-bottom: 32px;
      border-radius: 16px;
      background: linear-gradient(180deg, $bg-day-start, $bg-day-end);
      box-shadow: 0 8px 100px rgba($black, 0.06);
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
          background: $white;
          padding: 8px 12px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba($black, 0.05);
          font-weight: 500;

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: $green-hover;
          }
        }
      }

      .meal-block {
        margin-bottom: 28px;
        padding: 20px;
        border-radius: 16px;
        background: $white;
        border: 3px solid $colazione-color;
        box-shadow: 0 6px 16px rgba($black, 0.04);

        &.colazione {
          border-color: $colazione-color;
        }

        &.pranzo {
          border-color: $pranzo-color;
        }

        &.merenda {
          border-color: $merenda-color;
        }

        &.cena {
          border-color: $cena-color;
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
      background: $green-light;
      border-radius: 999px;

      label {
        font-weight: 600;
      }

      input[type="time"] {
        border: none;
        background: transparent;
        font-size: 14px;
        color: $green-dark;
        padding: 0;

        &:focus {
          outline: none;
        }
      }
    }

    .dish-option {
      margin-bottom: 26px;

      .dish-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dish-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-weight: 500;

          .dish-img {
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

      .dish-details {
        margin: 12px auto 0;
        padding: 16px 18px;
        max-width: 400px;
        background: $green-light;
        border-radius: 14px;
        border-left: 4px solid;
        animation: fadeIn $transition-fast;

        &.colazione {
          border-left-color: $colazione-color;
        }

        &.pranzo {
          border-left-color: $pranzo-color;
        }

        &.merenda {
          border-left-color: $merenda-color;
        }

        &.cena {
          border-left-color: $cena-color;
        }

        h4 {
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .ingredients,
        .dish-info {
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

        .dish-info {
          margin-top: 30px;
        }

        .ingredients {
          li {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            padding-top: 5px;
            border-bottom: 1px dashed $gray-muted;

            &:last-child {
              border-bottom: none;
            }

            .ing-name {
              color: $black;
              font-weight: 500;
            }

            .ing-weight {
              color: $black;
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
          background: $blue-shadow;
        }

        &.pranzo .badge {
          background: $orange-shadow;
        }

        &.merenda .badge {
          background: $green-shadow;
        }

        &.cena .badge {
          background: $blue-dark-shadow;
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
        background: $green-hover;
        color: $green-dark;
        font-size: 15px;
        font-weight: 700;
        border: 2px solid $green-light;
        cursor: pointer;
        transition: all $transition-fast;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        &:hover:not(:disabled) {
          background: $green-light;
          border-color: $green-hover;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba($green-hover, 0.2);
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
      background: $green-hover;
      color: $white;
      font-weight: 700;
      border: none;

      &:hover {
        background: $green-main;
      }
    }
  }
</style>