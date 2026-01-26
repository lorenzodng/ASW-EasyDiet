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

                <h3>Ingredienti</h3>

                <ul class="ingredient-list">
                    <li v-for="(ing, index) in recipe.ingredienti" :key="index">
                        <span>{{ ing.nome }}: </span>
                        <span>{{ ing.peso }}g </span>
                        <span>({{ ing.kcal }} kcal)</span>
                    </li>
                </ul>

                <h3>Note</h3>

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

            <button @click="closeRecipeModal">Chiudi</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    $green-dark: #2e7d32;
    $green-button: #4caf50;
    $green-button-hover: #66bb6a;

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
        width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

        h2 {
            margin-bottom: 16px;
            color: $green-dark;
            text-align: center;
        }

        h3 {
            margin-top: 16px;
            margin-bottom: 8px;
            color: $green-dark;
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
            background-color: $green-button;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            cursor: pointer;

            &:hover {
                background-color: $green-button-hover;
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
</style>
