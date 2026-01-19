<script setup>
  import axios from "axios";
  import { ref, onMounted } from "vue";

  import EliminazioneRicetta from "./EliminazioneRicetta.vue";
  import ModificaRicetta from "./ModificaRicetta.vue";
  import logo from "../assets/images/logo-easydiet.png"


  const recipes = ref([]);
  const loading = ref(true);
  const error = ref("");

  const showRecipeModal = ref(false);

  const recipeDetail = ref(null);

  const showForm = ref(false);

  const newRecipe = ref({
    nome: "",
    categoria: "",
    immagine: "",
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
      peso: "",
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
        "http://localhost:5000/admin/recipes",
        newRecipe.value
      );

      // aggiunge subito la ricetta alla tabella
      await loadRecipes();

      // reset form
      newRecipe.value = {
        nome: "",
        categoria: "",
        immagine: "",
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

  const loadRecipes = async () => {
    try {
      loading.value = true;
      const { data } = await axios.get("http://localhost:5000/recipes");
      recipes.value = data;
    } catch {
      error.value = "Errore di connessione";
    } finally {
      loading.value = false;
    }
  };



  onMounted(loadRecipes);


</script>

<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="admin-topbar">
        <img :src="logo" alt="EasyDiet logo" class="admin-logo" />

        <div class="admin-titles">
          <h1>Gestione Ricette</h1>
        </div>
      </div>
    </header>
    <p v-if="loading">Caricamento ricette...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <button class="add-button"  @click="showForm = !showForm">
      ➕ Aggiungi ricetta
    </button>



    <form v-if="showForm" class="recipe-form" @submit.prevent="saveRecipe">

      <input :value="newRecipe.nome" @input="newRecipe.nome = $event.target.value" placeholder="Nome ricetta"
        required />
      <input v-model="newRecipe.immagine" placeholder="URL immagine (es. /images/pasta.jpg)" required />



      <select v-model="newRecipe.categoria" required>
        <option disabled value="">Seleziona categoria</option>
        <option value="colazione">Colazione</option>
        <option value="pranzo">Pranzo</option>
        <option value="merenda">Merenda</option>
        <option value="cena">Cena</option>
      </select>

      <h3>Ingredienti</h3>

      <div v-for="(ing, index) in newRecipe.ingredienti" :key="index" class="ingredient-row">
        <input v-model="ing.nome" placeholder="Ingrediente" required />
        <input type="number" v-model.number="ing.peso" placeholder="g" required />
        <input type="number" v-model.number="ing.kcal" placeholder="kcal" required />
      </div>

      <button type="button" @click="addIngredient">
        ➕ Aggiungi ingrediente
      </button>

      <h3>Info</h3>

      <textarea v-model="newRecipe.info.descrizioneKcal" placeholder="Descrizione kcal" />
      <textarea v-model="newRecipe.info.descrizioneTipoDieta" placeholder="Tipo dieta" />
      <textarea v-model="newRecipe.info.descrizioneIntolleranze" placeholder="Intolleranze" />

      <input type="number" v-model.number="newRecipe.kcal" placeholder="Kcal totali" required />

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
          <td class="actions">
            <button class="icon" data-label="Visualizza" @click="openRecipeModal(recipe)">👁️</button>
            <ModificaRicetta :recipe="recipe" @updated="loadRecipes" />
            <!--in questo caso inviamo tutta la ricetta perchè deve essere compilato un form e dovrei altrimenti fare una get nel figlio con id -->
            <EliminazioneRicetta :recipeId="recipe._id" @deleted="loadRecipes" />
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && recipes.length === 0">
      Nessuna ricetta trovata
    </p>

    <div v-if="showRecipeModal" class="modal-overlay" @click.self="closeRecipeModal">
      <div class="modal">
        <h2>{{ recipeDetail?.nome }}</h2>

        <div v-if="loading">
          <p>Caricamento ricetta...</p>
        </div>

        <div v-else-if="recipeDetail">
          <p><strong>Categoria:</strong> {{ recipeDetail.categoria }}</p>
          <p><strong>Kcal totali:</strong> {{ recipeDetail.kcal }}</p>

          <h3>Ingredienti</h3>

          <ul class="ingredient-list">
            <li v-for="(ing, index) in recipeDetail.ingredienti" :key="index">
              <span>{{ ing.nome }}: </span>
              <span>{{ ing.peso }}g </span>
              <span>({{ ing.kcal }} kcal)</span>
            </li>
          </ul>

          <h3>Note</h3>

          <p v-if="recipeDetail.info?.[0]?.descrizioneKcal">
            {{ recipeDetail.info[0].descrizioneKcal }}
          </p>

          <p v-if="recipeDetail.info?.[1]?.descrizioneTipoDieta">
            {{ recipeDetail.info[1].descrizioneTipoDieta }}
          </p>

          <p v-if="recipeDetail.info?.[2]?.descrizioneIntolleranze">
            {{ recipeDetail.info[2].descrizioneIntolleranze }}
          </p>
        </div>

        <div v-else>
          <p>Nessuna informazione disponibile</p>
        </div>

        <button @click="closeRecipeModal">Chiudi</button>
      </div>
    </div>


  </div>
</template>


<style scoped lang="scss">
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .admin-page {
    padding: 32px;

    h1 {
      color: #2e7d32;
    }
  }

  .admin-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      color: #2e7d32;
      margin-bottom: 8px;
    }
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  .admin-logo {
    height: 120px;
    cursor: pointer;
  }

  .admin-titles {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #2e7d32;
      margin: 0;
    }
  }

  .error {
    color: #d32f2f;
    font-size: 14px;
    margin-bottom: 12px;
  }

  button[type="submit"] {
    background-color: #4caf50;
    color: #fff;

    &:hover {
      background-color: #66bb6a;
    }
  }

  .add-button{
    background-color: #ffffff;
    margin-bottom: 24px;
    outline: none;
    &:hover {
    border-color: #4caf50;
  }
  }

  button[type="button"] {
    background-color: #e0e0e0;

    &:hover {
      background-color: #d5d5d5;
    }
  }

  .recipe-form {
    background: #ffffff;
    padding: 20px;
    margin: 16px auto 32px; // ⬅️ CENTRATO + spazio sopra
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


  .ingredient-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }


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
  }


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
    width: 400px; // come utenti
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

    h2 {
      margin-bottom: 16px;
      color: #2e7d32;
      text-align: center; // ⬅️ centrato
    }

    h3 {
      margin-top: 16px;
      margin-bottom: 8px;
      color: #2e7d32; // stesso verde
      text-align: center;
    }

    p {
      font-size: 14px;
      margin-bottom: 6px;
      color: #333;
    }

    button {
      margin-top: 16px;
      padding: 8px 14px;
      background-color: #4caf50; // ⬅️ VERDE come utenti
      color: #ffffff;
      border: none;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: #66bb6a;
      }
    }
  }

  .modal ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ingredient-list p {
    font-size: 14px;
    padding-left: 8px;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.2s;

    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.15);
    }

    &::after {
      content: attr(data-label);
      position: absolute;
      bottom: 130%;
      left: 50%;
      transform: translateX(-50%);
      background: #2e7d32;
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    &:hover::after {
      opacity: 1;
    }
  }

</style>
