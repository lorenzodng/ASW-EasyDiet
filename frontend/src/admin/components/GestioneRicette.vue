<script setup>
    import axios from "axios";
    import { ref, onMounted } from "vue";

    const recipes = ref([]);
    const loading = ref(true);
    const error = ref("");

    const showRecipeModal = ref(false);

    const recipeDetail = ref(null);
  


    const openRecipeModal = (recipe) => {
  recipeDetail.value = recipe; // ✅ già completa
  showRecipeModal.value = true;
};


    const closeRecipeModal = () => {
        showRecipeModal.value = false;
        selectedRecipe.value = null;
        recipeDetail.value = null;
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

                <div v-if="loadingDetail">
                    <p>Caricamento ricetta...</p>
                </div>

                <div v-else-if="recipeDetail">
                    <p><strong>Categoria:</strong> {{ recipeDetail.categoria }}</p>
                    <p><strong>Kcal totali:</strong> {{ recipeDetail.kcal }}</p>

                    <h3>Ingredienti</h3>
                    <ul>
                        <p v-for="(ing, index) in recipeDetail.ingredienti" :key="index">
                           - {{ ing.nome }} : {{ ing.peso }}g  ({{ ing.kcal }} kcal)
                        </p>
                    </ul>

                   <h3>Info</h3>

<p v-if="recipeDetail.info?.[1]">
  {{ recipeDetail.info[1].descrizioneTipoDieta }}
</p>
<p v-if="recipeDetail.info?.[2]">
  {{ recipeDetail.info[2].descrizioneIntolleranze }}
</p>

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
    }

    .error {
        color: #d32f2f;
        font-size: 14px;
        margin-bottom: 12px;
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
            border: none;
            background: none;
            cursor: pointer;
            font-size: 18px;
            transition: transform 0.2s;

            &:hover {
                transform: scale(1.2);
            }
        }
    }

    /* MODALE */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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

        ul {
            padding-left: 18px;

            li {
                font-size: 14px;
                margin-bottom: 4px;
            }
        }

        button {
            margin-top: 16px;
            padding: 8px 14px;
            background-color: #4caf50;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;

            &:hover {
                background-color: #66bb6a;
            }
        }
    }
</style>
