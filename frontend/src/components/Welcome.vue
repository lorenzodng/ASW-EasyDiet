<script setup>
  import { useRouter } from "vue-router"

  const router = useRouter()

  const vaiLogin = () => {
    router.push({ name: "Login" })
  }
</script>
<template>
  <div class="welcome">
    <h1>🍎 EasyDiet</h1>

    <p class="subtitle">
      Benvenuto su EasyDiet
    </p>

    <p class="description">
      Con EasyDiet puoi comporre la tua dieta personalizzata giorno per giorno,
      scegliendo le ricette che preferisci in base ai tuoi obiettivi e al tuo stile di vita.
    </p>

    <button @click="vaiLogin">Accedi</button>
  </div>
</template>

<style scoped>
  .welcome {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    text-align: center;
    padding: 20px;
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
