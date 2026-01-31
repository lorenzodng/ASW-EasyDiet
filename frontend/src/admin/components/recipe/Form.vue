<script setup>
    import { ref, watch } from "vue";

    const props = defineProps({
        modelValue: {
            type: Object,
            required: true
        },
        isModal: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(["save", "cancel"]);

    const form = ref({});

    //Updates the forms when modelValue changes (modify plate)
    watch(
        () => props.modelValue,
        (val) => {
            form.value = JSON.parse(JSON.stringify(val));
        },
        { immediate: true }
    );

    //Adds a new empty ingredient row to the recipe form
    const addIngredient = () => {
        form.value.ingredienti.push({
            nome: "",
            peso: null,
            kcal: null
        });
    };

    const removeIngredient = (index) => {
        form.value.ingredienti.splice(index, 1);
    };

    const submit = () => {
        emit("save", form.value);
    };
</script>


<template>
    <form :class="['recipe-form', { modal: isModal }]">
        <h3>Dati</h3>
        <input v-model="form.nome" placeholder="Nome piatto" required />
        <input v-model="form.immagine" placeholder="Nome file immagine (es. pasta.png)" required />

        <select v-model="form.categoria" required>
            <option disabled value="">Seleziona pasto</option>
            <option value="colazione">Colazione</option>
            <option value="pranzo">Pranzo</option>
            <option value="merenda">Merenda</option>
            <option value="cena">Cena</option>
        </select>
        <input type="number" v-model.number="form.kcal" placeholder="Kcal totali" required />

        <h3>Ingredienti</h3>
        <div v-for="(ing, index) in form.ingredienti" :key="index" class="ingredient-row">
            <input v-model="ing.nome" placeholder="Ingrediente" required />
            <input type="number" v-model.number="ing.peso" placeholder="g" required />
            <input type="number" v-model.number="ing.kcal" placeholder="kcal" required />
            <button type="button" class="remove-ingredient" @click="removeIngredient(index)">❌</button>
        </div>
        <button type="button" class="add-ingredient" @click="addIngredient">➕</button>

        <h3>Note</h3>
        <input v-model="form.info[1].descrizioneTipoDieta" placeholder="Tipo dieta" required />
        <textarea v-model="form.info[2].descrizioneIntolleranze" placeholder="Intolleranze" />

        <div class="form-buttons">
            <button class="submit" type="submit" @click="submit">Salva</button>
            <button type="button" class="cancel" @click="$emit('cancel')">Annulla</button>
        </div>
    </form>
</template>

<style scoped lang="scss">
    $gray-medium-hover: #d5d5d5;
    $box-shadow-form: 0 6px 16px $gray-shadow;
    $green-light-bg-hover: #c8e6c9;
    $red-light-bg-hover: #ffd2d0;

    .recipe-form {
        background: $white;
        padding: 5px 67px 36px 18px;
        margin: 16px auto 32px;
        border-radius: 12px;
        box-shadow: 0 6px 16px $box-shadow-form;
        max-width: 500px;

        input,
        select,
        textarea {
            display: block;
            width: 90%;
            min-width: 450px;
            max-width: 450px;
            padding: 10px;
            margin: 0 auto 12px;
            border-radius: 6px;
            border: 1px solid $gray-border;
            font-size: 14px;
            box-sizing: border-box;

            &:focus {
                outline: none;
                border-color: $green-hover;
            }
        }

        h3 {
            margin-top: 25px;
            margin-bottom: 15px;
            color: $green-border;
            font-size: 20px;
        }

        &.modal {
            padding-bottom: 15px;
            padding-top: 15px;


            h3 {
                text-align: center;

                &:first-of-type {
                    margin-top: 0px;
                }
            }

            .add-ingredient {
                display: block;
                margin: 12px auto;
            }
        }
    }

    .ingredient-row {
        width: 524px;
        padding-left: 12px;
        display: grid;
        grid-template-columns: 2fr 0.7fr 0.7fr auto;
        margin-bottom: 8px;

        input {
            min-width: 0;
        }
    }

    .remove-ingredient {
        background-color: $red-light;
        color: $red-error;
        font-size: 14px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease, transform 0.2s ease;
        margin-left: 15px;
        height: 38px;
        width: 45px;

        &:hover {
            background: $red-light-bg-hover;
        }
    }

    .add-ingredient {
        background-color: $green-light;
        color: $green-main;
        font-size: 14px;
        border-radius: 999px;
        padding: 8px 12px;

        &:hover {
            background-color: $green-light-bg-hover;
        }
    }

    .form-buttons {
        display: flex;
        justify-content: center;
        gap: 25px;
        margin-top: 40px;

        button {
            width: 100px;
        }

        .submit {
            background-color: $green-hover;
            color: $white;

            &:hover {
                background-color: $green-soft;
            }
        }

        .cancel {
            background-color: $gray-soft;

            &:hover {
                background-color: $gray-medium-hover;
            }
        }
    }
</style>
