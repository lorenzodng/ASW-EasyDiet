<script setup>
    import { ref } from "vue";
    import axios from "axios";
    import Form from "./Form.vue";

    const showForm = ref(false);
    const emit = defineEmits(["saved"]);

    const dish = ref({
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

    /*Sends the new dish to the backend and resets the form on success.
    Emits a "saved" event so the parent component can refresh the dishes list. */
    const saveDish = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/admin/dishes", data);

            emit("saved", response.data);

            dish.value = {
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

    <Form v-if="showForm" :model-value="dish" @save="saveDish" @cancel="showForm = false" />
</template>

<style scoped lang="scss">

    .add-button {
        background-color: $white;
        margin-bottom: 24px;
        outline: none;

        &:hover {
            border-color: $green-hover;
        }
    }
</style>
