<script setup>
  import { useRouter } from "vue-router"
  import logo from "../../assets/images/logo-easydiet.png"

  const router = useRouter()

  const goToLogin = () => {
    router.push({ name: "Login" })
  }
</script>
<template>
  <div class="welcome">
    <img :src="logo" alt="EasyDiet logo" class="logo" />
    <p class="subtitle">
      Benvenuto su EasyDiet
    </p>

    <p class="description">
      Con EasyDiet puoi comporre la tua dieta personalizzata giorno per giorno,
      scegliendo i piatti che preferisci in base alle tue preferenze e al tuo stile di vita.
    </p>

    <button class="login-button" @click="goToLogin">Accedi</button>
  </div>
</template>

<style scoped lang="scss">
  $white: #ffffff;

  $green-main:  #4caf50;
  $green-hover: #66bb6a;
  $green-light: #e8f5e9;

  $transition-medium: 0.3s ease;
  .login-button {
    margin-top: 50px;
    padding: 12px 28px;
    font-size: 18px;
    font-weight: 600;
    color: $white;
    background-color: $green-main;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all $transition-medium;

    &:hover {
      background-color: $green-hover;
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.6);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
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
    width: 350px;
    height: auto;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .description {
    max-width: 500px;
    font-size: 18px;
    line-height: 1.5;
    opacity: 0.9;
    margin-bottom: 20px;
  }
</style>
