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
  <div class="admin-container">
    <header class="admin-header">
      <div class="admin-topbar">
        <img :src="logo" alt="EasyDiet logo" class="admin-logo" />
        <div class="admin-titles">
          <h1>Dashboard Amministratore</h1>
          <p>Gestione sistema EasyDiet</p>
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
        📖 Gestione Ricette
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-container {
  min-height: 100vh;
  background: #f2f8f3;
  padding: 30px;
  font-family: 'Inter', sans-serif;



}

.admin-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    color: #2e7d32;
    margin-bottom: 8px;
  }

  p {
    color: #555;
    font-size: 14px;
  }


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
  position: relative;
  display: flex;
  align-items: center;
  padding: 24px 32px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.admin-logo {
  height: 110px; // LOGO PIÙ GRANDE
  cursor: pointer;
}
.logout-btn {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    left: 500px;
    color: #ffffff;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    background: #2e7d32;
    cursor: pointer;
  }

.admin-titles {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h1 {
    font-size: 30px; // TITOLO PIÙ GRANDE
    font-weight: 800;
    color: #2e7d32;
    margin: 0;
  }

  p {
    font-size: 15px;
    color: #555;
    margin: 4px 0 0;
  }

  
}
</style>


<!--logo cliccabile-->