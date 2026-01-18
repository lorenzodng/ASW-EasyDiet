<!-- componente form utente -->

<script setup>
  import { reactive, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import axios from "axios"
  import UserProfileForm from "./UserProfileForm.vue"

  const router = useRouter();
  const userStore = useUserStore();

  //oggetto di variabili reattive
  const userInfo = reactive({
    eta: "",
    peso: "",
    sesso: "",
    altezza: "",
    obiettivo: "",
    livelloAttivitaFisica: "",
    obiettivoPeso: ""
  });

  //metodo per salvare i dati del form
  const saveInfo = async () => {
    //verifica dell'inserimenti di tutti i valori nei campi
    if (
      !userInfo.eta ||
      !userInfo.peso ||
      !userInfo.sesso ||
      !userInfo.altezza ||
      !userInfo.obiettivo ||
      !userInfo.livelloAttivitaFisica ||
      !userInfo.obiettivoPeso
    ) {
      alert("Compila tutti i campi");
      return;
    }

    try {
      const { data } = await axios.post(`http://localhost:5000/users/${userStore.id}/profile`, userInfo)

      if (data.status) {
        alert("Dati salvati con successo");
        router.push({ name: "Home" });
      } else {
        alert("Errore: " + data.message);
      }
    } catch (err) {
      alert("Errore nel salvataggio dei dati");
      console.error(err);
    }
  };

  onMounted(() => {
    userStore.fetchUser(router);
  });
</script>

<template>
  <div class="page-wrapper">
    <div class="info-container">
      <h2>Completa il tuo profilo</h2>

      <!-- Form condiviso -->
      <UserProfileForm v-model="userInfo" />

      <!-- Bottone Continua -->
      <div class="actions">
        <button 
          @click="saveInfo"
          :disabled="!userInfo.eta || !userInfo.peso || !userInfo.sesso || !userInfo.altezza || !userInfo.obiettivo || !userInfo.livelloAttivitaFisica || !userInfo.obiettivoPeso"
        >
          Continua
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  button {
    width: 100%;
    padding: 12px 0;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    background-color: #e8f5e9; /* verde chiaro simile a Salva */
    color: #2e7d32;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: #4caf50;
    color: white;
    border-color: #3da73f;
  }
}
</style>

<!--si potrebbe pensare magari di disabilitare il bottone se non sono stati inseriti i campi-->