<script setup>
  import { reactive, ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user';
  import axios from "axios";

  const router = useRouter();
  const userStore = useUserStore();

  const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const kcalUser = ref(0);  //dieta costruita dall'utente per ogni giorno
  const userDiet = reactive({}); //kcal dell'utente

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
      cena: null,
    };
  });

  onMounted(async () => {
    try {
      const resProfile = await axios.get("http://localhost:5000/users/${userStore.id}/profile");
      kcalUser.value = resProfile.data.kcalTotali;

      //resetta gli array per evitare duplicati in seguito al ricaricamentto della pagina
      mealsByType.colazione = [];
      mealsByType.pranzo = [];
      mealsByType.merenda = [];
      mealsByType.cena = [];

      const res = await axios.get("http://localhost:5000/recipes", userStore.id);

      res.data.forEach((ricetta) => { //per ogni ricetta recuperata
        mealsByType[ricetta.categoria].push(ricetta); //inserisce quella ricetta nell'array giusto in base alla sua categoria
      });

    } catch (error) {
      console.error("Errore caricamento ricette:", error);
    }
  });

  //mostra il target calorico dell'utente in base alla categoria di pasto
  const getTargetKcal = (categoria) => {
    if (!kcalTotali.value) {
      return 0;
    }

    switch (categoria) {
      case "colazione": return Math.round(kcalTotali.value * 0.25);
      case "pranzo": return Math.round(kcalTotali.value * 0.35);
      case "merenda": return Math.round(kcalTotali.value * 0.10);
      case "cena": return Math.round(kcalTotali.value * 0.30);
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

</script>

<template>
  <div>
    <h1>Componi Dieta</h1>
  </div>
</template>


<style scoped></style>
