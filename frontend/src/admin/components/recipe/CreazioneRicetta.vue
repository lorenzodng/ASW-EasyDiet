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
            {
                nome: "",
                peso: null,
                kcal: null
            }
        ],
        kcal: null,
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

        <input :value="newRecipe.nome" @input="newRecipe.nome = $event.target.value" placeholder="Nome piatto"
            required />
        <input v-model="newRecipe.immagine" placeholder="Nome file immagine (es. pasta.png)" required />

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

        <h3>Note</h3>

        <textarea v-model="newRecipe.info[1].descrizioneTipoDieta" placeholder="Tipo dieta" />
        <textarea v-model="newRecipe.info[2].descrizioneIntolleranze" placeholder="Intolleranze" />

        <input type="number" v-model.number="newRecipe.kcal" placeholder="Kcal totali" required />

        <div class="form-buttons">
            <button class="submit">Salva</button>
            <button class="cancel" @click="showForm = false">Annulla</button>
        </div>

    </form>
</template>

<style scoped lang="scss">
    $green-dark: #2e7d32;
    $green-light: #388e3c;
    $green-button: #4caf50;
    $green-button-hover: #66bb6a;
    $white: #ffffff;
    $gray-light: #ccc;
    $gray-medium: #e0e0e0;
    $gray-medium-hover: #d5d5d5;
    $box-shadow-form: 0 6px 16px rgba(0, 0, 0, 0.08);

    .recipe-form {
        background: $white;
        padding: 20px;
        margin: 16px auto 32px;
        border-radius: 12px;
        box-shadow: 0 6px 16px $box-shadow-form;
        max-width: 600px;

        input,
        select,
        textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 12px;
            border-radius: 6px;
            border: 1px solid $gray-light;
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

    .add-button {
        background-color: $white;
        margin-bottom: 24px;
        outline: none;

        &:hover {
            border-color: $green-button;
        }
    }

    .form-buttons {
        display: flex;
        justify-content: center;
        gap: 25px;
        margin-top: 20px;

        .submit {
            background-color: $green-button;
            color: $white;

            &:hover {
                background-color: $green-button-hover;
            }
        }

        .cancel {
            background-color: $gray-medium;

            &:hover {
                background-color: $gray-medium-hover;
            }
        }
    }
</style>
