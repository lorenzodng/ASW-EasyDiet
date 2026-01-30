<script setup>
  import { ref, onMounted } from "vue"
  import { useUserStore } from "../../stores/user"
  import { useDietStore } from "../../stores/diet"
  import { useRouter } from "vue-router";
  import axios from "axios"
  import HeaderHome from "../components/HeaderHome.vue"
  import UserProfileForm from "../components/UserProfileForm.vue"

  const router = useRouter();
  const userStore = useUserStore()  // to request from the backend the data of the specific user 
  const dietStore = useDietStore()
  const info = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const isEditing = ref(false);
  const editInfo = ref(null); // copy of the user info used while editing

  const getProfileInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${userStore.id}/profile`)
      info.value = res.data
    } catch (err) {
      error.value = "Impossibile caricare le informazioni personali"
    } finally {
      loading.value = false
    }
  }

  const edit = () => {
    editInfo.value = { ...info.value };
    isEditing.value = true;
  };

  const saveInfo = async () => {
    try {
      const { data } = await axios.post(`http://localhost:5000/users/${userStore.id}/profile`, editInfo.value);

      if (data.status) {
        info.value = { ...editInfo.value };
        isEditing.value = false;
      } else {
        alert("Errore: " + data.message);
      }
    } catch (err) {
      alert("Errore nel salvataggio");
    }
  };
  // cancel editing and restore original data
  const cancelInfo = () => {
    isEditing.value = false;
    editInfo.value = null;
  };

  onMounted(() => {
    const init = async () => {
      await userStore.fetchUser(router);
      await getProfileInfo();
      await dietStore.fetchDiet(userStore.id);
    };
    init();
  });
</script>

<template>
  <div class="page-wrapper">
    <HeaderHome :userName="userStore.nome" />

    <div class="info-container" :class="{ editing: isEditing }">
      <h2>Informazioni personali</h2>

      <p v-if="loading">Caricamento...</p>

      <p v-else-if="error">{{ error }}</p>

      <div v-else>

        <template v-if="!isEditing">
          <p><strong>Età:</strong> {{ info.eta }}</p>
          <p><strong>Peso:</strong> {{ info.peso }} kg</p>
          <p><strong>Altezza:</strong> {{ info.altezza }} cm</p>
          <p><strong>Sesso:</strong> {{ info.sesso }}</p>
          <p><strong>Obiettivo:</strong> {{ info.obiettivo }}</p>
          <p><strong>Obiettivo peso:</strong> {{ info.obiettivoPeso }}</p>
          <p><strong>Attività fisica:</strong> {{ info.livelloAttivitaFisica }}</p>
        </template>

        <template v-else>
          <UserProfileForm v-model="editInfo" />

          <div class="actions">
            <button class="save" @click="saveInfo">Salva</button>
            <button class="cancel" @click="cancelInfo">Annulla</button>
          </div>
        </template>
      </div>

      <div class="actions" v-if="!isEditing">
        <button @click="edit">✏️ Modifica</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

  $red-dark: #b71c1c;

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
    background: $white;
    box-shadow: 0 10px 30px rgba($black, 0.08);

    &.editing {
      margin-top: 200px;
      margin-bottom: 100px;
    }

    h2 {
      text-align: center;
      margin-bottom: 40px;
    }

    p {
      font-size: 16px;
    }

    .save {
      background-color: $green-light;
      color: $green-main;

      &:hover {
        background-color: $green-hover;
        color: $white;
        border-color: $green-border;
      }
    }

    .cancel {
      background-color: $red-light;
      color: $red-error;

      &:hover {
        background-color: $red-hover;
        color: $white;
        border-color: $red-dark;
      }
    }

    .save,
    .cancel {
      min-width: 120px;
      font-size: 16px;
      border: 1px solid transparent;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      transition: all $transition-fast;

    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 55px;
      margin-top: 70px;
    }
  }
</style>