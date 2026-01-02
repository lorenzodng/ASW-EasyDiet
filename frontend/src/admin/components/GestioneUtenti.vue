<script setup>
    import axios from "axios";
    import { ref, onMounted } from "vue";

    const users = ref([]);
    const loading = ref(true);
    const error = ref("");
    const addUser = () => {
  console.log("Aggiungi utente");
};

const editUser = (user) => {
  console.log("Modifica utente:", user);
};

const deleteUser = (user) => {
  console.log("Elimina utente:", user);
};

    onMounted(async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:5000/admin/users"
            );

            if (data.status) {
                users.value = data.users;
            } else {
                error.value = "Errore nel recupero utenti";
            }
        } catch (err) {
            console.error(err);
            error.value = "Errore di connessione";
        } finally {
            loading.value = false;
        }
    });

</script>


<template>
    <div class="admin-page">
        <div class="header">
        <h1>Gestione Utenti</h1>
        <button class="add-btn" @click="addUser">
        ➕ Aggiungi utente
      </button>
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
                    <td>{{ user.email }}</td>
          <td class="actions">
            <button class="iconaedit" @click="editUser(user)">
              ✏️
            </button>
            <button class="iconadelete" @click="deleteUser(user)">
              🗑️
            </button>
          </td>
                </tr>

                <tr v-if="users.length === 0">
                    <td colspan="2" class="empty">
                        Nessun utente trovato
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="scss">
.admin-page {
  padding: 32px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    color: #2e7d32;
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
