<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import logo from "../../assets/images/logo-easydiet.png";
  import EliminazioneRicetta from "../components/recipe/EliminazioneRicetta.vue";
  import ModificaRicetta from "../components/recipe/ModificaRicetta.vue";
  import CreazioneRicetta from "../components/recipe/CreazioneRicetta.vue";
  import VisualizzazioneRicetta from "../components/recipe/VisualizzazioneRicetta.vue";

  const recipes = ref([]);
  const loading = ref(true);
  const error = ref("");
  const showRecipeModal = ref(false);
  const recipeDetail = ref(null);

  const openRecipeModal = (recipe) => {
    recipeDetail.value = recipe;
    showRecipeModal.value = true;
  };

  const closeRecipeModal = () => {
    showRecipeModal.value = false;
    recipeDetail.value = null;
  };
  /**
    * This method is reused after create, update and delete operations
    * to keep the list in sync.
   */
  const loadRecipes = async () => {
    try {
      loading.value = true;
      const { data } = await axios.get("http://localhost:5000/recipes");
      if (data.status)
        recipes.value = data.recipes;
      else
        error.value = "Errore nel recupero dei piatti";
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
        <router-link to="/admin/home" class="logo">
          <img :src="logo" alt="EasyDiet logo" class="admin-logo" />
        </router-link>
        <div class="admin-titles">
          <h1>Gestione Piatti</h1>
        </div>
      </div>
    </header>

    <p v-if="loading">Caricamento piatti...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <CreazioneRicetta @saved="loadRecipes" />

    <table v-if="!loading && recipes.length" class="recipes-table">
      <thead>
        <tr>
          <th>Pasto</th>
          <th>Nome</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="recipe in recipes" :key="recipe._id">
          <td>{{ recipe.categoria }}</td>
          <td>{{ recipe.nome }}</td>
          <td class="actions">
            <button class="icon" data-label="Visualizza" @click="openRecipeModal(recipe)">👁️</button>
            <ModificaRicetta :recipe="recipe" @updated="loadRecipes" />
            <EliminazioneRicetta :recipeId="recipe._id" @deleted="loadRecipes" />
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && recipes.length === 0">
      Nessuna ricetta trovata
    </p>
    <VisualizzazioneRicetta :show="showRecipeModal" :recipe="recipeDetail" @close="closeRecipeModal" />
  </div>
</template>

<style scoped lang="scss">
  $topbar-box-shadow: 0 6px 16px $gray-shadow;
  $table-box-shadow: 0 8px 20px $green-dark-box-shadow;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .admin-page {
    padding: 32px;
  }

  .admin-header {
    margin-bottom: 40px;
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: $white;
    border-radius: 18px;
    box-shadow: $topbar-box-shadow;
  }

  .admin-logo {
    height: 120px;
    cursor: pointer;
  }

  .admin-titles {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -27%);
    text-align: center;

    h1 {
      font-size: 33px;
      color: $green-main;
      margin: 0 0 24px 0;
    }
  }

  .error {
    color: $red-error;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .recipes-table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    background-color: $white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $table-box-shadow;

    thead {
      background-color: $green-hover;
      color: $white;
    }

    th,
    td {
      padding: 14px 16px;
      text-align: left;

      &:first-child {
        text-transform: capitalize;
      }

      &:nth-child(2) {
        text-align: center;
      }
    }

    tbody tr {
      border-bottom: 1px solid $gray-soft;

      &:hover {
        background-color: $bg-table-hover;
      }
    }
  }

  .icon {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.15);
    }

    &::after {
      content: attr(data-label);
      position: absolute;
      bottom: 130%;
      left: 50%;
      transform: translateX(-50%);
      background: $green-main;
      color: $white;
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

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
</style>