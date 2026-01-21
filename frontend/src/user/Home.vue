<!-- componente home -->

<script setup>
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import { useDietStore } from "../stores/diet"
  import { ref, computed, onMounted } from "vue";
  import AreaDieta from "./AreaDieta.vue";
  import HeaderHome from "./HeaderHome.vue";
  import LLMChat from "./LLMChat.vue";
  import NotificationBanner from "../user/NotificationBanner.vue";

  const router = useRouter();
  const userStore = useUserStore();
  const dietStore = useDietStore();
  const chatOpen = ref(false);
  const userName = computed(() => userStore.nome); //ogni volta che userStore.nome cambia, userName si aggiorna automaticamente nel template

  const vaiAComponiDieta = () => {
    router.push({ name: "ComponiDieta" });
  };

  const toggleChat = () => {
    chatOpen.value = !chatOpen.value;
  };

  onMounted(async () => {
    await userStore.fetchUser(router);
    if (userStore.id) {
      await dietStore.fetchDiet(userStore.id);
    }
  });
</script>

<template>
  <div class="home-container">
    <HeaderHome :userName="userName" />

    <!-- pulsante componi dieta -->
    <div class="no-dieta-container" v-if="userStore.id && !dietStore.dieta">
      <h2>Sei pronto a iniziare il tuo percorso?</h2>
      <p>Crea la tua dieta personalizzata! 💪</p>
      <button class="componi-btn" @click="vaiAComponiDieta">
        Crea dieta 🍽️
      </button>
    </div>

    <!-- pulsante chat laterale -->
    <button class="chat-btn" @click="toggleChat">
      💬​
    </button>

    <AreaDieta v-if="dietStore.dieta" class="area-dieta-spacing" /> <!-- parte solo se l'id dell'utente esiste -->

    <!-- sidebar chat -->
    <LLMChat v-show="chatOpen" @close="chatOpen = false" />

    <!-- banner notifiche -->
    <NotificationBanner v-if="userStore.id" /> <!-- parte solo se l'id dell'utente esiste -->
  </div>
</template>

<style scoped lang="scss">
  .home-container {
    width: 100%;
    position: relative;
    padding-top: 80px;
  }

  .no-dieta-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 80px);
    text-align: center;
    padding: 0 20px;

    h2 {
      font-size: 25px;
      color: #2e7d32;
      margin-bottom: 12px;
    }

    p {
      font-size: 19px;
      color: #555;
      margin-bottom: 30px;
    }
  }

  .componi-btn {
    background: white;
    border: 2px solid #3da73f;
    text-align: center;
    font-size: 21px;
    margin-top: 20px;
    box-sizing: border-box;

    &:hover {
      outline: 1px solid #00ff00;
    }
  }

  .area-dieta-spacing {
    margin-top: 80px;
  }

  .chat-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    bottom: 50px;
    right: 70px;

    background-color: #3da73f;
    color: white;
    border: none;
    font-size: 22px;
    cursor: pointer;

    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    z-index: 1;

    &:hover {
      background-color: #09940c;
    }
  }
</style>
