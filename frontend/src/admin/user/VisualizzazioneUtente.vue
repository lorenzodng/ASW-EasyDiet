<script setup>
    import { ref } from "vue";
    import axios from "axios";

    const props = defineProps({ user: { type: Object, required: true } });
    const emit = defineEmits([]);

    const showUserModal = ref(false);
    const userInfo = ref(null);
    const loadingInfo = ref(false);

    const openUserModal = async () => {
        showUserModal.value = true;
        loadingInfo.value = true;
        userInfo.value = null;

        try {
            const { data } = await axios.get(`http://localhost:5000/admin/users/${props.user._id}/info`);
            if (data.status) userInfo.value = data.info;
            else userInfo.value = null;
        } catch {
            alert("Errore nel caricamento informazioni utente");
        } finally {
            loadingInfo.value = false;
        }
    };

    const closeUserModal = () => {
        showUserModal.value = false;
        userInfo.value = null;
    };
</script>

<template>
    <button class="icon" data-label="Visualizza" @click="openUserModal">👁️</button>

    <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
        <div class="modal">
            <h2>Informazioni personali</h2>

            <div v-if="loadingInfo">
                <p>Caricamento informazioni...</p>
            </div>

            <div v-else-if="userInfo">
                <p><strong>Età:</strong> {{ userInfo.eta }}</p>
                <p><strong>Sesso:</strong> {{ userInfo.sesso }}</p>
                <p><strong>Altezza:</strong> {{ userInfo.altezza }} cm</p>
                <p><strong>Obiettivo:</strong> {{ userInfo.obiettivo }}</p>
                <p><strong>Livello attività:</strong> {{ userInfo.livelloAttivitaFisica }}</p>
                <p><strong>Obiettivo peso:</strong> {{ userInfo.obiettivoPeso }} kg</p>
                <p><strong>Kcal giornaliere:</strong> {{ userInfo.kcal }}</p>

                <h3>Storico pesi</h3>
                <ul v-if="userInfo.pesi?.length" class="weight-list">
                    <li v-for="(p, index) in userInfo.pesi.sort((a, b) => new Date(b.data) - new Date(a.data))"
                        :key="index">
                        <span class="weight">{{ p.peso }} kg</span>
                        <span class="date">{{ new Date(p.data).toLocaleDateString() }}</span>
                    </li>
                </ul>
                <p v-else>Nessun peso registrato</p>
            </div>

            <div v-else>
                <p>Nessuna informazione personale disponibile</p>
            </div>

            <button @click="closeUserModal">Chiudi</button>
        </div>
    </div>
</template>
<style scoped lang="scss">
    $green-dark: #2e7d32;
    $green-main: #4caf50;
    $green-light: #66bb6a;
    $green-strong: #38973d;
    $white: #ffffff;
    $black-overlay: rgba(0, 0, 0, 0.5);
    $black-shadow: rgba(0, 0, 0, 0.25);
    $gray-text: #333333;
    $gray-light: #f2f8f3;
    $gray-info: #555;

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: $black-overlay;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background: $white;
        padding: 24px;
        border-radius: 12px;
        width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px $black-shadow;

        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: $green-dark;
        }

        h3 {
            margin-top: 40px;
            margin-bottom: 20px;
            color: $green-dark;
            text-align: center;
        }

        button {
            display: block;
            margin: 16px auto 0;
            padding: 8px 14px;
            background-color: $green-main;
            color: $white;
            border: none;
            border-radius: 6px;
            cursor: pointer;

            &:hover {
                background-color: $green-light;
            }
        }
    }

    .user-info {
        text-align: left;
        margin-top: 12px;

        p {
            margin: 6px 0;
            font-size: 16px;
            color: $gray-text;
        }

        strong {
            color: $green-strong;
        }
    }

    .weight-list {
        list-style: none;
        padding: 0;
        margin: 12px 0 0;
    }

    .weight-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 14px;
        margin-bottom: 8px;
        background: $gray-light;
        border-radius: 8px;
        font-size: 14px;
    }

    .weight {
        font-weight: 600;
        color: $gray-info;
    }

    .date {
        font-size: 13px;
        color: $gray-info;
    }

    .icon {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 18px;
        transition: transform 0.2s ease;

        &:hover {
            transform: scale(1.2);
        }

        &::after {
            content: attr(data-label);
            position: absolute;
            bottom: 130%;
            left: 50%;
            transform: translateX(-50%);
            background: $green-dark;
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
</style>
