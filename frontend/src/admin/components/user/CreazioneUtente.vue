<script setup>
    import { ref } from "vue";
    import axios from "axios";

    const emit = defineEmits(["created"]);

    const showForm = ref(false);
    const newUser = ref({ nome: "", email: "", password: "" });
    const error = ref("");

    const toggleForm = () => {
        showForm.value = !showForm.value;
    };

    // Save the new user created
    const saveUser = async () => {
        error.value = "";
        try {
            const { data } = await axios.post("http://localhost:5000/admin/users", newUser.value);
            if (data.status) {
                emit("created");
                showForm.value = false;
                newUser.value = { nome: "", email: "", password: "" };
            } else {
                error.value = data.message || "Errore creazione utente";
            }
        } catch {
            error.value = "Errore di connessione";
        }
    };
</script>

<template>
    <button class="add" @click="toggleForm">➕ Aggiungi utente</button>

    <form v-if="showForm" class="user-form" @submit.prevent="saveUser">
        <input type="text" placeholder="Nome" v-model="newUser.nome" required />
        <input type="email" placeholder="Email" v-model="newUser.email" required />
        <input type="password" placeholder="Password" v-model="newUser.password" required />
        <button type="submit">Crea utente</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
</template>

<style scoped lang="scss">

    .add {
        padding: 10px 16px;
        background-color: $white;
        color: $black;
        border: 2px solid transparent;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: border-color 0.3s ease;
        margin-bottom: 24px;
        outline: none;

        &:hover {
            border-color: $green-hover;
        }
    }

    .user-form {
        margin: 10px auto 40px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        max-width: 400px;

        input {
            padding: 12px;
            border: 1px solid $gray-border;
            border-radius: 8px;
            font-size: 14px;

            &:focus {
                outline: none;
                border-color: $green-hover;
            }
        }

        button {
            padding: 10px 16px;
            background-color: $green-main;
            color: $white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;

            &:hover {
                background-color: $green-border;
            }
        }
    }

    .error {
        color: $red-error;
        font-size: 14px;
        margin-bottom: 12px;
    }
</style>
