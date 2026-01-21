<script setup>
  import NavBar from './NavBar.vue';

  const props = defineProps({
    userName: {
      type: String,
      required: true
    },
    onlyLogout: {
      type: Boolean,
      default: false
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
      <NavBar :only-logout="onlyLogout" />
    </div>
  </header>
</template>

<style scoped lang="scss">
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 105px;
    background-color: #3da73f;
    color: white;
    z-index: 3;
  }

  .logo {
    display: flex;
    align-items: center;
    margin-left: 80px;

    img {
      height: 78px;
      width: auto;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
    }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
    margin-right: 125px;
  }

  .user {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 250px); // spazio per logo + nav
    padding: 0 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .welcome {
    font-size: 21px;
    font-weight: 500;

    strong {
      font-weight: 600;
    }
  }

  .tagline {
    font-size: 15px;
    opacity: 0.9;
  }

</style>
