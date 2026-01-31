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
  $box-shadow-topbar: 0 6px 16px $gray-shadow;
  $box-shadow-table: 0 8px 20px $green-dark-box-shadow;

  .admin-header {
    margin-bottom: 40px;
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: $white;
    border-radius: 18px;
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
      color: $green-main;
      margin: 0 0 24px 0;
    }
  }

  .admin-page {
    padding: 32px;
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
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $box-shadow-table;

    thead {
      background-color: $green-hover;
      color: $white;
    }

    th,
    td {
      padding: 14px 16px;
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
      border-bottom: 1px solid $gray-soft;

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
