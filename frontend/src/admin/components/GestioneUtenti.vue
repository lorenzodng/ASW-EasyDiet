<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const users = ref([]);
const loading = ref(true);
const error = ref("");

const isEditing = ref(null); // DEVE essere null o _id
const editEmail = ref("");
const saving = ref(false);

const showForm = ref(false);
const newUser = ref({
  nome: "",
  email: "",
  password: ""
});

const toggleForm = () => {
  showForm.value = !showForm.value;
};

// 🔹 CREA UTENTE + RICARICA LISTA
const submitUser = async () => {
  error.value = "";

  try {
    const { data } = await axios.post(
      "http://localhost:5000/admin/users",
      newUser.value
    );

    if (data.status) {
      const res = await axios.get("http://localhost:5000/admin/users");
      users.value = res.data.users;

      showForm.value = false;
      newUser.value = { nome: "", email: "", password: "" };
    } else {
      error.value = data.message || "Errore creazione utente";
    }
  } catch (err) {
    error.value = "Errore di connessione";
  }
};

// 🔹 MODIFICA EMAIL
const editUser = (user) => {
  isEditing.value = user._id;
  editEmail.value = user.email;
};

const cancelEdit = () => {
  isEditing.value = null;
  editEmail.value = "";
};

const saveUser = async (user) => {
  saving.value = true;

  try {
    const { data } = await axios.put(
      `http://localhost:5000/admin/users/${user._id}`,
      { email: editEmail.value }
    );

    if (data.status) {
      user.email = editEmail.value;
      isEditing.value = null;
    } else {
      error.value = data.message || "Errore aggiornamento";
    }
  } catch {
    error.value = "Errore di connessione";
  } finally {
    saving.value = false;
  }
};

const deleteUser = (user) => {
  console.log("Elimina utente:", user);
};

// 🔹 CARICAMENTO INIZIALE
onMounted(async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/admin/users");
    if (data.status) {
      users.value = data.users;
    } else {
      error.value = "Errore nel recupero utenti";
    }
  } catch {
    error.value = "Errore di connessione";
  } finally {
    loading.value = false;
  }
});
</script>


<template>
  <div class="header">
    <div class="admin-page">
      <h1>Gestione Utenti</h1>

      <button class="add-btn" @click="toggleForm">
        ➕ Aggiungi utente
      </button>

      <form v-if="showForm" class="user-form" @submit.prevent="submitUser">
        <input type="text" placeholder="Nome" v-model="newUser.nome" required />
        <input type="email" placeholder="Email" v-model="newUser.email" required />
        <input type="password" placeholder="Password" v-model="newUser.password" required />
        <button type="submit">Crea utente</button>
      </form>
    </div>

    <p v-if="loading" class="info">Caricamento utenti...</p>
    <p v-if="error" class="error">{{ error }}</p>

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

          <td>
            <!-- 🔴 FIX QUI -->
            <p v-if="isEditing !== user._id">{{ user.email }}</p>
            <div v-else>
              <input type="email" v-model="editEmail" />
            </div>
          </td>

          <td class="actions">
            <template v-if="isEditing !== user._id">
              <button class="iconaedit" @click="editUser(user)">✏️</button>
              <button class="iconadelete" @click="deleteUser(user)">🗑️</button>
            </template>

            <template v-else>
              <button class="iconasave" @click="saveUser(user)" :disabled="saving">
                💾
              </button>
              <button class="iconacancel" @click="cancelEdit">
                ❌
              </button>
            </template>
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-page {
  padding: 32px;

  h1 {
    color: #2e7d32;
  }
}

.user-form {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  input {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    min-width: 200px;

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


.add-btn {
  padding: 10px 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #66bb6a;
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

  .iconaedit {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    }

    &.edit {
      color: #1976d2;
    }

    &.delete {
      color: #d32f2f;
    }
  }

  .iconadelete {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    }

    &.edit {
      color: #1976d2;
    }

    &.delete {
      color: #d32f2f;
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
