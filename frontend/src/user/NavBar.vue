<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const isOpen = ref(false);
  const navbarRef = ref(null);

  const handleClickOutside = (event) => {
    if (navbarRef.value && !navbarRef.value.contains(event.target)) {
      isOpen.value = false;
    }
  };

  const menu = () => {
    isOpen.value = !isOpen.value;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("notificationBannerDismissed");
    router.push({ name: "Login" });
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<template>
  <div class="navbar" ref="navbarRef">
    <button class="menu-btn" :class="{ 'active': isOpen }" @click="menu">
      ☰
    </button>

    <div v-if="isOpen" class="menu">
      <router-link to="/home" @click="menu">🏠 Home</router-link>
      <router-link to="/informazioni-personali" @click="menu">
        👤 Info personali
      </router-link>
      <router-link :to="{ name: 'ComponiDieta' }" @click="menu">
        🥗 Componi Dieta
      </router-link>
      <router-link :to="{ name: 'TrackingPeso' }" @click="menu">
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
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 10px 15px;
    transition: none;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background: rgba(255, 255, 255, 0.3);
      border-color: #000000;
    }

    &:focus {
      outline: none;
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

    //router link
    a {
      text-decoration: none;
      color: #333;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background: #e8f5e9;
        color: #2e7d32;
      }
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