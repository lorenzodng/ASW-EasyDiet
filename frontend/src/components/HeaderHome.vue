<script setup>
import NavBar from './NavBar.vue';
import logohome from "../assets/images/logo-homee.png"

  const props = defineProps({
    userName: {
      type: String,
      required: true  
    }
  });
</script>

<template>
  <header class="header">
    <router-link to="/home" class="logo">
      <img src="../assets/images/logo-homee.png" alt="EasyDiet logo" />
    </router-link>

    <div class="user">
      Ciao <strong>{{ userName }}! Un passo alla volta verso il tuo benessere 💚
</strong>
    </div>
    <NavBar/>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 32px;
  background-color: #4CAF50;
  color: white;
  overflow: visible;
  box-sizing: border-box;
}


.logo {
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    height: 80px;
    width: auto;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}


.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user {
  font-size: 18px;
  font-weight: 500;

  strong {
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
