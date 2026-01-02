<script setup>
    import { useRouter } from "vue-router";

    const router = useRouter();

    const goTo = (routeName) => {
        router.push({ name: routeName });
    };
</script>

<template>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Area Amministratore</h1>
            <p>Gestione sistema EasyDiet</p>
        </header>

        <div class="admin-actions">
            <button @click="goTo('GestioneUtenti')">
                👤 Gestione Utenti
            </button>

            <button @click="goTo('GestioneDiete')">
                🥗 Gestione Diete
            </button>

            <button @click="goTo('GestioneRicette')">
                🍽️ Gestione Ricette
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .admin-container {
        min-height: 100vh;
        background: #f2f8f3;
        padding: 30px;
    }

    .admin-header {
        text-align: center;
        margin-bottom: 40px;

        h1 {
            color: #2e7d32;
            margin-bottom: 8px;
        }

        p {
            color: #555;
            font-size: 14px;
        }
    }

    .admin-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        max-width: 700px;
        margin: auto;

        button {
            padding: 20px;
            font-size: 16px;
            font-weight: 600;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background-color: #66bb6a;
                transform: translateY(-3px);
                box-shadow: 0 8px 15px rgba(76, 175, 80, 0.4);
            }
        }
    }
</style>
