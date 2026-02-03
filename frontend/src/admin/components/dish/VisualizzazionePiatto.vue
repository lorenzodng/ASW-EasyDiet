<script setup>

    const props = defineProps({
        show: Boolean,
        dish: Object
    });

    const emit = defineEmits(["close"]);

    const closeDishModal = () => {
        emit("close");
    };
</script>

<template>
    <div v-if="show" class="modal-overlay" @click.self="closeDishModal">
        <div class="modal">
            <h2>{{ dish?.nome }}</h2>

            <div v-if="!dish">
                <p>Nessuna informazione disponibile</p>
            </div>

            <div v-else>
                <p><strong>Categoria:</strong> {{ dish.categoria }}</p>
                <p><strong>Kcal totali:</strong> {{ dish.kcal }}</p>

                <h3 class="ingredienti-title">Ingredienti</h3>

                <ul class="ingredient-list">
                    <li v-for="(ing, index) in dish.ingredienti" :key="index">
                        <span>{{ ing.nome.charAt(0).toUpperCase() + ing.nome.slice(1) }}: </span>
                        <span>{{ ing.peso }}g </span>
                        <span>({{ ing.kcal }} kcal)</span>
                    </li>
                </ul>

                <h3>Note</h3>

                <div class="notes">
                    <p v-if="dish.info?.length">
                        {{dish.info.find(i => i.descrizioneKcal)?.descrizioneKcal}}
                    </p>
                    <p v-if="dish.info?.length">
                        {{dish.info.find(i => i.descrizioneTipoDieta)?.descrizioneTipoDieta}}
                    </p>
                    <p v-if="dish.info?.length">
                        {{dish.info.find(i => i.descrizioneIntolleranze)?.descrizioneIntolleranze}}
                    </p>
                </div>

            </div>

            <button @click="closeDishModal">Chiudi</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    $box-shadow-modal: 0 10px 30px $black-shadow;

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
        border-radius: 12px;
        width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: $box-shadow-modal;


        h2 {
            margin-bottom: 16px;
            color: $green-main;
            text-align: center;
            font-size: 30px;
        }

        h3 {
            margin-top: 20px;
            margin-bottom: 10px;
            color: $green-main;
            text-align: center;

            .ingredienti-title {
                margin-bottom: 17px;
            }
        }

        p {
            font-size: 15px;
            margin-bottom: 6px;
            color: $black;
        }

        button {
            margin-top: 16px;
            padding: 8px 14px;
            background-color: $green-hover;
            color: $white;
            border: none;
            border-radius: 6px;
            cursor: pointer;

            &:hover {
                background-color: $green-soft;
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