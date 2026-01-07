<script setup>
import { ref } from "vue";
import axios from "axios";

// props dal padre
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const showModal = ref(false);
const loading = ref(false);
const error = ref("");
const diet = ref(null);

// carica dieta
const loadDiet = async () => {
  try {
    loading.value = true;
    error.value = "";

    const { data } = await axios.get(
      `http://localhost:5000/diets/${props.userId}`
    );

    if (!data.status) {
      error.value = "Dieta non presente";
      return;
    }

    diet.value = data.data;
    showModal.value = true;

  } catch (err) {
    console.error(err);
    error.value = "Errore nel caricamento della dieta";
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  diet.value = null;
};
</script>

<template>
  <button @click="loadDiet">👁️</button>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Dieta settimanale</h2>

      <p v-if="loading">Caricamento...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="diet">
        <div
          v-for="(giorno, nomeGiorno) in diet.settimana"
          :key="nomeGiorno"
          class="day"
        >
          <h3>{{ nomeGiorno }}</h3>

          <table>
            <thead>
              <tr>
                <th>Pasto</th>
                <th>Ricetta</th>
                <th>Ora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pasto, nomePasto) in giorno" :key="nomePasto">
                <td>{{ nomePasto }}</td>
                <td>{{ pasto.recipe?.nome || "—" }}</td>
                <td>{{ pasto.time || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button class="close" @click="closeModal">Chiudi</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    transform: scale(1.1);
  }
}

.error {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 12px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

  h2 {
    color: #2e7d32;
    margin-bottom: 16px;
  }

  h3 {
    margin-top: 20px;
    margin-bottom: 8px;
    color: #388e3c;
    text-transform: capitalize;
  }
}

.day table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
  }

  thead {
    background: #4caf50;
    color: white;
  }
}

.close {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #e0e0e0;
  border-radius: 6px;

  &:hover {
    background-color: #d5d5d5;
  }
}
</style>
