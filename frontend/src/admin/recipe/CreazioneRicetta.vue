<script setup>
    import { ref } from "vue";
    import axios from "axios";

    const showForm = ref(false);
    const emit = defineEmits(["saved"]);

    const newRecipe = ref({
        nome: "",
        categoria: "",
        immagine: "", // percorso relativo o URL
        ingredienti: [
            { nome: "", peso: 0, kcal: 0 }
        ],
        kcal: 0,
        info: [
            { descrizioneKcal: "" },
            { descrizioneTipoDieta: "" },
            { descrizioneIntolleranze: "" }
        ]
    });
//Adds a new empty ingredient row to the recipe form
    const addIngredient = () => {
        newRecipe.value.ingredienti.push({
            nome: "",
            peso: 0,
            kcal: 0
        });
    };
    /*Sends the new recipe to the backend and resets the form on success.
    Emits a "saved" event so the parent component can refresh the recipe list. */
    const saveRecipe = async () => {
        try {
            const { data } = await axios.post("http://localhost:5000/admin/recipes", newRecipe.value);
            emit("saved", data);
            newRecipe.value = {
                nome: "",
                categoria: "",
                immagine: "",
                ingredienti: [{ nome: "", peso: 0, kcal: 0 }],
                kcal: 0,
                info: [
                    { descrizioneKcal: "" },
                    { descrizioneTipoDieta: "" },
                    { descrizioneIntolleranze: "" }
                ]
            };
            showForm.value = false;
        } catch (err) {
            console.error(err);
            alert("Errore nel salvataggio della ricetta");
        }
    };
</script>

<template>
    <button class="add-button" @click="showForm = !showForm">
        ➕ Aggiungi piatto
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

        <textarea v-model="newRecipe.info[0].descrizioneKcal" placeholder="Descrizione kcal" />
        <textarea v-model="newRecipe.info[1].descrizioneTipoDieta" placeholder="Tipo dieta" />
        <textarea v-model="newRecipe.info[2].descrizioneIntolleranze" placeholder="Intolleranze" />

        <input type="number" v-model.number="newRecipe.kcal" placeholder="Kcal totali" required />

        <button type="submit">💾 Salva piatto</button>
        <button type="button" @click="showForm = false">
            ❌ Annulla
        </button>

    </form>
</template>

<style scoped lang="scss">
    $green-dark: #2e7d32;
    $green-light: #388e3c;
    $green-button: #4caf50;
    $green-button-hover: #66bb6a;

    .recipe-form {
        background: #ffffff;
        padding: 20px;
        margin: 16px auto 32px;
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
                border-color: $green-button;
            }
        }

        h3 {
            margin-top: 16px;
            margin-bottom: 8px;
            color: $green-light;
        }
    }

    .ingredient-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 8px;
        margin-bottom: 8px;
    }

    button[type="submit"] {
        background-color: $green-button;
        color: #fff;

        &:hover {
            background-color: $green-button-hover;
        }
    }

    .add-button {
        background-color: #ffffff;
        margin-bottom: 24px;
        outline: none;

        &:hover {
            border-color: $green-button;
        }
    }

    button[type="button"] {
        background-color: #e0e0e0;

        &:hover {
            background-color: #d5d5d5;
        }
    }
</style>
