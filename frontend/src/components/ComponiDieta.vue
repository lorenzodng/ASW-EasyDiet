<script setup>
  import { reactive, ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user';
  import axios from "axios";

  const router = useRouter();
  const userStore = useUserStore();
  const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
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
      colazione: null,
      pranzo: null,
      merenda: null,
      cena: null
    };
  });

  onMounted(async () => {
    try { //recupero profilo utente per le kcal
      const resProfile = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`);
      kcalUser.value = resProfile.data.kcalTotali;
      console.log("KCAL USER:", kcalUser.value);


      //resetta gli array per evitare duplicati in seguito al ricaricamentto della pagina
      mealsByType.colazione = [];
      mealsByType.pranzo = [];
      mealsByType.merenda = [];
      mealsByType.cena = [];

      const res = await axios.get("http://localhost:5000/recipes");

      res.data.forEach((ricetta) => { //per ogni ricetta recuperata
        mealsByType[ricetta.categoria].push(ricetta); //inserisce quella ricetta nell'array giusto in base alla sua categoria
      });

    } catch (error) {
      console.error("Errore caricamento ricette:", error);
    }
  });

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
      const { data } = await axios.post("http://localhost:5000/diets");

      if (data.status) {
        alert("Dieta salvata con successo");

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


</script>

<template>
  <div class="componi-dieta">
    <h1>Componi Dieta</h1>
    <h2 class="day-title">
      {{ currentDay }}  
    </h2> <!--cambia automaticamente quando cambia selectedDayIndex-->

    <!-- Navigazione giorni -->
    <div class="navigation">
      <button
        @click="selectedDayIndex--"
        :disabled="selectedDayIndex === 0"
      > <!--torna al giorno precedente è disabilitato se si è già a lunedì-->
        ← Giorno precedente
      </button>

      <button
        @click="selectedDayIndex++"
        :disabled="selectedDayIndex === days.length - 1"
      > 
        Giorno successivo →
      </button>
    </div>


    <div
      v-for="meal in ['colazione', 'pranzo', 'merenda', 'cena']"
      :key="meal"
      class="meal-block"
    > <!--vue crea 4 blocchi, uno per ogni categoria -->
      <h3>{{ meal }}</h3>  <!--mostra il nome del pasto corrente-->

      <div
        v-for="ricetta in mealsByType[meal]"
        :key="ricetta._id"
        class="recipe-option"
      >  <!--prende solo le ricette per quella determinata categoria--> 
        
        <div class="recipe-header">
          <label>
            <input
              type="radio"
              :name="`${currentDay}-${meal}`"
              :value="ricetta"
              v-model="userDiet[currentDay][meal]"
            />
            {{ ricetta.nome }}
          </label> <!--con radio si ha una sola scelta per ogni gruppo, con :name="${currentDay}-${meal}" si crea un gruppo diverso
          per ogni giorno e ogni pasto, con v-model="userDiet[currentDay][meal]" si salva automaticamente la ricetta-->

          <button
            class="toggle-btn"
            @click="toggleRecipe(ricetta._id)"
          > <!--se l'id è nel set dettagli aperti se no dettagli chiusi-->
            {{ openRecipes.has(ricetta._id) ? '▲' : '▼' }}
          </button>
        </div>

        <div
          v-if="openRecipes.has(ricetta._id)"
          class="recipe-details"
        >
          <p><strong>Ingredienti:</strong></p>

          <ul>
            <li
              v-for="(ing, i) in ricetta.ingredienti"
              :key="i"
            >
              {{ ing.nome }} : {{ ing.peso }} g
            </li>
          </ul>

          <div
            v-if="ricetta.info"
            class="recipe-info"
          ><!--le note verranno mostrate solo se esiste info-->
            <strong>Note:</strong>

            <ul>
              <li>
                {{ ricetta.info[0].descrizioneKcal }}
              </li> <!--prima nota-->

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

    
    <!-- Salva -->
    <button
      v-if="selectedDayIndex === days.length - 1"
      class="save-btn"
      @click="saveDiet"
    >
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

</style>