<script setup>
  import { useRouter } from "vue-router";
  import logo from "./assets/images/logo-easydiet.png";

  // Welcome page of the application

  const router = useRouter();

  const goToLogin = () => {
    router.push({ name: "Login" })
  }
</script>

<template>
  <div class="welcome">
    <img :src="logo" alt="EasyDiet logo" class="logo" />
    <h1 class="subtitle">Benvenuto su EasyDiet</h1>

    <p class="description fadeInUp">
      Con EasyDiet puoi comporre la tua dieta personalizzata giorno per giorno,
      scegliendo i piatti che preferisci in base alle tue preferenze e al tuo stile di vita,
      e monitorare i tuoi progressi nel tempo per raggiungere i tuoi obiettivi di benessere.
    </p>

    <button class="login-button" @click="goToLogin">Accedi</button>
  </div>
</template>

<style scoped lang="scss">

  .login-button {
    margin-top: 50px;
    padding: 12px 28px;
    font-size: 18px;
    font-weight: 600;
    color: $white;
    background-color: $green-border;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all $transition-fast;
    opacity: 0;
    animation: fadeInUp 1.5s ease-out forwards;
    animation-delay: 1.2s;

    &:hover {
      background-color: $green-hover;
      box-shadow: 0 0 12px $green-box-shadow;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 0 6px $gray-box-shadow-green;
    }
  }

  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 80px;
    background-color: $green-light;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .logo {
    width: 340px;
    margin-bottom: 20px;
    transform: translateX(-10px);
  }

  .fadeInUp {
    animation: fadeInUp 1.5s ease-out forwards;
    opacity: 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .subtitle {
    font-size: 29px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .description {
    max-width: 540px;
    font-size: 18px;
    line-height: 1.6;
    opacity: 0.85;
  }
</style>
