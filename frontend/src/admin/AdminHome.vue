<script setup>
  import { useRouter } from "vue-router"
  import logo from "../assets/images/logo-easydiet.png"

  const router = useRouter();

  const goTo = (routeName) => {
    router.push({ name: routeName });
  };

  const logout = () => {
    router.push({ name: "AdminLogin" });
  };

</script>

<template>
  <header class="admin-header">
    <div class="admin-topbar">
      <img :src="logo" alt="EasyDiet logo" class="admin-logo" />

      <div class="admin-center">
        <div class="admin-titles">
          <h1>Dashboard Amministratore</h1>
          <p>Gestione sistema EasyDiet</p>
        </div>

        <button class="logout-btn" @click="logout">
          Logout
        </button>
      </div>
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
  .admin-container {
    min-height: 100vh;
    background: #f2f8f3;
    padding: 30px;
    font-family: 'Inter', sans-serif;
  }

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
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #66bb6a;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(76, 175, 80, 0.4);
      }
    }
  }

  .admin-topbar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 32px;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    position: relative;
  }

  .admin-logo {
    position: absolute;
    left: 32px;
    height: 110px;
    cursor: pointer;
  }

  .admin-center {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 800px;
    justify-content: center;
    position: relative;
  }

  .admin-titles {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 1;

    h1 {
      font-size: 30px;
      font-weight: 800;
      color: #2e7d32;
    }

    p {
      font-size: 15px;
      color: #555;
      margin-top: 4px;
    }
  }

  .logout-btn {
    position: absolute;
    left: 1150px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    font-weight: 600;
    background: #2e7d32;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    padding: 15px 16px;

    &:hover {
      background: #388e3c;
    }
  }

</style>