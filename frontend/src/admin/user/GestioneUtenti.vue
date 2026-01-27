<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import logo from "../../assets/images/logo-easydiet.png";
  import ModificaUtente from "./ModificaUtente.vue";
  import EliminazioneUtente from "./EliminazioneUtente.vue";
  import VisualizzazioneUtente from "./VisualizzazioneUtente.vue";
  import CreazioneUtente from "./CreazioneUtente.vue";

  const users = ref([]);
  const loading = ref(true);
  const error = ref("");

  const onUserDeleted = (id) => {
    users.value = users.value.filter(u => u._id !== id);
  };

  const loadUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/admin/users");
      if (data.status)
        users.value = data.users;
      else
        error.value = "Errore nel recupero degli utenti";
    } catch {
      error.value = "Errore di connessione";
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadUsers);
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

    <CreazioneUtente @created="loadUsers" />

    <p v-if="loading" class="info">Caricamento utenti...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- TABELLA UTENTI -->
    <table v-if="!loading && !error" class="users-table">
      <thead>
        <tr>
          <th>Nome Utente</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.nome }}</td>
          <td class="email-cell">
            <ModificaUtente :user="user" @updated="users = users" />
          </td>
          <td class="actions">
            <VisualizzazioneUtente :user="user" />
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
  $green-dark: #2e7d32;
  $green-main: #4caf50;
  $green-hover: #f1f8f4;
  $green-shadow: rgba(76, 175, 80, 0.12);
  $white: #ffffff;
  $gray-border: #e0e0e0;
  $gray-info: #555;
  $gray-empty: #777;

  .admin-page {
    padding: 32px;

    h1 {
      color: $green-dark;
    }
  }

  .admin-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      color: $green-dark;
      margin-bottom: 8px;
    }
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: $white;
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
      color: $green-dark;
      margin: 0;
    }
  }

  .info {
    color: $gray-info;
    font-size: 14px;
  }

  .users-table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    background-color: $white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 20px $green-shadow;

    thead {
      background-color: $green-main;
      color: $white;
    }

    th,
    td {
      padding: 14px 16px;
      text-align: left;

      &:nth-child(2) {
        text-align: center;
      }
    }

    tbody tr {
      border-bottom: 1px solid $gray-border;

      &:hover {
        background-color: $green-hover;
      }
    }

    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
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

    .empty {
      text-align: center;
      padding: 20px;
      color: $gray-empty;
      font-style: italic;
    }
  }
</style>
