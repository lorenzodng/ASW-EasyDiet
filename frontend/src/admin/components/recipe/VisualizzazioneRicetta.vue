<script setup>
    const props = defineProps({
        show: Boolean,
        recipe: Object
    });

    const emit = defineEmits(["close"]);

    const closeRecipeModal = () => {
        emit("close");
    };
</script>

<template>
    <div v-if="show" class="modal-overlay" @click.self="closeRecipeModal">
        <div class="modal">
            <h2>{{ recipe?.nome }}</h2>

            <div v-if="!recipe">
                <p>Nessuna informazione disponibile</p>
            </div>

            <div v-else>
                <p><strong>Categoria:</strong> {{ recipe.categoria }}</p>
                <p><strong>Kcal totali:</strong> {{ recipe.kcal }}</p>

                <h3 class="ingredienti-title">Ingredienti</h3>

                <ul class="ingredient-list">
                    <li v-for="(ing, index) in recipe.ingredienti" :key="index">
                        <span>{{ ing.nome.charAt(0).toUpperCase() + ing.nome.slice(1) }}: </span>
                        <span>{{ ing.peso }}g </span>
                        <span>({{ ing.kcal }} kcal)</span>
                    </li>
                </ul>

                <h3>Note</h3>

                <div class="notes">
                    <p v-if="recipe.info?.length">
                        {{recipe.info.find(i => i.descrizioneKcal)?.descrizioneKcal}}
                    </p>
                    <p v-if="recipe.info?.length">
                        {{recipe.info.find(i => i.descrizioneTipoDieta)?.descrizioneTipoDieta}}
                    </p>
                    <p v-if="recipe.info?.length">
                        {{recipe.info.find(i => i.descrizioneIntolleranze)?.descrizioneIntolleranze}}
                    </p>
                </div>

            </div>

            <button @click="closeRecipeModal">Chiudi</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    $green-dark: #2e7d32;
    $green-button: #4caf50;
    $green-button-hover: #66bb6a;
    $white: #ffffff;
    $black-light: #333;
    $box-shadow-modal: 0 10px 30px rgba(0, 0, 0, 0.25);
    $overlay-bg: rgba(0, 0, 0, 0.5);
    $border-radius-small: 6px;
    $border-radius-medium: 12px;

    .modal-overlay {
        position: fixed;
        inset: 0;
        background: $overlay-bg;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background: $white;
        padding: 5px 24px 35px 24px;
        border-radius: $border-radius-medium;
        width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: $box-shadow-modal;


        h2 {
            margin-bottom: 16px;
            color: $green-dark;
            text-align: center;
            font-size: 30px;
        }

        h3 {
            margin-top: 20px;
            margin-bottom: 10px;
            color: $green-dark;
            text-align: center;

            .ingredienti-title {
                margin-bottom: 17px;
            }
        }

        p {
            font-size: 15px;
            margin-bottom: 6px;
            color: $black-light;
        }

        button {
            margin-top: 16px;
            padding: 8px 14px;
            background-color: $green-button;
            color: $white;
            border: none;
            border-radius: $border-radius-small;
            cursor: pointer;

            &:hover {
                background-color: $green-button-hover;
            }
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
    }

    .ingredient-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        p {
            font-size: 14px;
            padding-left: 8px;
        }
    }

    .notes {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: -11px;

        margin-bottom: 10px;

        p {
            margin: 0;
        }
    }

</style>