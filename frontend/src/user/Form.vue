<!-- componente form utente -->

<script setup>
  import { reactive, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import axios from "axios"
  import UserProfileForm from "./UserProfileForm.vue"
  import HeaderHome from "./HeaderHome.vue"


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
    <HeaderHome :userName="userStore.nome" :only-logout="true" />
    <div class="info-container">
      <h2>Completa il tuo profilo</h2>

      <!-- Form condiviso -->
      <UserProfileForm v-model="userInfo" />

      <!-- Bottone Continua -->
      <div class="actions">
        <button class="save" @click="saveInfo"
          :disabled="!userInfo.eta || !userInfo.peso || !userInfo.sesso || !userInfo.altezza || !userInfo.obiettivo || !userInfo.livelloAttivitaFisica || !userInfo.obiettivoPeso">
          Continua
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

  .page-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .info-container {
    width: 100%;
    max-width: 700px;
    padding: 22px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    margin-top: 200px;
    margin-bottom: 100px;

    h2 {
      text-align: center;
      margin-bottom: 40px;
    }

    p {
      font-size: inherit;
    }

    .save {
      min-width: 120px;
      font-size: 16px;
      border: 1px solid transparent;
      padding: 10px 18px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: #e8f5e9;
      color: #2e7d32;

      &:hover:enabled {
        background-color: #4caf50;
        color: white;
        border-color: #3da73f;
      }

      &:disabled {
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    margin-top: 70px;
  }
</style>
