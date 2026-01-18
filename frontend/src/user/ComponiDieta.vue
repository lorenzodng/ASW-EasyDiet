<script setup>
  import { reactive, ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user';
  import axios from "axios";

  const router = useRouter();
  const userStore = useUserStore();
  const days = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
  const kcalUser = ref(0); //kcal dell'utente
  const userDiet = reactive({}); //dieta costruita dall'utente per ogni giorno
  const selectedDayIndex = ref(0); //indice del giorno corrente  
  const currentDay = computed(() => days[selectedDayIndex.value]); //giorno corrente 
  const openRecipes = ref(new Set()); //ricette aperte tramite menu, contiene solo gli id 

  //contiene tutte le ricette caricate dal db, ordinate per categoria
  const mealsByType = reactive({
    colazione: [],
    pranzo: [],
    merenda: [],
    cena: []
  });

  days.forEach((day) => { //per ogni elemento di "days"
    userDiet[day] = { //crea una coppia chiave-valore con chiave il giorno della settimana e valori le categorie di pasto
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
      res.data.forEach((ricetta) => { //per ogni ricetta recuperata
        const ricettaScalata = scaleRecipe(ricetta, ricetta.categoria);
        mealsByType[ricetta.categoria].push(ricettaScalata); //inserisce quella ricetta nell'array giusto in base alla sua categoria
      });
    } catch (error) {
      console.error("Errore caricamento ricette:", error);
    }
  }

  //mostra il target calorico dell'utente in base alla categoria di pasto
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
        alert("Dieta salvata con successo");
        router.push({ name: "Home" });

      } else {
        alert("Errore: " + data.message);
      }
    } catch (err) {
      alert("Errore nel salvataggio della dieta");
      console.error(err);
    }
  };

  //menu a scomparsa per i dettagli della ricetta
  const toggleRecipe = (id) => {
    if (openRecipes.value.has(id)) { //se la ricetta è già aperta
      openRecipes.value.delete(id); //chiude il menu di quella ricetta
    } else { //altrimenti
      openRecipes.value.add(id); //apre il menu della ricetta 
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
      kcalTotali // aggiungiamo la proprietà kcalTotali
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
  <div class="componi-dieta">
    <h2 class="day-title">
      {{ currentDay }}
    </h2> <!--cambia automaticamente quando cambia selectedDayIndex-->
    <div class="kcal-legend">
      <div class="legend-item">
        <span class="dot"></span>
        <span><strong>Leggera</strong> – sotto il target calorico</span>
      </div>

      <div class="legend-item">
        <span class="dot"></span>
        <span><strong>Equilibrata</strong> – vicina al target calorico</span>
      </div>

      <div class="legend-item">
        <span class="dot"></span>
        <span><strong>Abbondante</strong> – sopra il target calorico</span>
      </div>
    </div>


    <div v-for="mealCategory in ['colazione', 'pranzo', 'merenda', 'cena']" :key="mealCategory" class="meal-block">
      <!--vue crea 4 blocchi, uno per ogni categoria -->
      <h3>{{ mealCategory }}</h3> <!--mostra il nome del pasto corrente-->

      <h3>Target calorico: {{ getTargetKcal(mealCategory) }} kcal</h3>

      <div class="time-field">
        <label>Orario</label>
        <input type="time" v-model="userDiet[currentDay][mealCategory].time" required />
      </div>


      <div v-for="ricetta in mealsByType[mealCategory]" :key="ricetta._id" class="recipe-option">
        <!--prende solo le ricette per quella determinata categoria-->

        <!-- con radio si ha una sola scelta per ogni gruppo, 
        con :name="${currentDay}-${meal}" si crea un gruppo diverso per ogni giorno e ogni pasto, 
        con :value="ricetta" si specifica l'elemento collegato a v-model, 
        con v-model="userDiet[currentDay][meal]" si salva automaticamente la ricetta per il giorno (currentDay) e per la categoria indicata (mealCategory) -->
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

        <div v-if="openRecipes.has(ricetta._id)" class="recipe-details">

          <div class="ingredients">
            <h4>Ingredienti</h4>
            <ul>
              <li v-for="(ing, i) in ricetta.ingredienti" :key="i">
                <span class="ing-name">{{ ing.nome }}</span>
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

    <div style="height: 10px;"></div> <!-- spazio -->

    <!-- Navigazione giorni -->
    <div class="navigation">
      <button @click="goToPreviousDay" :disabled="selectedDayIndex === 0">
        Giorno precedente
      </button>

      <button @click="goToNextDay" :disabled="selectedDayIndex === days.length - 1">
        Giorno successivo
      </button>
    </div>

    <div style="height: 50px;"></div> <!-- spazio -->

    <!-- Salva -->
    <button v-if="selectedDayIndex === days.length - 1" class="save-btn" @click="saveDiet">
      Salva dieta
    </button>
  </div>
</template>


<style scoped lang="scss">
  .componi-dieta {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px;

  }

  .day-title {
    text-align: center;
    margin-bottom: 32px;
    font-size: 28px;
    font-weight: 700;
    color: #1b5e20;
    text-transform: capitalize;
  }

  .kcal-legend {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

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
  }

  /* pallino neutro */
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4caf50;
    /* colore unico */
  }

  .time-field {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 6px 12px;
    background: #f1f8f4;
    border-radius: 999px;

    label {
      font-size: 12px;
      color: #388e3c;
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

  .meal-block {
    margin-bottom: 28px;
    padding: 20px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

    h3:first-of-type {
      text-transform: capitalize;
      color: #1b5e20;
      margin-bottom: 6px;
    }

    h3:last-of-type {
      font-size: 14px;
      font-weight: 500;
      color: #4caf50;
      margin-bottom: 14px;
    }
  }


  .recipe-option {
    margin-bottom: 10px;
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


  .recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }


  .toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }

  .recipe-details {
    margin: 12px auto 0;
    padding: 16px 18px;
    max-width: 600px;
    background: #f1f8f4;
    border-radius: 14px;
    border-left: 4px solid #4caf50;
    font-size: 14px;
    animation: fadeIn 0.25s ease;
  }


  .recipe-details h4 {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #1b5e20;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  /* INGREDIENTI */
  .ingredients ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .recipe-info ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .ingredients li {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px dashed #c8e6c9;

    &:last-child {
      border-bottom: none;
    }
  }

  .ing-name {
    color: #2e7d32;
    font-weight: 500;
  }

  .ing-weight {
    font-weight: 600;
    color: #555;
  }

  /* NOTE */

  .recipe-info {
    margin-top: 14px;
    font-size: 14px;
    color: #444;

    ul {
      list-style: none;
      margin: 0;
    }

    li {
      margin-bottom: 6px;
    }
  }


  /* BADGE kcal */
  .badge {
    display: inline-block;
    padding: 4px 10px;
    background: #c8e6c9;
    color: #1b5e20;
    border-radius: 999px;
    font-weight: 700;
    font-size: 12px;
    width: fit-content;
  }



  .recipe-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-weight: 500;
  }

  .recipe-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
  }
</style>