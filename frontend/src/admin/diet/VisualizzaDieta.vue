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
                <th>Piatto</th>
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
  $green-dark: #2e7d32;
  $green-light: #388e3c;
  $green-gradient-start: #43a047;
  $green-gradient-end: #66bb6a;
  $white: #ffffff;
  $black-light: #333;
  $red-error: #d32f2f;
  $border-radius-small: 6px;
  $border-radius-medium: 8px;
  $border-radius-large: 10px;
  $border-radius-xlarge: 12px;
  $border-radius-day: 14px;
  $box-shadow-icon: 0 0 0 rgba(0, 0, 0, 0);
  $box-shadow-modal: 0 10px 30px rgba(0, 0, 0, 0.25);
  $box-shadow-day: 0 4px 12px rgba(76, 175, 80, 0.12);
  $box-shadow-close-hover: 0 4px 10px rgba(76, 175, 80, 0.35);
  $padding-page: 16px;
  $padding-cell: 12px 14px;
  $font-size-sm: 15px;
  $font-size-md: 14px;
  $font-size-lg: 18px;
  $font-size-xl: 14px;

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
      background: $green-dark;
      color: $white;
      padding: 4px 8px;
      border-radius: $border-radius-small;
      font-size: $font-size-sm;
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
    color: $red-error;
    font-size: $font-size-md;
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
    background: $white;
    padding: 24px;
    border-radius: $border-radius-xlarge;
    width: 90%;
    max-width: 900px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: $box-shadow-modal;

    h2 {
      margin-bottom: 16px;
      text-align: center;
    }

    h3 {
      margin-top: 20px;
      margin-bottom: 8px;
      text-transform: capitalize;
      text-align: center;
    }
  }

  .day {
    background: #f9fdf9;
    border-radius: $border-radius-day;
    padding: $padding-page;
    margin-bottom: 24px;
    box-shadow: $box-shadow-day;

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: $white;
      border-radius: $border-radius-large;
      overflow: hidden;

      thead {
        background: linear-gradient(90deg, $green-gradient-start, $green-gradient-end);
      }

      th {
        padding: $padding-cell;
        font-size: $font-size-sm;
        font-weight: 700;
        text-transform: capitalize;
        letter-spacing: 0.5px;
        color: $white;
      }

      td {
        padding: $padding-cell;
        font-size: $font-size-md;
        color: $black-light;
        border-bottom: 1px solid #e0e0e0;

        &:first-child {
          font-weight: 600;
          text-transform: capitalize;
        }
      }

      th:nth-child(2),
      td:nth-child(2) {
        text-align: center;
        padding-right: 52px;

      }

      th:last-child,
      td:last-child {
        text-align: right;
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      tbody tr:hover {
        background-color: #f1f8f4;
      }
    }
  }

  .close {
    margin-top: 20px;
    padding: 10px 18px;
    background: linear-gradient(90deg, $green-gradient-start, $green-gradient-end);
    color: $white;
    border-radius: $border-radius-medium;
    font-size: $font-size-xl;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, box-shadow 0.2s ease;
    display: block;
    margin: 20px auto 0;

    &:hover {
      background: linear-gradient(90deg, $green-light, #5cb860);
      box-shadow: $box-shadow-close-hover;
    }
  }
</style>
