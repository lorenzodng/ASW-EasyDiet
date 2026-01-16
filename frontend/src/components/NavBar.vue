<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isOpen = ref(false);

const Menu = () => {
  isOpen.value = !isOpen.value;
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("notificationBannerDismissed");
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="navbar">
    <button class="menu-btn" @click="Menu">
      ☰ <span>Area personale</span>
    </button>

    <div v-if="isOpen" class="menu">
      <router-link to="/home" @click="Menu">🏠 Home</router-link>
      <router-link to="/informazioni-personali" @click="Menu">
        👤 Info personali
      </router-link>
      <router-link :to="{ name: 'ComponiDieta' }" @click="Menu">
        🥗 Componi Dieta
      </router-link>
      <router-link :to="{ name: 'TrackingPeso' }" @click="Menu">
        📊 I tuoi progressi
      </router-link>



      <button class="logout" @click="logout"> Logout</button>
    </div>
  </div>
</template>


<style scoped lang="scss">
.navbar {
  position: relative;
}

//bottone
.menu-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 10px 16px;

  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}


.menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%; // centro orizzontale
  transform: translateX(-50%); // vero centraggio

  background: #ffffff;
  border-radius: 14px;
  padding: 12px;
  min-width: 220px;

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 6px;

  z-index: 100;
}

//router link
.menu a {
  text-decoration: none;
  color: #333;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;

  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #e8f5e9;
    color: #2e7d32;
  }
}

.logout {
  background: #fbe9e7;
  color: #c62828;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #ffcdd2;
  }
}
</style>


<!--guardia rotte per protezione in più-->