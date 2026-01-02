<script setup>
    import axios from "axios";
    import { ref, onMounted } from "vue";

    const users = ref([]);
    const loading = ref(true);
    const error = ref("");

    onMounted(async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:5000/admin/users"
            );

            if (data.status) {
                users.value = data.users;
            } else {
                error.value = "Errore nel recupero utenti";
            }
        } catch (err) {
            console.error(err);
            error.value = "Errore di connessione";
        } finally {
            loading.value = false;
        }
    });

</script>


<template>
    <div class="admin-page">
        <h1>Gestione Utenti</h1>

        <p v-if="loading" class="info">Caricamento utenti...</p>
        <p v-if="error" class="error">{{ error }}</p>

        <table v-if="!loading && !error" class="users-table">
            <thead>
                <tr>
                    <th>Nome Utente</th>
                    <th>Email</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="user in users" :key="user._id">
                    <td>{{ user.nome }}</td>
                    <td>{{ user.email }}</td>
                </tr>

                <tr v-if="users.length === 0">
                    <td colspan="2" class="empty">
                        Nessun utente trovato
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="scss">
    .admin-page {
        padding: 32px;

        h1 {
            color: #2e7d32;
            margin-bottom: 20px;
        }
    }

    .info {
        color: #555;
        font-size: 14px;
    }

    .error {
        color: #d32f2f;
        font-size: 14px;
        margin-bottom: 12px;
    }

    .users-table {
        width: 100%;
        border-collapse: collapse;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(76, 175, 80, 0.12);

        thead {
            background-color: #4caf50;
            color: #ffffff;
        }

        th,
        td {
            padding: 14px 16px;
            text-align: left;
        }

        th {
            font-size: 14px;
            font-weight: 600;
        }

        tbody tr {
            border-bottom: 1px solid #e0e0e0;

            &:hover {
                background-color: #f1f8f4;
            }
        }

        tbody tr:last-child {
            border-bottom: none;
        }

        td {
            font-size: 14px;
            color: #333;
        }

        .empty {
            text-align: center;
            padding: 20px;
            color: #777;
            font-style: italic;
        }
    }
</style>
