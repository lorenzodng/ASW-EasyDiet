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
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="navbar">
    <button class="hamburger" @click="Menu">
      ☰
    </button>

    
    <div v-if="isOpen" class="menu">
      <router-link to="/home" @click="Menu">Home</router-link>
      <router-link to="/informazioni-personali" @click="Menu">Info personali</router-link>
      <router-link :to="{ name: 'ComponiDieta' }" @click="Menu">Componi Dieta</router-link>


      <button class="logout" @click="logout">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: relative;
}

.hamburger {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.menu a {
  text-decoration: none;
  margin: 5px 0;
  color: #333;
}

.logout {
  margin-top: 10px;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}
</style>
