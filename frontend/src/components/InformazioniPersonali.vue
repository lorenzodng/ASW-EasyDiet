<!-- componente informazioni personali -->

<script setup>
  import { ref, onMounted } from "vue"
  import { useUserStore } from "../stores/user"
  import { useRouter } from "vue-router"
  import axios from "axios"
  import HeaderHome from "./HeaderHome.vue"

  const userStore = useUserStore()  //per chiedere al backend i dati di quello specifico utente 
  const router = useRouter()
  const info = ref(null)
  const loading = ref(true) //perchè quando il componente nasce sta caricando 
  const error = ref(null)
  const isEditing = ref(false);  // per abilitare la modifica 
  const editInfo = ref(null); //copia delle info

  onMounted(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`)
      info.value = res.data
    } catch (err) {
      error.value = "Impossibile caricare le informazioni personali"
    } finally {
      loading.value = false
    }
  })

  // abilita modifica
  const modifica = () => {
    editInfo.value = { ...info.value };
    isEditing.value = true;
  };

  const saveInfo = async () => {
    try {
      const { data } = await axios.post(`http://localhost:5000/users/${userStore.id}/profile`, editInfo.value);

      if (data.status) {
        info.value = { ...editInfo.value }; // aggiorni i dati 
        isEditing.value = false;
      }
    } catch (err) {
      alert("Errore nel salvataggio");
    }
  };
  const annulla = () => {
    isEditing.value = false;
    editInfo.value = null;
  };

</script>

<template>
  <div>
    <HeaderHome :userName="userStore.nome" />
    <div class="info-container">
      <h2>Informazioni personali</h2>

      <!-- stato di caricamento -->
      <p v-if="loading">Caricamento...</p>

      <!-- stato di errore -->
      <p v-else-if="error">{{ error }}</p>

      <!-- dati caricati -->
      <div v-else>
        <p v-if="!isEditing"><strong>Età:</strong> {{ info.eta }}</p>
        <div v-else><label>Età</label><input type="number" v-model.number="editInfo.eta" /></div>
        <p v-if="!isEditing"><strong>Peso:</strong> {{ info.peso }} kg</p>
        <div v-else>
          <label>Peso (kg)</label>
          <input type="number" v-model.number="editInfo.peso" />
        </div>
        <p v-if="!isEditing"><strong>Altezza:</strong> {{ info.altezza }} cm</p>
        <div v-else>
          <label>Altezza</label>
          <input type="number" v-model.number="editInfo.altezza" />
        </div>
        <p v-if="!isEditing"><strong>Sesso:</strong> {{ info.sesso }}</p>
        <div v-else>
          <label>Sesso</label>
          <select v-model="editInfo.sesso" required>
            <option disabled value="">Seleziona</option>
            <option value="maschio">Maschio</option>
            <option value="femmina">Femmina</option>
          </select>
        </div>
        <p v-if="!isEditing"><strong>Obiettivo:</strong> {{ info.obiettivo }}</p>
        <div v-else>
          <label>Obiettivo</label>
          <select v-model="editInfo.obiettivo" required>
            <option disabled value="">Seleziona</option>
            <option value="dimagrimento">Dimagrimento</option>
            <option value="mantenimento">Mantenimento</option>
            <option value="aumento_peso">Aumento di peso</option>
          </select>
        </div>
        <p v-if="!isEditing"><strong>Peso Obiettivo:</strong> {{ info.obiettivoPeso }}</p>
        <div v-else>
          <label>Peso obiettivo</label>
          <input type="number" v-model.number="editInfo.obiettivoPeso" />
        </div>
        <p v-if="!isEditing"><strong>Attività fisica:</strong> {{ info.livelloAttivitaFisica }}</p>
        <div v-else>
          <label>Attività fisica</label>
          <select v-model="editInfo.livelloAttivitaFisica">
            <option value="basso">Basso</option>
            <option value="moderato">Moderato</option>
            <option value="intenso">Intenso</option>
          </select>
        </div>
      </div>
      <div class="actions">
        <button v-if="!isEditing" @click="modifica">✏️ Modifica</button>
        <template v-else>
          <button @click="saveInfo">
            💾 Salva
          </button>
          <button @click="annulla">
            ❌ Annulla
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .info-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }

  button {
    margin-top: 20px;
    padding: 10px 16px;
    font-size: 16px;
    cursor: pointer;
  }
</style>