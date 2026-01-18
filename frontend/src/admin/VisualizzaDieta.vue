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
  <button class="icon" data-label="Visualizza" @click="loadDiet">👁️</button>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Dieta settimanale</h2>

      <p v-if="loading">Caricamento...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="diet">
        <div v-for="(giorno, nomeGiorno) in diet.settimana" :key="nomeGiorno" class="day">
          <h3>{{ nomeGiorno }}</h3>

          <table>
            <thead>
              <tr>
                <th>Pasto</th>
                <th>Ricetta</th>
                <th>Orario</th>
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
.icon {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }

  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%);
    background: #2e7d32;
    color: #ffffff;
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
    text-align: center;

  }

  h3 {
    margin-top: 20px;
    margin-bottom: 8px;
    color: #388e3c;
    text-transform: capitalize;
  }
}

/* ===== GIORNO ===== */
.day {
  background: #f9fdf9;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.12);
}

/* ===== TABELLA ===== */
.day table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
}

/* HEADER */
.day thead {
  background: linear-gradient(90deg, #43a047, #66bb6a);
}

.day th {
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #ffffff;
}

/* CELLE */
.day td {
  padding: 12px 14px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

/* prima colonna (pasto) */
.day td:first-child {
  font-weight: 600;
  color: #2e7d32;
  text-transform: capitalize;
}

/* ultima riga senza bordo */
.day tbody tr:last-child td {
  border-bottom: none;
}

/* hover SOLO colore, niente transform */
.day tbody tr:hover {
  background-color: #f1f8f4;
}

.close {
  margin-top: 20px;
  padding: 10px 18px;
  background: linear-gradient(90deg, #43a047, #66bb6a);
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  display: block; // necessario
  margin: 20px auto 0;

  &:hover {
    background: linear-gradient(90deg, #388e3c, #5cb860);
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.35);
  }
}
</style>
