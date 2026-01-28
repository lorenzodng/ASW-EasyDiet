<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import logo from "../../assets/images/logo-easydiet.png"
  import VisualizzaDieta from "../components/diet/VisualizzaDieta.vue";
  import EliminazioneDieta from "../components/diet/EliminazioneDieta.vue";

  const users = ref([]);
  const loading = ref(true);
  const error = ref("");

  const loadUsers = async () => {
    try {
      loading.value = true;
      const { data } = await axios.get("http://localhost:5000/admin/users/info");
      users.value = data.users.filter(u => u.obiettivo && u.kcal);
    } catch (err) {
      error.value = "Errore nel caricamento delle diete";
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadUsers();
  });
</script>

<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="admin-topbar">
        <router-link to="/admin/home" class="logo">
          <img :src="logo" alt="EasyDiet logo" class="admin-logo" />
        </router-link>
        <div class="admin-titles">
          <h1>Gestione Diete</h1>
        </div>
      </div>
    </header>

    <p v-if="loading">Caricamento...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="!loading && users.length" class="table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Obiettivo</th>
          <th>Kcal</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in users" :key="u._id">
          <td>{{ u.email }}</td>
          <td>{{ u.obiettivo }}</td>
          <td>{{ u.kcal }}</td>
          <td class="actions">
            <VisualizzaDieta :userId="u._id" />
            <EliminazioneDieta :userId="u._id" @deleted="loadUsers" />
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && users.length === 0">
      Nessuna dieta trovata
    </p>
  </div>
</template>

<style scoped lang="scss">
  $green-dark: #2e7d32;
  $green-button: #4caf50;
  $white: #ffffff;
  $red-error: #d32f2f;
  $bg-table-hover: #f1f8f4;
  $border-radius-small: 12px;
  $border-radius-medium: 18px;
  $border-table: #e0e0e0;
  $box-shadow-topbar: 0 6px 16px rgba(0, 0, 0, 0.06);
  $box-shadow-table: 0 8px 20px rgba(76, 175, 80, 0.12);
  $padding-page: 32px;
  $padding-table-cell: 14px 16px;

  .admin-header {
    margin-bottom: 40px;
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: $white;
    border-radius: $border-radius-medium;
    box-shadow: $box-shadow-topbar;
  }

  .admin-logo {
    height: 120px;
    cursor: pointer;
  }

  .admin-titles {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -27%);
    text-align: center;

    h1 {
      font-size: 33px;
      color: $green-dark;
      margin: 0 0 24px 0;
    }
  }

  .admin-page {
    padding: $padding-page;
  }

  .error {
    color: $red-error;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background-color: $white;
    border-radius: $border-radius-small;
    overflow: hidden;
    box-shadow: $box-shadow-table;

    thead {
      background-color: $green-button;
      color: $white;
    }

    th,
    td {
      padding: $padding-table-cell;
      text-align: left;

      &:nth-child(2),
      &:nth-child(3) {
        text-align: center;
        padding-right: 145px;
      }

      &:nth-child(2) {
        text-transform: capitalize;
      }
    }

    tbody tr {
      border-bottom: 1px solid $border-table;

      &:hover {
        background-color: $bg-table-hover;
      }
    }
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
</style>
