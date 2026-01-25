<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import logo from "../assets/images/logo-easydiet.png";

  import ModificaUtente from "./ModificaUtente.vue";
  import EliminazioneUtente from "./EliminazioneUtente.vue";
  import VisualizzaUtente from "./VisualizzaUtente.vue";

  const users = ref([]);
  const loading = ref(true);
  const error = ref("");

  const showForm = ref(false);
  const newUser = ref({ nome: "", email: "", password: "" });

  const toggleForm = () => {
    showForm.value = !showForm.value;
  };

  const onUserDeleted = (id) => {
    users.value = users.value.filter(u => u._id !== id);
  };

  // 🔹 CREA UTENTE + RICARICA LISTA
  const submitUser = async () => {
    error.value = "";

    try {
      const { data } = await axios.post("http://localhost:5000/admin/users", newUser.value);

      if (data.status) {
        const res = await axios.get("http://localhost:5000/admin/users");
        users.value = res.data.users;

        showForm.value = false;
        newUser.value = { nome: "", email: "", password: "" };
      } else {
        error.value = data.message || "Errore creazione utente";
      }
    } catch {
      error.value = "Errore di connessione";
    }
  };

  // CARICAMENTO INIZIALE
  onMounted(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/admin/users");
      if (data.status) users.value = data.users;
      else error.value = "Errore nel recupero utenti";
    } catch {
      error.value = "Errore di connessione";
    } finally {
      loading.value = false;
    }
  });
</script>

<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="admin-topbar">
        <img :src="logo" alt="EasyDiet logo" class="admin-logo" />
        <div class="admin-titles">
          <h1>Gestione Utenti</h1>
        </div>
      </div>
    </header>

    <button class="add" @click="toggleForm">➕ Aggiungi utente</button>

    <!-- FORM CREAZIONE -->
    <form v-if="showForm" class="user-form" @submit.prevent="submitUser">
      <input type="text" placeholder="Nome" v-model="newUser.nome" required />
      <input type="email" placeholder="Email" v-model="newUser.email" required />
      <input type="password" placeholder="Password" v-model="newUser.password" required />
      <button type="submit">Crea utente</button>
    </form>

    <p v-if="loading" class="info">Caricamento utenti...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- TABELLA UTENTI -->
    <table v-if="!loading && !error" class="users-table">
      <thead>
        <tr>
          <th>Nome Utente</th>
          <th>Email</th>
          <th></th> <!-- rimane vuoto, nessun testo "Actions" -->
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.nome }}</td>
          <td class="email-cell">
            <ModificaUtente :user="user" @updated="users = users" />
          </td>
          <td class="actions">
            <VisualizzaUtente :user="user" />
            <EliminazioneUtente :user="user" @deleted="onUserDeleted" />
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="3" class="empty">Nessun utente trovato</td>
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
    }
  }

  .admin-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      color: #2e7d32;
      margin-bottom: 8px;
    }
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  .admin-logo {
    height: 120px;
    cursor: pointer;
  }

  .admin-titles {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #2e7d32;
      margin: 0;
    }
  }

  .add {
    padding: 10px 16px;
    background-color: #ffffff;
    color: #0a0000;
    border: 2px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s ease;
    margin-bottom: 24px;
    outline: none;

    &:hover {
      border-color: #4caf50;
    }
  }

  .user-form {
    margin: 32px auto 40px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 400px;

    input {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #4caf50;
      }
    }

    button {
      padding: 10px 16px;
      background-color: #2e7d32;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background-color: #388e3c;
      }
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

    tbody tr {
      border-bottom: 1px solid #e0e0e0;

      &:hover {
        background-color: #f1f8f4;
      }
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    .icon {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 18px;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.2);
      }

      &::after {
        content: attr(data-label);
        position: absolute;
        bottom: 130%;
        left: 50%;
        transform: translateX(-50%);
        background: #2e7d32;
        color: #fff;
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

    .empty {
      text-align: center;
      padding: 20px;
      color: #777;
      font-style: italic;
    }
  }


</style>
