<!-- componente home -->

<script setup>
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import { ref, computed, onMounted } from "vue";
  import AreaDieta from "./AreaDieta.vue";
  import HeaderHome from "./HeaderHome.vue";
  import LLMChat from "./LLMChat.vue";
  import NotificationBanner from "../user/NotificationBanner.vue";

  const router = useRouter();
  const userStore = useUserStore()
  const chatOpen = ref(false);
  const userName = computed(() => userStore.nome); //ogni volta che userStore.nome cambia, userName si aggiorna automaticamente nel template

  const vaiAComponiDieta = () => {
    router.push({ name: "ComponiDieta" });
  };

  const toggleChat = () => {
    chatOpen.value = !chatOpen.value;
  };

  onMounted(() => {
    userStore.fetchUser(router);
  });
</script>

<template>
  <div class="home-container">
    <HeaderHome :userName="userName" />

    <!-- pulsante componi dieta -->
    <div class="actions">
      <button class="componi-btn" @click="vaiAComponiDieta">
        Crea dieta 🍽️
      </button>

      <!-- pulsante chat laterale -->
      <button class="chat-btn" @click="toggleChat">
        💬​
      </button>
    </div>

    <AreaDieta v-if="userStore.id" /> <!-- parte solo se l'id dell'utente esiste -->

    <!-- sidebar chat -->
    <LLMChat v-show="chatOpen" @close="chatOpen = false" />

    <!-- banner notifiche -->
    <NotificationBanner v-if="userStore.id" /> <!-- parte solo se l'id dell'utente esiste -->
  </div>
</template>

<style scoped lang="scss">
  .home-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
    padding-top: 80px;
  }

  /* bottone crea dieta */
  .componi-btn {
    background: white;
    border: 2px solid;
    border-color: #3da73f;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    text-align: center;
    margin-top: 70px;
    margin-bottom: 55px;
    font-size: 20px;

    &:hover {
      box-shadow: 0 0 0 3px rgba(12, 176, 15, 0.15);
    }
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
