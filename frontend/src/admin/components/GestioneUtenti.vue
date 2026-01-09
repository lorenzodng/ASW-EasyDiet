<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
    import logo from "../../assets/images/logo-easydiet.png"

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

//MODIFICA EMAIL
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



// CARICAMENTO INIZIALE
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
    <header class="admin-header">
    <div class="admin-topbar">
      <img :src="logo" alt="EasyDiet logo" class="admin-logo" />

      <div class="admin-titles">
        <h1>Gestione Utenti</h1>
      </div>
    </div>
  </header>
    <button class="add" @click="toggleForm">
          ➕ Aggiungi utente
        </button>
        <div>
        

        <form v-if="showForm" class="user-form" @submit.prevent="submitUser">
          <input type="text" placeholder="Nome" v-model="newUser.nome" required />
          <input type="email" placeholder="Email" v-model="newUser.email" required />
          <input type="password" placeholder="Password" v-model="newUser.password" required />
          <button type="submit">Crea utente</button>
        </form>
      </div>

    <!-- CONTENITORE ORIZZONTALE -->
    <div class="header">
      

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
                  <input type="email" v-model="editEmail" class="edit-input" />
                </div>
              </td>

              <td class="actions">
                <template v-if="isEditing !== user._id">
                  <button class="icon" data-label="Visualizza" @click="openUserModal(user)">👁️</button>
                  <button class="icon" data-label="Modifica" @click="editUser(user)">✏️</button>
                  <button class="icon" data-label="Elimina" @click="deleteUser(user)">🗑️</button>
                </template>

                <template v-else>
                  <button class="icon" data-label="Salva" @click="saveUser(user)" :disabled="saving">
                    💾
                  </button>
                  <button class="icon" data-label="Annulla" @click="cancelEdit">
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

    <div v-else-if="userInfo" class="user-info">
      <p><strong>Età:</strong> {{ userInfo.eta }}</p>
      <p><strong>Sesso:</strong> {{ userInfo.sesso }}</p>
      <p><strong>Altezza:</strong> {{ userInfo.altezza }} cm</p>
      <p><strong>Obiettivo:</strong> {{ userInfo.obiettivo }}</p>
      <p><strong>Livello attività:</strong> {{ userInfo.livelloAttivitaFisica }}</p>
      <p><strong>Obiettivo peso:</strong> {{ userInfo.obiettivoPeso }} kg</p>
      <p><strong>Kcal giornaliere:</strong> {{ userInfo.kcal }}</p>

      <h3>Storico pesi</h3>

      <ul v-if="userInfo.pesi?.length" class="weight-list">
  <li v-for="(p, index) in userInfo.pesi.sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  )" :key="index">
    <span class="weight">{{ p.peso }} kg</span>
    <span class="date">
      {{ new Date(p.data).toLocaleDateString() }}
    </span>
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
  height: 90px;
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
.user-form {
 margin: 32px auto 40px;   //  centra orizzontalmente
  display: flex;
  flex-direction: column;  // INPUT UNO SOTTO L’ALTRO
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


.add {
  padding: 10px 16px;
  background-color: #ffffff;
  color: #0a0000;
  border: 2px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #4caf50;
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
    background: #2dd372;
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

  .edit-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #4caf50;
  border-radius: 8px;
  background: #f9fff9;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
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
    color: #2e7d32;
    text-align: center;
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

.user-info {
  text-align: left;
  margin-top: 12px;

  p {
    margin: 6px 0;
    font-size: 16px;
    color: #333333;
  }

  strong {
    color: #38973d;
  }
}

.weight-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.weight-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: #f2f8f3;
  border-radius: 8px;
  font-size: 14px;
}

.weight {
  font-weight: 600;
  color: #555;
}

.date {
  font-size: 13px;
  color: #555;
}

</style>
