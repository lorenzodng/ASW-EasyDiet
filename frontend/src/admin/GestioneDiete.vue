<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import VisualizzaDieta from "./VisualizzaDieta.vue";
  import EliminazioneDieta from "./EliminazioneDieta.vue";
  import logo from "../assets/images/logo-easydiet.png"

  const users = ref([]);
  const loading = ref(true);
  const error = ref("");

  // caricamento utenti + info personali
  const loadUsers = async () => {
    try {
      loading.value = true;

      const { data } = await axios.get(
        "http://localhost:5000/admin/users/info"
      );

      users.value = data.users;
    } catch (err) {
      error.value = "Errore nel caricamento delle diete";
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
          <td>{{ u.userId.email }}</td>
          <td>{{ u.obiettivo }}</td>
          <td>{{ u.kcal }}</td>
          <td class="actions">
            <VisualizzaDieta :userId="u.userId._id" />
            <EliminazioneDieta :userId="u.userId._id" @deleted="loadUsers" />
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

  .admin-page {
    padding: 32px;

    h1 {
      color: #2e7d32;
      margin-bottom: 24px;
    }
  }

  .error {
    color: #d32f2f;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .table {
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
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-right: 24px;
  }

</style>
