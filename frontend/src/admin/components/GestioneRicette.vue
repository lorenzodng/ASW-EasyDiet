<script setup>
    import axios from "axios";
    import { ref, onMounted } from "vue";

    const recipes = ref([]);
    const loading = ref(true);
    const error = ref("");

    const showRecipeModal = ref(false);

    const recipeDetail = ref(null);

    const showForm = ref(false);

    const newRecipe = ref({
  nome: "",
  categoria: "",
  ingredienti: [
    { nome: "", peso: "", kcal: "" }
  ],
  kcal: "",
  info: {
    descrizioneKcal: "",
    descrizioneTipoDieta: "",
    descrizioneIntolleranze: ""
  }
});

const addIngredient = () => {
  newRecipe.value.ingredienti.push({
    nome: "",
    peso:"",
    kcal: ""
  });
};


  


    const openRecipeModal = (recipe) => {
  recipeDetail.value = recipe; // ✅ già completa
  showRecipeModal.value = true;
};


    const closeRecipeModal = () => {
  showRecipeModal.value = false;
  recipeDetail.value = null;
};

const saveRecipe = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/recipes",
      newRecipe.value
    );

    // aggiunge subito la ricetta alla tabella
    recipes.value.push(data);

    // reset form
    newRecipe.value = {
      nome: "",
      categoria: "",
      ingredienti: [{ nome: "", peso: "", kcal: "" }],
      kcal: "",
      info: {
        descrizioneKcal: "",
        descrizioneTipoDieta: "",
        descrizioneIntolleranze: ""
      }
    };

    showForm.value = false;
  } catch (err) {
    console.error(err);
    error.value = "Errore nel salvataggio della ricetta";
  }
};

    // 🔹 caricamento iniziale
    onMounted(async () => {
    try {
        const { data } = await axios.get("http://localhost:5000/recipes");
        recipes.value = data; // ← QUI
    } catch {
        error.value = "Errore di connessione";
    } finally {
        loading.value = false;
    }
});

</script>

<template>
    <div class="admin-page">
        <h1>Gestione Ricette</h1>

        <p v-if="loading">Caricamento ricette...</p>
        <p v-if="error" class="error">{{ error }}</p>
        <button @click="showForm = !showForm">
  ➕ Aggiungi ricetta
</button>



        <form v-if="showForm" class="recipe-form" @submit.prevent="saveRecipe">

  <input
  :value="newRecipe.nome"
  @input="newRecipe.nome = $event.target.value"
  placeholder="Nome ricetta"
  required
/>


  <select v-model="newRecipe.categoria" required>
    <option disabled value="">Seleziona categoria</option>
    <option value="colazione">Colazione</option>
    <option value="pranzo">Pranzo</option>
    <option value="merenda">Merenda</option>
    <option value="cena">Cena</option>
  </select>

  <h3>Ingredienti</h3>

  <div
    v-for="(ing, index) in newRecipe.ingredienti"
    :key="index"
    class="ingredient-row"
  >
    <input v-model="ing.nome" placeholder="Ingrediente" required />
    <input type="number" v-model.number="ing.peso" placeholder="g" required />
    <input type="number" v-model.number="ing.kcal" placeholder="kcal" required />
  </div>

  <button type="button" @click="addIngredient">
    ➕ Aggiungi ingrediente
  </button>

  <h3>Info</h3>

  <textarea
    v-model="newRecipe.info.descrizioneKcal"
    placeholder="Descrizione kcal"
  />
  <textarea
    v-model="newRecipe.info.descrizioneTipoDieta"
    placeholder="Tipo dieta"
  />
  <textarea
    v-model="newRecipe.info.descrizioneIntolleranze"
    placeholder="Intolleranze"
  />

  <input
    type="number"
    v-model.number="newRecipe.kcal"
    placeholder="Kcal totali"
    required
  />

  <button type="submit">💾 Salva ricetta</button>
  <button type="button" @click="showForm = false">
  ❌ Annulla
</button>

</form>

        <table v-if="!loading && recipes.length" class="recipes-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="recipe in recipes" :key="recipe._id">
                    <td>{{ recipe.nome }}</td>
                    <td>{{ recipe.categoria }}</td>
                    <td>
                        <button @click="openRecipeModal(recipe)">👁️</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="!loading && recipes.length === 0">
            Nessuna ricetta trovata
        </p>

        <!-- MODALE DETTAGLIO -->
        <div v-if="showRecipeModal" class="modal-overlay" @click.self="closeRecipeModal">
            <div class="modal">
                <h2>{{ recipeDetail?.nome }}</h2>

                

                <div v-if="recipeDetail">
                    <p><strong>Categoria:</strong> {{ recipeDetail.categoria }}</p>
                    <p><strong>Kcal totali:</strong> {{ recipeDetail.kcal }}</p>

                    <h3>Ingredienti</h3>
                    <div class="ingredient-list">
                        <p v-for="(ing, index) in recipeDetail.ingredienti" :key="index">
                           - {{ ing.nome }} : {{ ing.peso }}g  ({{ ing.kcal }} kcal)
                        </p>
                    </div>

                   <h3>Info</h3>

<p v-if="recipeDetail.info?.[1]"> {{ recipeDetail.info[1].descrizioneTipoDieta }} </p> 
<p v-if="recipeDetail.info?.[2]"> {{ recipeDetail.info[2].descrizioneIntolleranze }} </p>

                </div>

                <button @click="closeRecipeModal">Chiudi</button>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.admin-page {
  padding: 32px;

  h1 {
    color: #2e7d32;
    margin-bottom: 24px;
  }

  > button {
    margin-right: 8px;
    margin-bottom: 16px;
  }
}

/* ERRORI */
.error {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 12px;
}

/* BOTTONI */
button {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
}

button[type="submit"] {
  background-color: #4caf50;
  color: #fff;

  &:hover {
    background-color: #66bb6a;
  }
}

button[type="button"] {
  background-color: #e0e0e0;

  &:hover {
    background-color: #d5d5d5;
  }
}

/* FORM */
.recipe-form {
  background: #ffffff;
  padding: 20px;
  margin-bottom: 32px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  max-width: 600px;

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #4caf50;
    }
  }

  h3 {
    margin-top: 16px;
    margin-bottom: 8px;
    color: #388e3c;
  }
}

/* INGREDIENTI FORM */
.ingredient-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}

/* TABELLA */
.recipes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.12);

  thead {
    background-color: #4caf50;
    color: #ffffff;
  }

  th,
  td {
    padding: 14px 16px;
    text-align: left;
  }

  tbody tr {
    border-bottom: 1px solid #e0e0e0;

    &:hover {
      background-color: #f1f8f4;
    }
  }

  button {
    background: none;
    font-size: 18px;
  }
}

/* MODALE */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

  h2 {
    margin-bottom: 8px;
    color: #2e7d32;
  }

  h3 {
    margin-top: 16px;
    margin-bottom: 8px;
    color: #388e3c;
  }

  p {
    font-size: 14px;
    margin-bottom: 6px;
  }
}

/* INGREDIENTI MODALE */
.ingredient-list p {
  font-size: 14px;
  padding-left: 8px;
}
</style>
