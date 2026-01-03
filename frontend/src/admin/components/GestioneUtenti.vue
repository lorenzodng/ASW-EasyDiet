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

const showUserModal = ref(false);
const selectedUser = ref(null);
const userInfo = ref(null);
const loadingInfo = ref(false);

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

//const deleteUser = (user) => {
  //console.log("Elimina utente:", user);
//};

const deleteUser = async (user) => {
  const conferma = confirm(
    `Sei sicuro di eliminare l'utente ${user.nome}?`
  ); //mostra un popup per confermare  o annullare 

  if (!conferma) return;

  try {
    const { data } = await axios.delete(
      `http://localhost:5000/admin/users/${user._id}`
    );

    if (data.status) {
      //ricarico lista utenti
      const res = await axios.get("http://localhost:5000/admin/users");
      users.value = res.data.users;
    } else {
      error.value = data.message || "Errore eliminazione";
    }
  } catch (err) {
    error.value = "Errore di connessione";
  }
};

const openUserModal = async (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
  loadingInfo.value = true;
  userInfo.value = null;

  try {
    const { data } = await axios.get(
      `http://localhost:5000/admin/users/${user._id}/info`
    );

    if (data.status) {
      userInfo.value = data.info;
    } else {
      userInfo.value = null;
    }
  } catch (err) {
    error.value = "Errore nel caricamento informazioni utente";
  } finally {
    loadingInfo.value = false;
  }
};

const closeUserModal = () => {
  showUserModal.value = false;
  selectedUser.value = null;
  userInfo.value = null;
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
  <div class="admin-page">
    <!-- TITOLO -->
    <h1>Gestione Utenti</h1>

    <!-- CONTENITORE ORIZZONTALE -->
    <div class="header">
      
      <!-- SINISTRA: pulsante + form -->
      <div>
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

      <!-- DESTRA: tabella -->
      <div style="flex: 1">
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
                <p v-if="isEditing !== user._id">{{ user.email }}</p>
                <div v-else>
                  <input type="email" v-model="editEmail" />
                </div>
              </td>

              <td class="actions">
                <template v-if="isEditing !== user._id">
                  <button @click="openUserModal(user)">👁️</button>
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
        <!-- MODALE INFO UTENTE -->
<div
  v-if="showUserModal"
  class="modal-overlay"
  @click.self="closeUserModal"
>
  <div class="modal">
    <h2>Informazioni personali</h2>

    <div v-if="loadingInfo">
      <p>Caricamento informazioni...</p>
    </div>

    <div v-else-if="userInfo">
      <p><strong>Età:</strong> {{ userInfo.eta }}</p>
      <p><strong>Sesso:</strong> {{ userInfo.sesso }}</p>
      <p><strong>Altezza:</strong> {{ userInfo.altezza }} cm</p>
      <p><strong>Obiettivo:</strong> {{ userInfo.obiettivo }}</p>
      <p><strong>Livello attività:</strong> {{ userInfo.livelloAttivitaFisica }}</p>
      <p><strong>Obiettivo peso:</strong> {{ userInfo.obiettivoPeso }} kg</p>
      <p><strong>Kcal giornaliere:</strong> {{ userInfo.kcal }}</p>

      <h3>Storico pesi</h3>

      <ul v-if="userInfo.pesi?.length">
        <li v-for="(p, index) in userInfo.pesi" :key="index">
          {{ p.peso }} kg — {{ new Date(p.data).toLocaleDateString() }}
        </li>
      </ul>

      <p v-else>Nessun peso registrato</p>
    </div>

    <div v-else>
      <p>Nessuna informazione personale disponibile</p>
    </div>

    <button @click="closeUserModal">Chiudi</button>
  </div>
</div>

      </div>

    </div>
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

  h2 {
    margin-bottom: 16px;
    color: #2e7d32;
  }

  h3 {
    margin-top: 16px;
    margin-bottom: 8px;
  }

  button {
    margin-top: 16px;
    padding: 8px 14px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #66bb6a;
    }
  }
}

</style>
