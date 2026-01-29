<script setup>
    import { ref } from "vue";
    import axios from "axios";
    import Form from "./Form.vue";

    const showForm = ref(false);
    const emit = defineEmits(["saved"]);

    const recipe = ref({
        nome: "",
        categoria: "",
        immagine: "",
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

    /*Sends the new plate to the backend and resets the form on success.
    Emits a "saved" event so the parent component can refresh the plates list. */
    const saveRecipe = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/admin/recipes", data);

            emit("saved", response.data);

            recipe.value = {
                nome: "",
                categoria: "",
                immagine: "",
                ingredienti: [{ nome: "", peso: null, kcal: null }],
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
            alert("Errore nel salvataggio del piatto");
        }
    };
</script>

<template>
    <button class="add-button" @click="showForm = !showForm">
        ➕ Aggiungi piatto
    </button>

    <Form v-if="showForm" :model-value="recipe" @save="saveRecipe" @cancel="showForm = false" />
</template>

<style scoped lang="scss">
    $white: #ffffff;
    $green-button: #4caf50;

    .add-button {
        background-color: $white;
        margin-bottom: 24px;
        outline: none;

        &:hover {
            border-color: $green-button;
        }
    }
</style>
