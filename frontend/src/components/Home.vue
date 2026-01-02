<!-- componente home -->

<script setup>
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/user'
  import { ref, computed, onMounted } from "vue";
  import AreaDieta from "./AreaDieta.vue";
  import HeaderHome from "./HeaderHome.vue";
  import LLMChat from "./LLMChat.vue";
  import NotificationBanner from "../components/NotificationBanner.vue";

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
      <button @click="vaiAComponiDieta">
        ➕ Componi Dieta
      </button>

      <!-- pulsante chat laterale -->
      <button @click="toggleChat">
        💬 Chat LLM
      </button>
    </div>

    <AreaDieta v-if="userStore.id" /> <!-- parte solo se l'id dell'utente esiste -->

    <!-- sidebar chat -->
    <LLMChat v-show="chatOpen" @close="chatOpen = false" />

    <!-- banner notifiche -->
    <NotificationBanner v-if="userStore.id" /> <!-- parte solo se l'id dell'utente esiste -->
  </div>
</template>

<style scoped>
  .home-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
  }

  .actions {
    text-align: center;
    margin: 20px 0;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin: 0 5px;
  }
</style>

<!--magari aggiungere un più nel bottone e verificare come mette i componenti-->