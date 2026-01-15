<script setup>
import NavBar from './NavBar.vue';

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
      <img src="../assets/images/logo-easydiet.png" alt="EasyDiet logo" />
    </router-link>

    <div class="user">
  <span class="welcome">
    Benvenuto su EasyDiet,
    <strong>{{ userName }}</strong>
  </span>
  <span class="tagline">
    Nutrizione semplice, risultati reali
  </span>
</div>
<div class="nav">
    <NavBar/>
</div>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  padding: 4px 32px;
  background-color: #0cb00f;
  color: white;
}



.logo {
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    height: 110px;
    width: auto;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}


.nav {
  margin-left: auto;
  margin-right: 40px;   // ⬅️ tira la navbar verso sinistra
  display: flex;
  align-items: center;
}


.user {
  margin-left: 430px;   // ⬅️ aumenta per spostare a destra
  margin-right: auto;  // mantiene lo spazio verso la navbar
  text-align: center;

  display: flex;
  flex-direction: column;
  line-height: 1.2;
}


.welcome {
  font-size: 22px;
  font-weight: 500;
}

.welcome strong {
  font-weight: 600;
}


.tagline {
  font-size: 14px;
  opacity: 0.9;
}

</style>
