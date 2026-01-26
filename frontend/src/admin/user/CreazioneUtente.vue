<script setup>
    import { ref } from "vue";
    import axios from "axios";

    const emit = defineEmits(["created"]);

    const newUser = ref({
        nome: "",
        email: "",
    });

    const error = ref("");
    const loading = ref(false);

    const submitUser = async () => {
        loading.value = true;
        try {
            const { data } = await axios.post("http://localhost:5000/admin/users", newUser.value);
            if (data.status) {
                emit("created");
                newUser.value = { nome: "", email: "" };
            } else {
                error.value = data.message || "Errore creazione utente";
            }
        } catch (err) {
            error.value = "Errore di connessione";
        } finally {
            loading.value = false;
        }
    };
</script>

<template>
    <div class="create-user-form">
        <p v-if="error" class="error">{{ error }}</p>

        <form @submit.prevent="submitUser">
            <input type="text" placeholder="Nome" v-model="newUser.nome" required />
            <input type="email" placeholder="Email" v-model="newUser.email" required />

            <button type="submit" :disabled="loading">💾 Crea</button>
        </form>
    </div>
</template>
