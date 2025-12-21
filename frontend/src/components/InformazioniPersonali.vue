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

  const modifica = () => {
    router.push({ name: "Form" })
  }
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
        <p><strong>Età:</strong> {{ info.eta }}</p>
        <p><strong>Peso:</strong> {{ info.peso }} kg</p>
        <p><strong>Altezza:</strong> {{ info.altezza }} cm</p>
        <p><strong>Sesso:</strong> {{ info.sesso }}</p>
        <p><strong>Obiettivo:</strong> {{ info.obiettivo }}</p>
        <p><strong>Attività fisica:</strong> {{ info.livelloAttivitaFisica }}</p>
      </div>
      <div class="actions">
        <button @click="modifica">
          ✏️ Modifica Informazioni
        </button>
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