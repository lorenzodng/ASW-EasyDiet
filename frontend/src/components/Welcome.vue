<script setup>
  import { useRouter } from "vue-router"
import logo from "../assets/images/logo-easydiet.png"

  const router = useRouter()

  const vaiLogin = () => {
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
      scegliendo le ricette che preferisci in base ai tuoi obiettivi e al tuo stile di vita.
    </p>

    <button class="login-button" @click="vaiLogin">Accedi</button>
  </div>
</template>

<style scoped lang="scss">
  .login-button {
  margin-top: 16px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #4caf50; // verde base
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #66bb6a; // verde più chiaro
    box-shadow: 0 0 12px rgba(76, 175, 80, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
  }
}

  .welcome {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 20px;
  }

  .logo {
  width: 340px;
  height: auto;
  margin-bottom: 8px;
}


  .subtitle {
    font-size: 20px;
    font-weight: 500;
  }

  .description {
    max-width: 500px;
    font-size: 16px;
    opacity: 0.9;
  }
</style>
