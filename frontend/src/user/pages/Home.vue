<script setup>
  import { useRouter } from "vue-router";
  import { useUserStore } from '../../stores/user'
  import { useDietStore } from "../../stores/diet"
  import { ref, computed, onMounted } from "vue";
  import axios from 'axios';
  import AreaDieta from "../components/AreaDieta.vue";
  import HeaderHome from "../components/HeaderHome.vue";
  import LLMChat from "../components/LLMChat.vue";
  import NotificationBanner from "../components/NotificationBanner.vue";

  const router = useRouter();
  const userStore = useUserStore();
  const dietStore = useDietStore();
  const chatOpen = ref(false);
  const userSesso = ref(null);
  const userName = computed(() => userStore.nome); /// automatically updates when userStore.nome changes

  const readyText = computed(() => {
    return userSesso.value === "maschio" ? "Sei pronto" : "Sei pronta";
  });

  const fetchUserSesso = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/users/${userId}/profile`);
      userSesso.value = data.sesso;
    } catch (err) {
      console.error("Errore nel recupero del sesso:", err);
    }
  };

  const goToComponiDieta = () => {
    router.push({ name: "ComponiDieta" });
  };

  const toggleChat = () => {
    chatOpen.value = !chatOpen.value;
  };

  onMounted(async () => {
    await userStore.fetchUser(router);
    if (userStore.id) {
      await dietStore.fetchDiet(userStore.id);
      await fetchUserSesso(userStore.id);
    }
  });
</script>

<template>
  <div class="home-container">
    <HeaderHome :userName="userName" />

    <div class="no-dieta-container" v-if="userStore.id && !dietStore.dieta">
      <h2>{{ readyText }} a iniziare il tuo percorso?</h2>
      <p class="subtitle">Crea la tua dieta personalizzata! 💪</p>

      <div class="steps">
        <div class="step">
          <span class="icon">1️⃣</span>
          <span>Scegli i piatti più adatti alle tue preferenze</span>
        </div>
        <div class="step">
          <span class="icon">2️⃣</span>
          <span>Aggiorna il peso quando vuoi</span>
        </div>
        <div class="step">
          <span class="icon">3️⃣</span>
          <span>Monitora i tuoi progressi nel tempo</span>
        </div>
      </div>

      <button class="componi-btn" @click="goToComponiDieta">
        Crea dieta 🍽️
      </button>
    </div>

    <button class="chat-btn" @click="toggleChat">
      💬
    </button>

    <AreaDieta v-if="dietStore.dieta" class="area-dieta-spacing" /> <!-- shown only if a diet exists -->

    <LLMChat v-show="chatOpen" @close="chatOpen = false" />

    <NotificationBanner v-if="userStore.id" /> <!-- shown only when the user ID exists -->
  </div>
</template>

<style scoped lang="scss">
  $white: #ffffff;
  $black: #000000;

  $gray-text: #333;
  $gray-muted: #555;

  $green-main:  #2e7d32;
  $green-hover: #4caf50;
  $green-dark:  #1b5e20;
  $green-border: #3da73f;

$transition-fast: 0.2s ease;
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
     color: $green-main;
      margin-bottom: 12px;
    }

    p {
      font-size: 19px;
      color: $gray-muted;
      margin-bottom: 30px;
    }
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 25px;
    max-width: 420px;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 17px;
    color: $gray-text;
  }

  .componi-btn {
    background: $white;
    border: 2px solid $green-border;
    text-align: center;
    font-size: 21px;
    margin-top: 20px;
    box-sizing: border-box;

    &:hover {
      outline: 1px solid $green-hover;
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

    background-color: $green-border;
    color: $white;
    border: none;
    font-size: 22px;
    cursor: pointer;

    box-shadow: 0 6px 20px rgba($black, 0.25);
    z-index: 1;

    &:hover {
      background-color: $green-dark;
    }
  }
</style>
