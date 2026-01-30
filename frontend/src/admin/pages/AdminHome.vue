<script setup>
  import { useRouter } from "vue-router"
  import logo from "../../assets/images/logo-easydiet.png"

  const router = useRouter();

  const goTo = (routeName) => {
    router.push({ name: routeName });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.replace({ name: "AdminLogin" });
  };

</script>

<template>
  <header class="admin-header">
    <div class="admin-topbar">
      <img :src="logo" class="admin-logo" />
      <div class="admin-titles">
        <h1>Dashboard Amministratore</h1>
        <p>Gestione sistema EasyDiet</p>
      </div>

      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </header>

  <div class="admin-actions">
    <button @click="goTo('GestioneUtenti')">
      👥 Gestione Utenti
    </button>

    <button @click="goTo('GestioneDiete')">
      🍎 Gestione Diete
    </button>

    <button @click="goTo('GestioneRicette')">
      📖 Gestione Piatti
    </button>
  </div>
</template>

<style scoped lang="scss">

  .admin-actions {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 500px;
    margin: 120px auto;

    button {
      width: 100%;
      padding: 26px;
      font-size: 18px;
      font-weight: 600;
      background-color: $green-hover;
      color: $white;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: $green-soft;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px $gray-box-shadow-green;
      }
    }
  }

  .admin-topbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    background: $white;
    border-radius: 18px;
    box-shadow: 0 6px 16px $gray-shadow;
  }

  .admin-logo {
    height: 110px;
    cursor: pointer;
    left: 32px;
  }

  .admin-center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    position: relative;
  }

  .admin-titles {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 1;

    h1 {
      font-size: 33px;
      color: $green-main;
      margin: 10px 0 0 0;
    }

    p {
      font-size: 18px;
      color: $gray-muted;
      margin-top: 10px;
      font-weight: 500;
    }
  }

  .logout-btn {
    font-size: 16px;
    font-weight: 600;
    padding: 14px 15px;
    background: $orange-light;
    color: $orange-main;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-right: 63px;
    transition: all 0.2s ease;

    &:hover {
      background: $orange-hover-light;
    }
  }

</style>