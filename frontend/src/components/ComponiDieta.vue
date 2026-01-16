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
    <h1>Componi Dieta</h1>
    <h2 class="day-title">
      {{ currentDay }}
    </h2> <!--cambia automaticamente quando cambia selectedDayIndex-->

    <div v-for="mealCategory in ['colazione', 'pranzo', 'merenda', 'cena']" :key="mealCategory" class="meal-block">
      <!--vue crea 4 blocchi, uno per ogni categoria -->
      <h3>{{ mealCategory }}</h3> <!--mostra il nome del pasto corrente-->

      <h3>Target calorico: {{ getTargetKcal(mealCategory) }} kcal</h3>

      <label>Orario:<input type="time" v-model="userDiet[currentDay][mealCategory].time" required /></label>

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
          <p><strong>Ingredienti:</strong></p>

          <ul>
            <li v-for="(ing, i) in ricetta.ingredienti" :key="i">
              {{ ing.nome }} : {{ ing.peso }} g
            </li>
          </ul>

          <div v-if="ricetta.info" class="recipe-info"> <!--le note verranno mostrate solo se esiste info-->
            <strong>Note:</strong>

            <ul>
              <li>
                {{ descrizioneKcal(ricetta) }}
              </li>

              <li>
                {{ ricetta.info[1].descrizioneTipoDieta }}
              </li>

              <li>
                {{ ricetta.info[2].descrizioneIntolleranze }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 10px;"></div> <!-- spazio -->

    <!-- Navigazione giorni -->
    <div class="navigation">
      <button @click="goToPreviousDay" :disabled="selectedDayIndex === 0">
        ← Giorno precedente
      </button>

      <button @click="goToNextDay" :disabled="selectedDayIndex === days.length - 1">
        Giorno successivo →
      </button>
    </div>

    <div style="height: 50px;"></div> <!-- spazio -->

    <!-- Salva -->
    <button v-if="selectedDayIndex === days.length - 1" class="save-btn" @click="saveDiet">
      Salva dieta
    </button>
  </div>
</template>


<style scoped>
.day-title {
  text-align: center;
  margin-bottom: 20px;
}

.meal-block {
  margin-bottom: 24px;
}

.recipe-option {
  margin-left: 16px;
  margin-bottom: 6px;
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.save-btn {
  display: block;
  margin: 32px auto;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-info {
  margin-top: 10px;
  font-size: 14px;
  color: #444;
}


.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.recipe-details {
  margin-left: 24px;
  margin-top: 8px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.recipe-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.recipe-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}
</style>